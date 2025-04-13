import connectDB from './db';
import CV from '@/models/CV';
import { getATSRecommendations, improveCVContent, translateCV } from '@/lib/openai';

export async function createCV(userId: string, cvData: any) {
  console.log('Creating new CV for user:', userId);
  
  try {
    await connectDB();
    
    const cv = new CV({
      userId,
      data: cvData,
      language: cvData.language || 'en',
      templateId: cvData.templateId || 'default',
    });

    await cv.save();
    console.log('Successfully created CV:', cv._id);
    
    return cv;
  } catch (error) {
    console.error('Error creating CV:', error);
    throw error;
  }
}

export async function getCVById(cvId: string) {
  console.log('Getting CV by ID:', cvId);
  
  try {
    await connectDB();
    const cv = await CV.findById(cvId);
    
    if (!cv) {
      throw new Error('CV not found');
    }
    
    console.log('Successfully retrieved CV');
    return cv;
  } catch (error) {
    console.error('Error getting CV:', error);
    throw error;
  }
}

export async function getUserCVs(userId: string) {
  console.log('Getting CVs for user:', userId);
  
  try {
    await connectDB();
    const cvs = await CV.find({ userId }).sort({ createdAt: -1 });
    
    console.log(`Found ${cvs.length} CVs for user`);
    return cvs;
  } catch (error) {
    console.error('Error getting user CVs:', error);
    throw error;
  }
}

export async function updateCV(cvId: string, updates: any) {
  console.log('Updating CV:', cvId);
  
  try {
    await connectDB();
    const cv = await CV.findByIdAndUpdate(
      cvId,
      { $set: updates },
      { new: true }
    );
    
    if (!cv) {
      throw new Error('CV not found');
    }
    
    console.log('Successfully updated CV');
    return cv;
  } catch (error) {
    console.error('Error updating CV:', error);
    throw error;
  }
}

export async function deleteCV(cvId: string) {
  console.log('Deleting CV:', cvId);
  
  try {
    await connectDB();
    const result = await CV.findByIdAndDelete(cvId);
    
    if (!result) {
      throw new Error('CV not found');
    }
    
    console.log('Successfully deleted CV');
    return result;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
}

export async function getATSReview(cvId: string) {
  console.log('Getting ATS review for CV:', cvId);
  
  try {
    const cv = await getCVById(cvId);
    const recommendations = await getATSRecommendations(JSON.stringify(cv.data));
    
    if (!recommendations) {
      throw new Error('Failed to get ATS recommendations');
    }
    
    await updateCV(cvId, {
      atsScore: Math.floor(Math.random() * 100), // This would be calculated based on actual ATS analysis
      aiSuggestions: [recommendations],
    });
    
    console.log('Successfully completed ATS review');
    return recommendations;
  } catch (error) {
    console.error('Error getting ATS review:', error);
    throw error;
  }
}

export async function translateCVContent(cvId: string, targetLanguage: string) {
  console.log(`Translating CV ${cvId} to ${targetLanguage}`);
  
  try {
    const cv = await getCVById(cvId);
    const translatedContent = await translateCV(JSON.stringify(cv.data), targetLanguage);
    
    if (!translatedContent) {
      throw new Error('Failed to translate CV content');
    }
    
    await updateCV(cvId, {
      language: targetLanguage,
      data: JSON.parse(translatedContent),
    });
    
    console.log('Successfully translated CV');
    return translatedContent;
  } catch (error) {
    console.error('Error translating CV:', error);
    throw error;
  }
}

export async function improveCV(cvId: string) {
  console.log('Improving CV:', cvId);
  
  try {
    const cv = await getCVById(cvId);
    const improvedContent = await improveCVContent(JSON.stringify(cv.data));
    
    if (!improvedContent) {
      throw new Error('Failed to improve CV content');
    }
    
    await updateCV(cvId, {
      data: JSON.parse(improvedContent),
    });
    
    console.log('Successfully improved CV');
    return improvedContent;
  } catch (error) {
    console.error('Error improving CV:', error);
    throw error;
  }
} 