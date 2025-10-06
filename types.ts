
export interface File {
  id: string;
  name: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

// FIX: Per coding guidelines, API key should not be stored in settings.
// It must be sourced from `process.env.API_KEY`.
export interface Settings {
  provider: 'gemini';
}

export type EditorMode = 'source' | 'wysiwyg';
