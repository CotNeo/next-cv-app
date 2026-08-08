import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import Application from '@/models/Application';
import { NotFound } from '@/lib/errors';
import { generateCoverLetter } from '@/lib/openai';
import { getOwnedCV } from './cvService';
import type { ValidLocale } from '@/i18n/settings';

export interface CreateCoverLetterInput {
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  language: ValidLocale;
}

/** Everything the letter generator needs, minus fields it should not see. */
function cvToPromptJSON(cv: { toObject: () => Record<string, unknown> }): string {
  const {
    _id: _ignoredId,
    userId: _ignoredUserId,
    shareToken: _ignoredToken,
    isPublic: _ignoredPublic,
    aiSuggestions: _ignoredSuggestions,
    __v: _ignoredVersion,
    ...content
  } = cv.toObject();
  return JSON.stringify(content, null, 2);
}

export async function createCoverLetter(
  cvId: string,
  userId: string,
  input: CreateCoverLetterInput
): Promise<{ applicationId: string; coverLetter: string }> {
  // Throws 404 when the CV does not exist or belongs to somebody else.
  const cv = await getOwnedCV(cvId, userId);

  const coverLetter = await generateCoverLetter({
    cvContent: cvToPromptJSON(cv),
    jobTitle: input.jobTitle,
    companyName: input.companyName,
    jobDescription: input.jobDescription ?? '',
    language: input.language,
  });

  const application = await Application.create({
    userId,
    cvId,
    jobTitle: input.jobTitle,
    companyName: input.companyName,
    jobDescription: input.jobDescription ?? '',
    coverLetter,
    language: input.language,
  });

  return {
    applicationId: application._id.toString(),
    coverLetter,
  };
}

export async function listUserApplications(userId: string) {
  await connectToDatabase();
  return Application.find({ userId })
    .select('jobTitle companyName language cvId createdAt coverLetter')
    .sort({ createdAt: -1 })
    .limit(200)
    .populate('cvId', 'title')
    .lean();
}

export async function getApplication(applicationId: string, userId: string) {
  if (!mongoose.isValidObjectId(applicationId)) throw NotFound('Application');
  await connectToDatabase();
  const application = await Application.findOne({ _id: applicationId, userId }).lean();
  if (!application) throw NotFound('Application');
  return application;
}

export async function deleteApplication(applicationId: string, userId: string) {
  if (!mongoose.isValidObjectId(applicationId)) throw NotFound('Application');
  await connectToDatabase();
  const deleted = await Application.findOneAndDelete({ _id: applicationId, userId });
  if (!deleted) throw NotFound('Application');
  return deleted;
}
