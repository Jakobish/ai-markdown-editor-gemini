
export interface File {
  id: string;
  name: string;
  content: string;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface Settings {
  apiKey: string;
  provider: 'gemini';
}
