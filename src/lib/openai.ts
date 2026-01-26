import OpenAI from 'openai';

function getClient(): OpenAI {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey: key });
}

export async function getATSRecommendations(cvContent: string) {
  try {
    const response = await getClient().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert ATS consultant. Analyze the CV content and provide 3–5 specific, actionable recommendations to improve ATS compatibility. Return plain text only.',
        },
        { role: 'user', content: cvContent },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    return response.choices[0].message.content ?? null;
  } catch (error) {
    console.error('Error getting ATS recommendations:', error);
    throw error;
  }
}

const JSON_ONLY =
  'Return only valid JSON. No markdown code blocks, no extra text.';

export async function translateCV(cvContent: string, targetLanguage: string) {
  try {
    const response = await getClient().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the CV JSON to ${targetLanguage}. Keep the exact same JSON structure and keys (personalInfo, workExperience, education, skills, languages, etc.). Only translate string values. ${JSON_ONLY}`,
        },
        { role: 'user', content: cvContent },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });
    return response.choices[0].message.content ?? null;
  } catch (error) {
    console.error('Error translating CV:', error);
    throw error;
  }
}

export async function improveCVContent(cvContent: string) {
  try {
    const response = await getClient().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional CV writer. Improve the CV JSON: make it more impactful, professional, and ATS-friendly. Keep the exact same JSON structure and keys. Only improve string content. ${JSON_ONLY}`,
        },
        { role: 'user', content: cvContent },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });
    return response.choices[0].message.content ?? null;
  } catch (error) {
    console.error('Error improving CV content:', error);
    throw error;
  }
} 