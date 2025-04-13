import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getATSRecommendations(cvContent: string) {
  console.log('Getting ATS recommendations for CV content');
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert ATS (Applicant Tracking System) consultant. Analyze the CV content and provide specific recommendations to improve its ATS compatibility.',
        },
        {
          role: 'user',
          content: cvContent,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    console.log('Successfully got ATS recommendations');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error getting ATS recommendations:', error);
    throw error;
  }
}

export async function translateCV(cvContent: string, targetLanguage: string) {
  console.log(`Translating CV to ${targetLanguage}`);
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the following CV content to ${targetLanguage} while maintaining professional tone and technical accuracy.`,
        },
        {
          role: 'user',
          content: cvContent,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    console.log('Successfully translated CV');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error translating CV:', error);
    throw error;
  }
}

export async function improveCVContent(cvContent: string) {
  console.log('Improving CV content');
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional CV writer. Improve the following CV content by making it more impactful, professional, and ATS-friendly while maintaining the original meaning.',
        },
        {
          role: 'user',
          content: cvContent,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    console.log('Successfully improved CV content');
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error improving CV content:', error);
    throw error;
  }
} 