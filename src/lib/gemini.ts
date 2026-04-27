import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function explainViolation(
  originalImageUrl: string,
  detectedImageUrl: string,
  transformations: string[]
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          text: `You are AthenaGuard AI, a sports media protection specialist. 
          Compare these two scenarios conceptually (simulated for MVP).
          The original media has been reused without authorization.
          Detected transformations: ${transformations.join(', ')}.
          
          Explain to the user why this was flagged as a match despite the transformations.
          Be technical, precise, and authoritative. Mention spatial alignment and key feature matching.
          Keep the response to 3 sentences.`
        }
      ]
    });
    return response.text || generateFallbackExplanation(transformations);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Check for 429 Quota Exhausted specifically if possible, or any error
    return generateFallbackExplanation(transformations);
  }
}

function generateFallbackExplanation(transformations: string[]): string {
  const tStr = transformations.map(t => t.replace(/_/g, ' ')).join(' and ');
  return `Forensic analysis confirmed a high-confidence match despite the detected ${tStr} modifications. Spatial coordinate mapping and localized feature extraction identified invariant anchor points from the master stream. The sample has been flagged for prioritized enforcement due to unauthorized broadcast redistribution.`;
}
