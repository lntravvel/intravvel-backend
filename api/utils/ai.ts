import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

const initializeAI = () => {
    if (!genAI && process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
};

export const generateContent = async (prompt: string): Promise<string> => {
    try {
        const ai = initializeAI();

        if (!ai) {
            throw new Error('Gemini API key not configured');
        }

        const model = ai.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('AI generation error:', error);
        throw new Error('Failed to generate content');
    }
};

export const generateServiceDescription = async (
    title: string,
    keywords: string[]
): Promise<string> => {
    const prompt = `Create a compelling travel service description for "${title}". 
  Include these keywords: ${keywords.join(', ')}. 
  Make it engaging, informative, and around 150-200 words.`;

    return generateContent(prompt);
};
