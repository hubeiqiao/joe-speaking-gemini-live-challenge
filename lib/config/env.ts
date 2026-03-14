export const LIVE_MODEL = 'gemini-2.5-flash-native-audio-preview-12-2025';
export const REVIEW_MODEL = 'gemini-2.5-flash';
export const DEFAULT_LIVE_VOICE = 'Kore';

export function getPublicAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3100';
}

export function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
