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

const COVER_LETTER_LANG: Record<string, string> = {
  tr: 'Turkish',
  en: 'English',
  de: 'German',
  fr: 'French',
};

export async function generateCoverLetter(
  cvContent: string,
  jobTitle: string,
  companyName: string,
  jobDescription: string,
  language: string = 'tr'
): Promise<string | null> {
  const langLabel = COVER_LETTER_LANG[language] ?? 'Turkish';
  try {
    const response = await getClient().chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are a professional career coach and writer. Write a compelling cover letter in ${langLabel} based on the candidate's CV and the job application details below.
Rules:
- Write only the body of the letter (no subject line, no "Dear Hiring Manager" unless appropriate for the language). Start with the opening paragraph.
- Use a professional, confident tone. Reference specific skills and experiences from the CV that match the job.
- Length: 3–4 short paragraphs. Be concise and impactful.
- Do not use markdown or bullet points. Plain text only.
- Write entirely in ${langLabel}.`,
        },
        {
          role: 'user',
          content: `CV data:\n${cvContent}\n\n---\nJob title: ${jobTitle}\nCompany: ${companyName}\n\nJob description/requirements:\n${jobDescription || '(not provided)'}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });
    return response.choices[0].message.content?.trim() ?? null;
  } catch (error) {
    console.error('Error generating cover letter:', error);
    throw error;
  }
} 