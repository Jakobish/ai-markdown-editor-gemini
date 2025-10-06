import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Selection } from '../types';
import { generateContentWithAi } from '../services/geminiService';
import { SendIcon, SparklesIcon } from './icons';

interface AiAssistantProps {
  selection: Selection | null;
  onApplyEdit: (newText: string, selection: Selection) => void;
  onShowSettings: () => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  selection,
  onApplyEdit,
  onShowSettings,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastAiEdit, setLastAiEdit] = useState<{ text: string, selection: Selection } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !input.trim()) return;
    
    // Capture selection at the time of request for stable replacements
    const currentSelection = selection;
    const isEditRequest = !!currentSelection;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLastAiEdit(null); // Clear previous edit suggestion

    const prompt = currentSelection
      ? `You are a markdown editing assistant. The user has selected the following text from their document:\n\n---\n${currentSelection.text}\n---\n\nPlease apply the following instruction: "${input}"\n\nReturn only the modified markdown text, without any explanation, preamble, or markdown block syntax.`
      : input;

    try {
      const response = await generateContentWithAi(prompt);
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages((prev) => [...prev, modelMessage]);
      if (isEditRequest && currentSelection) {
        // Associate the AI response with the specific selection it was for
        setLastAiEdit({ text: response, selection: currentSelection });
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
        {messages.length === 0 && !isLoading && (
            <div className="text-center text-sm text-gray-500 flex flex-col items-center justify-center h-full">
                <SparklesIcon className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                <p className="font-semibold">Your AI Assistant</p>
                <p>Select text in your document to edit, or just ask me anything!</p>
            </div>
        )}
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

      {lastAiEdit && (
        <div className="p-4 border-t border-gray-800">
            <button
                onClick={() => {
                    onApplyEdit(lastAiEdit.text, lastAiEdit.selection);
                    setLastAiEdit(null);
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition-colors"
            >
                Apply to Document
            </button>
        </div>
      )}

      {selection && (
        <div className="p-2 border-t border-gray-800 text-xs text-gray-400">
          <p className="font-semibold mb-1">Editing selected text:</p>
          <p className="bg-gray-800 p-2 rounded-md truncate">
            {selection.text}
          </p>
        </div>
      )}

      <div className="p-4 border-t border-gray-800">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selection ? "Instruct AI to edit..." : "Ask AI anything..."}
            className="flex-1 bg-gray-800 text-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-2 p-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistant;