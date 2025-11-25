export interface BrandKit {
  name: string;
  colors: string[];
  fontPairing: string;
  logoUrl?: string;
  stylePreferences: string; // e.g., "Minimalist", "Bold", "Grunge"
}

export interface ThumbnailConcept {
  id: string;
  title: string;
  conceptName: string; // e.g. "Shock Reaction"
  textOverlay: string; // Max 5 words
  imagePrompt: string; // Detailed prompt for generation
  colorPalette: string[]; // Hex codes
  compositionNote: string; // "Rule of thirds, face on right"
  predictedCTRScore: number; // 0-100
  tags: string[]; // e.g. "High Energy", "Clean"
  generatedImageUrl?: string; // If image is generated
  isLoadingImage?: boolean;
}

export interface UserInput {
  videoTitle: string;
  niche: string;
  mood: string;
  colors: string; // User preference string
  uploadedImage?: File;
}

export type GenerationStatus = 'idle' | 'analyzing' | 'generating_concepts' | 'complete' | 'error';
