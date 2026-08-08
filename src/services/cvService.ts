import mongoose from 'mongoose';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import CV from '@/models/CV';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import { ApiError, NotFound } from '@/lib/errors';
import {
  getATSReview as requestATSReview,
  improveCVContent,
  translateCV,
} from '@/lib/openai';
import {
  parseJSONResponse,
  sanitizeAICVOutput,
  type CVContentInput,
} from '@/lib/validation';
import type { ValidLocale } from '@/i18n/settings';

/** Fields the dashboard list needs — deliberately excludes the base64 photo. */
const LIST_PROJECTION = 'title createdAt updatedAt atsScore templateId language isPublic';

/** Fields safe to expose on a publicly shared CV. */
const PUBLIC_PROJECTION = '-userId -shareToken -isPublic -atsScore -aiSuggestions -atsReviewedAt -__v';

function assertValidId(cvId: string): void {
  if (!mongoose.isValidObjectId(cvId)) throw NotFound('CV');
}

/**
 * The one place ownership is checked. Returning 404 rather than 403 for another
 * user's CV keeps the endpoint from confirming that an id exists.
 */
export async function getOwnedCV(cvId: string, userId: string) {
  assertValidId(cvId);
  await connectToDatabase();
  const cv = await CV.findOne({ _id: cvId, userId });
  if (!cv) throw NotFound('CV');
  return cv;
}

export async function listUserCVs(userId: string) {
  await connectToDatabase();
  return CV.find({ userId }).select(LIST_PROJECTION).sort({ createdAt: -1 }).lean();
}

export interface Quota {
  used: number;
  limit: number;
  remaining: number;
}

export async function getQuota(userId: string): Promise<Quota> {
  await connectToDatabase();
  const [used, user] = await Promise.all([
    CV.countDocuments({ userId }),
    User.findById(userId).select('cvLimit').lean(),
  ]);
  const limit = user?.cvLimit ?? getEnv().FREE_CV_LIMIT;
  return { used, limit, remaining: Math.max(0, limit - used) };
}

export async function createCV(userId: string, data: CVContentInput) {
  await connectToDatabase();

  const quota = await getQuota(userId);
  if (quota.remaining <= 0) {
    throw new ApiError(
      402,
      `CV limit reached (${quota.used}/${quota.limit}). Upgrade your plan to create more.`,
      'quota_exceeded'
    );
  }

  const cv = new CV({ ...data, userId });
  return cv.save();
}

export async function updateCV(
  cvId: string,
  userId: string,
  updates: Partial<CVContentInput>
) {
  assertValidId(cvId);
  await connectToDatabase();
  const cv = await CV.findOneAndUpdate(
    { _id: cvId, userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!cv) throw NotFound('CV');
  return cv;
}

export async function deleteCV(cvId: string, userId: string) {
  assertValidId(cvId);
  await connectToDatabase();
  const result = await CV.findOneAndDelete({ _id: cvId, userId });
  if (!result) throw NotFound('CV');
  return result;
}

/** Serialises a CV for the model, minus fields it has no business rewriting. */
function cvToPromptJSON(cv: { toObject: () => Record<string, unknown> }): string {
  const {
    _id: _ignoredId,
    userId: _ignoredUserId,
    shareToken: _ignoredToken,
    isPublic: _ignoredPublic,
    atsScore: _ignoredScore,
    aiSuggestions: _ignoredSuggestions,
    atsReviewedAt: _ignoredReviewedAt,
    createdAt: _ignoredCreatedAt,
    updatedAt: _ignoredUpdatedAt,
    __v: _ignoredVersion,
    ...content
  } = cv.toObject();
  return JSON.stringify(content, null, 2);
}

export interface ATSReviewResult {
  score: number;
  suggestions: string[];
}

export async function runATSReview(
  cvId: string,
  userId: string
): Promise<ATSReviewResult> {
  const cv = await getOwnedCV(cvId, userId);
  const review = await requestATSReview(cvToPromptJSON(cv));

  cv.set({
    atsScore: review.score,
    aiSuggestions: review.suggestions,
    atsReviewedAt: new Date(),
  });
  await cv.save();

  return review;
}

/**
 * Applies an AI rewrite to the CV.
 *
 * The model returns the whole document, so its output is parsed, narrowed to
 * the writable field set and re-validated before anything is persisted — a
 * malformed or over-eager response fails loudly instead of corrupting the CV.
 */
async function applyAIRewrite(
  cvId: string,
  userId: string,
  rewrite: (cvContent: string) => Promise<string>
) {
  const cv = await getOwnedCV(cvId, userId);
  const raw = await rewrite(cvToPromptJSON(cv));

  let updates: Partial<CVContentInput>;
  try {
    updates = sanitizeAICVOutput(parseJSONResponse(raw));
  } catch (error) {
    console.error('[cvService:applyAIRewrite]', error);
    throw new ApiError(
      502,
      'The AI returned an unusable response. Please try again.',
      'ai_invalid_response'
    );
  }

  cv.set(updates);
  await cv.save();
  return cv;
}

export async function translateCVContent(
  cvId: string,
  userId: string,
  targetLanguage: ValidLocale
) {
  const cv = await applyAIRewrite(cvId, userId, (content) =>
    translateCV(content, targetLanguage)
  );
  // The document is now written in the target language; keep labels in sync.
  cv.set({ language: targetLanguage });
  await cv.save();
  return cv;
}

export async function improveCV(cvId: string, userId: string) {
  return applyAIRewrite(cvId, userId, improveCVContent);
}

export async function getCVByShareToken(shareToken: string) {
  if (!shareToken || shareToken.length > 128) throw NotFound('CV');
  await connectToDatabase();
  const cv = await CV.findOne({ shareToken, isPublic: true })
    .select(PUBLIC_PROJECTION)
    .lean();
  if (!cv) throw NotFound('CV');
  return cv;
}

export async function generateShareToken(cvId: string, userId: string): Promise<string> {
  assertValidId(cvId);
  await connectToDatabase();
  const shareToken = crypto.randomBytes(32).toString('hex');
  const cv = await CV.findOneAndUpdate(
    { _id: cvId, userId },
    { $set: { shareToken, isPublic: true } },
    { new: true }
  );
  if (!cv) throw NotFound('CV');
  return shareToken;
}

export async function revokeShareToken(cvId: string, userId: string) {
  assertValidId(cvId);
  await connectToDatabase();
  const cv = await CV.findOneAndUpdate(
    { _id: cvId, userId },
    // $unset rather than null: the unique sparse index rejects a second null.
    { $unset: { shareToken: '' }, $set: { isPublic: false } },
    { new: true }
  );
  if (!cv) throw NotFound('CV');
  return cv;
}
