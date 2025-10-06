
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Settings } from '../types';
import { generateContentWithAi } from '../services/geminiService';
import { SendIcon, SparklesIcon } from './icons';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_SETTINGS_KEY } from '../constants';

interface AiAssistantProps {
  selectedText: string;
  onApplyEdit: (newText: string) => void;
  onShowSettings: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  selectedText,
  onApplyEdit,
  onShowSettings,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [settings] = useLocalStorage<Settings>(LOCAL_STORAGE_SETTINGS_KEY, {
    apiKey: '',
    provider: 'gemini',
  });
  const [lastAiResponse, setLastAiResponse] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !input.trim()) return;

    if (!settings.apiKey) {
      setMessages([
        ...messages,
        { role: 'user', content: input },
        {
          role: 'system',
          content: 'API key not found. Please set your Gemini API key in the settings.',
        },
      ]);
      return;
    }

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLastAiResponse(null);

    const prompt = selectedText
      ? `You are a markdown editing assistant. The user has selected the following text from their document:\n\n---\n${selectedText}\n---\n\nPlease apply the following instruction: "${input}"\n\nReturn only the modified markdown text, without any explanation, preamble, or markdown block syntax.`
      : input;

    try {
      const response = await generateContentWithAi(settings.apiKey, prompt);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages((prev) => [...prev, modelMessage]);
      if (selectedText) {
        setLastAiResponse(response);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'system',
        content: error instanceof Error ? error.message : 'An unknown error occurred.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-80 bg-gray-900 flex flex-col h-full border-l border-gray-800">
      <div className="p-4 border-b border-gray-800 flex items-center">
        <SparklesIcon className="w-5 h-5 mr-2 text-purple-400" />
        <h2 className="text-sm font-bold text-gray-200">AI Assistant</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : msg.role === 'model'
                  ? 'bg-gray-700 text-gray-200'
                  : 'bg-red-900/50 text-red-300 w-full'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200">
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150 mr-2"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {lastAiResponse && (
        <div className="p-4 border-t border-gray-800">
            <button
                onClick={() => onApplyEdit(lastAiResponse)}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-md"
            >
                Apply to Document
            </button>
        </div>
      )}

      {selectedText && (
        <div className="p-2 border-t border-gray-800 text-xs text-gray-400">
          <p className="font-semibold mb-1">Editing selected text:</p>
          <p className="bg-gray-800 p-2 rounded-md truncate">
            {selectedText}
          </p>
        </div>
      )}

      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedText ? "Instruct AI to edit..." : "Ask AI anything..."}
            className="flex-1 bg-gray-800 text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
        {!settings.apiKey && (
            <p className="text-xs text-amber-400 mt-2 text-center">
                API key not set. Please <button onClick={onShowSettings} className="underline hover:text-amber-300">configure it</button>.
            </p>
        )}
      </div>
    </div>
  );
};

export default AiAssistant;
