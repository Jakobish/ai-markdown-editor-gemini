
import { GoogleGenAI } from "@google/genai";

export async function generateContentWithAi(
  apiKey: string,
  prompt: string
): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is not configured.");
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey });
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
