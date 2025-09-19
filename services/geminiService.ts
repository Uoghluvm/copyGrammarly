
import { GoogleGenAI, Type } from "@google/genai";
import type { Suggestion } from '../types';
import { SuggestionType } from '../types';

// This is a placeholder for the API key.
// In a real application, this should be handled securely and not hardcoded.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid key.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });


const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        original: {
          type: Type.STRING,
          description: 'The exact phrase or word from the original text that needs correction.',
        },
        correction: {
          type: Type.STRING,
          description: 'The corrected version of the phrase or word.',
        },
        explanation: {
          type: Type.STRING,
          description: 'A brief, clear explanation of why the change is recommended.',
        },
        type: {
            type: Type.STRING,
            enum: Object.values(SuggestionType),
            description: 'The category of the suggestion (e.g., Grammar, Clarity, Style).',
        }
      },
      required: ['original', 'correction', 'explanation', 'type'],
    },
};

const systemInstruction = `You are an expert writing assistant like Grammarly. Your task is to analyze the user's text and identify errors in grammar, spelling, punctuation, clarity, style, and conciseness. For each error you find, you must provide a correction and a clear, concise explanation.

Follow these rules strictly:
1.  Analyze the entire provided text for any issues.
2.  For each identified issue, generate a suggestion object containing the original incorrect text, the corrected text, a brief explanation, and the type of error.
3.  The 'original' field in your response must be an exact substring from the user's input text.
4.  Provide explanations that are helpful and educational for the user.
5.  If the text is perfect and has no errors, return an empty array.
6.  Your response MUST conform to the provided JSON schema. Do not output anything other than the JSON array.`;

export const getWritingSuggestions = async (text: string): Promise<Suggestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: text,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonStr = response.text.trim();
        if (!jsonStr) {
            return [];
        }
        
        const suggestions = JSON.parse(jsonStr);

        // Filter out any potentially malformed entries
        return suggestions.filter((s: any) => 
            s.original && s.correction && s.explanation && s.type && Object.values(SuggestionType).includes(s.type)
        );

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get suggestions from the AI. Please check your API key and try again.");
    }
};
