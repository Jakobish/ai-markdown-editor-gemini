import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;
let initError: string | null = null;

try {
  // Per coding guidelines, the API key must come from process.env.API_KEY.
  // A missing key would crash the app, so we handle it gracefully.
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure it to use the AI Assistant.");
  }
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (error) {
  console.error("Failed to initialize GoogleGenAI:", error);
  initError = error instanceof Error ? error.message : "An unknown error occurred during AI initialization.";
}


export async function generateContentWithAi(
  prompt: string
): Promise<string> {
  if (initError || !ai) {
    return `Error: AI service is not available. ${initError || ''}`.trim();
  }
  
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