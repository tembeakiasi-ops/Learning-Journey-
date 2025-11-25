import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BrandKit, ThumbnailConcept, UserInput } from "../types";

// Initialize Gemini
// NOTE: Process.env.API_KEY is assumed to be available in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const JSON_SCHEMA_CONCEPTS: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      conceptName: { type: Type.STRING, description: "Short catchy name for the design concept" },
      textOverlay: { type: Type.STRING, description: "Main text on thumbnail, max 5 words, high impact" },
      imagePrompt: { type: Type.STRING, description: "Highly detailed Stable Diffusion/Imagen style prompt describing subject, lighting, camera angle, and background" },
      colorPalette: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of 3 hex color codes" },
      compositionNote: { type: Type.STRING, description: "Instructions on placement of elements (e.g. Face right, text left)" },
      predictedCTRScore: { type: Type.NUMBER, description: "Estimated CTR score 80-99" },
      tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Keywords like 'Bold', 'Minimal', 'Emotional'" }
    },
    required: ["conceptName", "textOverlay", "imagePrompt", "colorPalette", "compositionNote", "predictedCTRScore", "tags"],
  }
};

export const generateThumbnailConcepts = async (
  input: UserInput,
  brandKit?: BrandKit
): Promise<ThumbnailConcept[]> => {
  const model = "gemini-2.5-flash"; // Good for logic/JSON
  
  const brandingContext = brandKit 
    ? `Apply Brand Kit: Colors [${brandKit.colors.join(', ')}], Style: ${brandKit.stylePreferences}.` 
    : "No specific brand kit. Use industry best practices for the niche.";

  const prompt = `
    Act as a world-class YouTube Thumbnail Strategist and Designer.
    
    Task: Generate 4 distinct thumbnail concepts for a video.
    
    Video Info:
    - Title: "${input.videoTitle}"
    - Niche: "${input.niche}"
    - Desired Mood: "${input.mood}"
    - User Colors/Prefs: "${input.colors}"
    
    ${brandingContext}
    
    Design Principles (Mobile First):
    - Text must be HUGE and readable (max 5 words).
    - High contrast colors.
    - Clear subject focus (Face or Object).
    - Emotional hook (Curiosity, Shock, Joy, Fear).
    
    Output requirements:
    1. "High Energy" variant (Bright, loud, expressive)
    2. "Minimalist/Clean" variant (Negative space, clear subject)
    3. "Storyteller" variant (Intriguing background, action shot)
    4. "A/B Test Wildcard" variant (Something unexpected)
    
    Return ONLY valid JSON matching the schema provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: JSON_SCHEMA_CONCEPTS,
        temperature: 0.7, // Creativity allowed
      },
    });

    const data = JSON.parse(response.text || "[]");
    
    // Map to our internal type and add IDs
    return data.map((item: any, index: number) => ({
      ...item,
      id: `concept-${Date.now()}-${index}`,
      title: input.videoTitle, // Pass through original title
      generatedImageUrl: undefined,
      isLoadingImage: false
    }));

  } catch (error) {
    console.error("Gemini Concept Generation Error:", error);
    throw new Error("Failed to generate concepts. Please check your API key or try again.");
  }
};

export const generateThumbnailImage = async (concept: ThumbnailConcept): Promise<string> => {
  // Use Gemini Image model
  const model = "gemini-2.5-flash-image"; 
  
  // Refine prompt for the image generator to ensure aspect ratio and quality
  const imageGenPrompt = `
    Create a high quality YouTube thumbnail image (16:9 aspect ratio).
    style: Photorealistic, 4k, sharp focus, high contrast.
    
    Scene Description: ${concept.imagePrompt}
    
    Important: 
    - Leave negative space for text overlay as described: "${concept.compositionNote}".
    - Do NOT add text to the image itself. I will add text programmatically later. 
    - Make it pop on a small screen.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: imageGenPrompt,
    });
    
    // Iterate through parts to find the image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    // Fallback for demo if API fails or quota exceeded, or strictly just throw
    throw error;
  }
};
