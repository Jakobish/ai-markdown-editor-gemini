import React from 'react';
import { SettingsIcon, SunIcon, MoonIcon, DownloadIcon } from './icons';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onShowSettings: () => void;
  onExport: () => void;
  activeFileName: string;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onShowSettings, onExport, activeFileName }) => {
  return (
    <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 text-gray-300">
      <div className="flex items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-semibold text-white">AI Markdown Editor /</span>
        <span className="ml-2 text-gray-400">{activeFileName}</span>
      </div>
      <div className="flex items-center space-x-4">
         <div className="text-sm text-gray-400">
            Saved to browser
        </div>
        <button onClick={onExport} className="p-2 rounded-md hover:bg-gray-800" aria-label="Export file">
          <DownloadIcon className="w-5 h-5" />
        </button>
        <button onClick={onToggleTheme} className="p-2 rounded-md hover:bg-gray-800" aria-label="Toggle theme">
          {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
        <button onClick={onShowSettings} className="p-2 rounded-md hover:bg-gray-800" aria-label="Settings">
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Header;