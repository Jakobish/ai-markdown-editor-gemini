import React, { useEffect, useRef } from 'react';
import { Selection } from '../types';
import { useAppContext } from '../context/AppContext';
import { useAiContext } from '../context/AiContext';
import { CutIcon, CopyIcon, PasteIcon, BoldIcon, ItalicIcon, SparklesIcon } from './icons';

interface ContextMenuProps {
  x: number;
  y: number;
  selection: Selection;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, selection, onClose }) => {
  const { editorMode, setPendingReplacement } = useAppContext();
  const { sendAiRequest } = useAiContext();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    // Use timeout to prevent immediate closing from the same click that opened it
    setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (callback: () => void) => {
    callback();
    onClose();
  };

  const handleCopy = () => handleAction(() => navigator.clipboard.writeText(selection.text));
  const handleCut = () => handleAction(() => {
    navigator.clipboard.writeText(selection.text);
    setPendingReplacement({ text: '', selection });
  });

  const handlePaste = async () => handleAction(async () => {
    const text = await navigator.clipboard.readText();
    setPendingReplacement({ text, selection });
  });

  const handleFormat = (format: 'bold' | 'italic') => handleAction(() => {
    const newText = format === 'bold' ? `**${selection.text}**` : `*${selection.text}*`;
    setPendingReplacement({ text: newText, selection });
  });

  const handleAiAction = (prompt: string) => handleAction(() => {
    sendAiRequest(prompt, selection);
  });
  
  const aiActions = [
      { label: 'Fix Spelling & Grammar', prompt: 'Fix spelling and grammar. Return only the corrected text.'},
      { label: 'Summarize', prompt: 'Summarize the text. Return only the summary.'},
      { label: 'Make Shorter', prompt: 'Make the text shorter. Return only the modified text.'},
      { label: 'Make Longer', prompt: 'Make the text longer. Return only the modified text.'},
      { label: 'Change Tone to Professional', prompt: 'Rewrite the text in a professional tone. Return only the modified text.'},
      { label: 'Change Tone to Casual', prompt: 'Rewrite the text in a casual tone. Return only the modified text.'},
  ];

  const menuStyle: React.CSSProperties = {
    top: `${y}px`,
    left: `${x}px`,
  };

  return (
    <div
      ref={menuRef}
      style={menuStyle}
      className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 w-56 z-50 text-sm text-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
        <MenuItem icon={<CopyIcon className="w-4 h-4" />} onClick={handleCopy}>Copy</MenuItem>
        <MenuItem icon={<CutIcon className="w-4 h-4" />} onClick={handleCut}>Cut</MenuItem>
        <MenuItem icon={<PasteIcon className="w-4 h-4" />} onClick={handlePaste}>Paste</MenuItem>

        {editorMode === 'source' && <>
            <MenuSeparator />
            <MenuItem icon={<BoldIcon className="w-4 h-4" />} onClick={() => handleFormat('bold')}>Bold</MenuItem>
            <MenuItem icon={<ItalicIcon className="w-4 h-4" />} onClick={() => handleFormat('italic')}>Italic</MenuItem>
        </>}
        
        <MenuSeparator />
        
        <div className="px-3 py-1 text-xs text-gray-400 flex items-center">
            <SparklesIcon className="w-4 h-4 mr-2" />
            <span>AI Actions</span>
        </div>
        {aiActions.map(action => (
             <MenuItem key={action.label} onClick={() => handleAiAction(action.prompt)}>{action.label}</MenuItem>
        ))}
    </div>
  );
};

const MenuItem = ({ children, onClick, icon }: { children: React.ReactNode, onClick: () => void, icon?: React.ReactNode }) => (
    <button onClick={onClick} className="w-full text-left px-3 py-1.5 hover:bg-blue-600 flex items-center">
        {icon && <span className="mr-3 text-gray-400">{icon}</span>}
        {children}
    </button>
);

const MenuSeparator = () => <div className="h-px bg-gray-700 my-1"></div>;

export default ContextMenu;
