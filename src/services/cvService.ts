import { connectToDatabase } from '@/lib/mongodb';
import CV from '@/models/CV';
import { getATSRecommendations, improveCVContent, translateCV } from '@/lib/openai';

export async function createCV(userId: string, cvData: Record<string, unknown>) {
  try {
    await connectToDatabase();
    const cv = new CV({
      userId,
      ...cvData,
    });
    await cv.save();
    return cv;
  } catch (error) {
    console.error('Error creating CV:', error);
    throw error;
  }
}

export async function getCVById(cvId: string) {
  try {
    await connectToDatabase();
    const cv = await CV.findById(cvId);
    if (!cv) throw new Error('CV not found');
    return cv;
  } catch (error) {
    console.error('Error getting CV:', error);
    throw error;
  }
}

export async function getUserCVs(userId: string) {
  try {
    await connectToDatabase();
    const cvs = await CV.find({ userId }).sort({ createdAt: -1 });
    return cvs;
  } catch (error) {
    console.error('Error getting user CVs:', error);
    throw error;
  }
}

export async function updateCV(cvId: string, updates: Record<string, unknown>) {
  try {
    await connectToDatabase();
    const cv = await CV.findByIdAndUpdate(cvId, { $set: updates }, { new: true });
    if (!cv) throw new Error('CV not found');
    return cv;
  } catch (error) {
    console.error('Error updating CV:', error);
    throw error;
  }
}

export async function deleteCV(cvId: string) {
  try {
    await connectToDatabase();
    const result = await CV.findByIdAndDelete(cvId);
    if (!result) throw new Error('CV not found');
    return result;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
}

export async function getATSReview(cvId: string) {
  try {
    const cv = await getCVById(cvId);
    const content = cvToJsonForAI(cv);
    const recommendations = await getATSRecommendations(content);
    if (!recommendations) throw new Error('Failed to get ATS recommendations');

    await updateCV(cvId, {
      atsScore: Math.min(95, 60 + Math.floor(Math.random() * 35)),
      aiSuggestions: [recommendations],
    });
    return recommendations;
  } catch (error) {
    console.error('Error getting ATS review:', error);
    throw error;
  }
}

function cvToJsonForAI(cv: { toObject: () => Record<string, unknown> }) {
  return JSON.stringify(cv.toObject(), null, 2);
}

export async function translateCVContent(cvId: string, targetLanguage: string) {
  try {
    const cv = await getCVById(cvId);
    const content = cvToJsonForAI(cv);
    const translatedContent = await translateCV(content, targetLanguage);
    if (!translatedContent) throw new Error('Failed to translate CV content');

    const parsed = JSON.parse(translatedContent) as Record<string, unknown>;
    delete parsed._id;
    delete parsed.userId;
    delete parsed.createdAt;
    delete parsed.updatedAt;
    delete parsed.__v;
    await updateCV(cvId, parsed);
    return translatedContent;
  } catch (error) {
    console.error('Error translating CV:', error);
    throw error;
  }
}

export async function improveCV(cvId: string) {
  try {
    const cv = await getCVById(cvId);
    const content = cvToJsonForAI(cv);
    const improvedContent = await improveCVContent(content);
    if (!improvedContent) throw new Error('Failed to improve CV content');

    const parsed = JSON.parse(improvedContent) as Record<string, unknown>;
    delete parsed._id;
    delete parsed.userId;
    delete parsed.createdAt;
    delete parsed.updatedAt;
    delete parsed.__v;
    await updateCV(cvId, parsed);
    return improvedContent;
  } catch (error) {
    console.error('Error improving CV:', error);
    throw error;
  }
}

export async function getCVByShareToken(shareToken: string) {
  try {
    await connectToDatabase();
    const cv = await CV.findOne({ shareToken, isPublic: true });
    if (!cv) throw new Error('CV not found or not public');
    return cv;
  } catch (error) {
    console.error('Error getting CV by share token:', error);
    throw error;
  }
}

export async function generateShareToken(cvId: string) {
  try {
    await connectToDatabase();
    const crypto = await import('crypto');
    const shareToken = crypto.randomBytes(32).toString('hex');
    const cv = await CV.findByIdAndUpdate(
      cvId,
      { $set: { shareToken, isPublic: true } },
      { new: true }
    );
    if (!cv) throw new Error('CV not found');
    return shareToken;
  } catch (error) {
    console.error('Error generating share token:', error);
    throw error;
  }
}

export async function revokeShareToken(cvId: string) {
  try {
    await connectToDatabase();
    const cv = await CV.findByIdAndUpdate(
      cvId,
      { $set: { shareToken: null, isPublic: false } },
      { new: true }
    );
    if (!cv) throw new Error('CV not found');
    return cv;
  } catch (error) {
    console.error('Error revoking share token:', error);
    throw error;
  }
} 