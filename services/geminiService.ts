
import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, initialize GoogleGenAI with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateContentWithAi(
  prompt: string
): Promise<string> {
  // FIX: API key is now handled by the GoogleGenAI instance.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred while contacting the AI.";
  }
}
