import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ChatMessage, Selection } from '../types';
import { generateContentWithAi } from '../services/geminiService';

interface AiContextState {
  messages: ChatMessage[];
  isLoading: boolean;
  lastAiEdit: { text: string; selection: Selection } | null;
  sendAiRequest: (input: string, selection: Selection | null) => Promise<void>;
  setLastAiEdit: (edit: { text: string; selection: Selection } | null) => void;
}

const AiContext = createContext<AiContextState | undefined>(undefined);

export const AiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAiEdit, setLastAiEdit] = useState<{ text: string; selection: Selection } | null>(null);

  const sendAiRequest = useCallback(async (input: string, selection: Selection | null) => {
    if (isLoading || !input.trim()) return;

    const isEditRequest = !!selection;
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setLastAiEdit(null);

    const prompt = selection
      ? `You are a markdown editing assistant. The user has selected the following text from their document:\n\n---\n${selection.text}\n---\n\nPlease apply the following instruction: "${input}"\n\nReturn only the modified markdown text, without any explanation, preamble, or markdown block syntax.`
      : input;

    try {
      const response = await generateContentWithAi(prompt);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages((prev) => [...prev, modelMessage]);
      if (isEditRequest && selection) {
        setLastAiEdit({ text: response, selection: selection });
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'system',
        content: "An error occurred while communicating with the AI. Please check the console for details.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const value = {
    messages,
    isLoading,
    lastAiEdit,
    sendAiRequest,
    setLastAiEdit,
  };

  return <AiContext.Provider value={value}>{children}</AiContext.Provider>;
};

export const useAiContext = (): AiContextState => {
  const context = useContext(AiContext);
  if (context === undefined) {
    throw new Error('useAiContext must be used within an AiProvider');
  }
  return context;
};
