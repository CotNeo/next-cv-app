import OpenAI from 'openai';
import { getEnv } from '@/lib/env';
import { ApiError, ServiceUnavailable } from '@/lib/errors';
import { parseJSONResponse } from '@/lib/validation';
import { LANGUAGE_LABELS } from '@/i18n/settings';
import type { ValidLocale } from '@/i18n/settings';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  const env = getEnv();
  if (!env.OPENAI_API_KEY) {
    throw ServiceUnavailable(
      'AI features are not configured on this server',
      'ai_unavailable'
    );
  }
  client ??= new OpenAI({
    apiKey: env.OPENAI_API_KEY,
    // Long CVs can take a while; fail before the platform's own gateway does.
    timeout: 60_000,
    maxRetries: 2,
  });
  return client;
}

function model(): string {
  return getEnv().OPENAI_MODEL;
}

/**
 * Translates provider failures into statuses the client can act on. Rate limits
 * and outages are the caller's problem to retry, not a bug to report as a 500.
 */
function toApiError(error: unknown, action: string): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof OpenAI.APIError) {
    if (error.status === 429) {
      return new ApiError(429, 'AI provider rate limit reached. Try again shortly.', 'ai_rate_limited');
    }
    if (error.status === 401 || error.status === 403) {
      console.error(`[openai:${action}] credentials rejected`, error.message);
      return ServiceUnavailable('AI features are misconfigured', 'ai_unavailable');
    }
    if (error.status && error.status >= 500) {
      return ServiceUnavailable('AI provider is temporarily unavailable', 'ai_upstream');
    }
  }

  console.error(`[openai:${action}]`, error);
  return new ApiError(502, `Failed to ${action}`, 'ai_failed');
}

async function complete(options: {
  action: string;
  system: string;
  user: string;
  temperature: number;
  maxTokens: number;
  json?: boolean;
}): Promise<string> {
  try {
    const response = await getClient().chat.completions.create({
      model: model(),
      messages: [
        { role: 'system', content: options.system },
        { role: 'user', content: options.user },
      ],
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      ...(options.json ? { response_format: { type: 'json_object' as const } } : {}),
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) throw new ApiError(502, `Failed to ${options.action}`, 'ai_empty_response');
    return content;
  } catch (error) {
    throw toApiError(error, options.action);
  }
}

export interface ATSReview {
  /** 0–100 ATS compatibility score reported by the model. */
  score: number;
  suggestions: string[];
}

/**
 * Asks for a score and recommendations in one structured response, so the score
 * shown to the user actually reflects the reviewed content.
 */
export async function getATSReview(cvContent: string): Promise<ATSReview> {
  const content = await complete({
    action: 'review CV',
    system: `You are an expert ATS (Applicant Tracking System) consultant.
Analyse the CV JSON and judge how well it would perform against automated screening.
Respond with JSON of exactly this shape:
{"score": <integer 0-100>, "suggestions": ["<specific, actionable recommendation>", ...]}
Give 3-6 suggestions. Base the score on keyword coverage, section completeness, quantified achievements, formatting and parseability. Be honest: a sparse CV should score low.`,
    user: cvContent,
    temperature: 0.3,
    maxTokens: 1200,
    json: true,
  });

  const parsed = parseJSONResponse(content) as { score?: unknown; suggestions?: unknown };

  const rawScore = Number(parsed.score);
  if (!Number.isFinite(rawScore)) {
    throw new ApiError(502, 'AI response did not include a score', 'ai_invalid_response');
  }
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  const suggestions = Array.isArray(parsed.suggestions)
    ? parsed.suggestions
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim())
        .slice(0, 10)
    : [];

  if (suggestions.length === 0) {
    throw new ApiError(502, 'AI response did not include suggestions', 'ai_invalid_response');
  }

  return { score, suggestions };
}

const JSON_CONTRACT = `Respond with a single JSON object. Keep the exact same keys and array shapes as the input. Only change string values. Do not add, remove or reorder entries. Do not wrap the response in markdown.`;

export async function translateCV(
  cvContent: string,
  targetLanguage: ValidLocale
): Promise<string> {
  return complete({
    action: 'translate CV',
    system: `You are a professional translator specialising in résumés. Translate every human-readable string in the CV JSON into ${LANGUAGE_LABELS[targetLanguage]}. Leave proper nouns (company names, product names, technologies) untranslated. ${JSON_CONTRACT}`,
    user: cvContent,
    temperature: 0.2,
    maxTokens: 4000,
    json: true,
  });
}

export async function improveCVContent(cvContent: string): Promise<string> {
  return complete({
    action: 'improve CV',
    system: `You are a professional CV writer. Rewrite the string content of the CV JSON to be more impactful, concise and ATS-friendly: use strong action verbs, quantify achievements where the data allows, and remove filler. Never invent facts, employers, dates or numbers that are not present in the input. Keep the original language of the content. ${JSON_CONTRACT}`,
    user: cvContent,
    temperature: 0.5,
    maxTokens: 4000,
    json: true,
  });
}

export async function generateCoverLetter(input: {
  cvContent: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  language: ValidLocale;
}): Promise<string> {
  const languageLabel = LANGUAGE_LABELS[input.language];

  return complete({
    action: 'generate cover letter',
    system: `You are a professional career coach and writer. Write a compelling cover letter in ${languageLabel} based on the candidate's CV and the job details.
Rules:
- Write only the body of the letter. Start with the opening paragraph; no subject line and no signature block.
- Professional, confident tone. Reference specific skills and experience from the CV that match the job.
- 3-4 short paragraphs. Concise and impactful.
- Plain text only: no markdown, no bullet points.
- Never invent qualifications the CV does not support.
- Write entirely in ${languageLabel}.`,
    user: `CV data:
${input.cvContent}

---
Job title: ${input.jobTitle}
Company: ${input.companyName}

Job description/requirements:
${input.jobDescription || '(not provided)'}`,
    temperature: 0.7,
    maxTokens: 1500,
  });
}
