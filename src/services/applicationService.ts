import { connectToDatabase } from '@/lib/mongodb';
import Application from '@/models/Application';
import { getCVById } from './cvService';
import { generateCoverLetter } from '@/lib/openai';

function cvToTextForAI(cv: { toObject: () => Record<string, unknown> }): string {
  return JSON.stringify(cv.toObject(), null, 2);
}

export interface CreateCoverLetterInput {
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  language?: string;
}

export async function createCoverLetter(
  cvId: string,
  userId: string,
  input: CreateCoverLetterInput
): Promise<{ applicationId: string; coverLetter: string }> {
  await connectToDatabase();
  const cv = await getCVById(cvId);
  if (cv.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  const cvContent = cvToTextForAI(cv);
  const language = input.language ?? 'tr';
  const coverLetter = await generateCoverLetter(
    cvContent,
    input.jobTitle,
    input.companyName,
    input.jobDescription ?? '',
    language
  );

  if (!coverLetter) {
    throw new Error('Failed to generate cover letter');
  }

  const app = new Application({
    userId,
    cvId,
    jobTitle: input.jobTitle,
    companyName: input.companyName,
    jobDescription: input.jobDescription ?? '',
    coverLetter,
    language,
  });
  await app.save();

  return {
    applicationId: app._id.toString(),
    coverLetter,
  };
}

export async function getApplicationsByUser(userId: string) {
  await connectToDatabase();
  return Application.find({ userId })
    .sort({ createdAt: -1 })
    .populate('cvId', 'title')
    .lean();
}

export async function getApplicationById(
  applicationId: string,
  userId: string
) {
  await connectToDatabase();
  const app = await Application.findById(applicationId).lean();
  if (!app || app.userId.toString() !== userId) {
    throw new Error('Application not found');
  }
  return app;
}
