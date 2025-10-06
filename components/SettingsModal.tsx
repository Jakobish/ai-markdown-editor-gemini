
import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Settings } from '../types';
import { LOCAL_STORAGE_SETTINGS_KEY } from '../constants';
import { XIcon } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // FIX: Per coding guidelines, API key is removed from settings.
  const [settings] = useLocalStorage<Settings>(LOCAL_STORAGE_SETTINGS_KEY, {
    provider: 'gemini',
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 transition-opacity duration-300" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-95" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">AI Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-400 mb-2">
            AI Provider
          </label>
          <select
            id="provider"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={settings.provider}
            disabled
          >
            <option value="gemini">Google Gemini</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">More providers will be available in the future.</p>
        </div>
        {/* FIX: Removed API key input to comply with Gemini API coding guidelines. */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
