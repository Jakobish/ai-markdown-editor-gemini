
import React from 'react';
import { Selection } from '../types';
import { useAppContext } from '../context/AppContext';
import SourceEditor from './SourceEditor';
import WysiwygEditor from './WysiwygEditor';
import ModeToggle from './ModeToggle';

interface EditorProps {
  onSelectionChange: (selection: Selection | null) => void;
  pendingReplacement: { text: string; selection: Selection } | null;
  onReplacementApplied: () => void;
}

const isRtlText = (text: string): boolean => {
  if (!text) return false;
  const snippet = text.substring(0, 200);
  const rtlRegex = /[\u0590-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(snippet);
};

const Editor: React.FC<EditorProps> = ({
  onSelectionChange,
  pendingReplacement,
  onReplacementApplied,
}) => {
  const { activeFile, updateActiveFileContent, editorMode } = useAppContext();
  
  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a file or create a new one to start.
      </div>
    );
  }

  const isRtl = isRtlText(activeFile.content);
  
  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950">
       <div className="p-2 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-sm font-mono text-gray-400">
          <span>{editorMode === 'source' ? 'MARKDOWN / PREVIEW' : 'WYSIWYG EDITOR'}</span>
          <ModeToggle />
       </div>
       {editorMode === 'source' ? (
          <SourceEditor
            key={activeFile.id}
            content={activeFile.content}
            onContentChange={updateActiveFileContent}
            onSelectionChange={onSelectionChange}
            isRtl={isRtl}
            pendingReplacement={pendingReplacement}
            onReplacementApplied={onReplacementApplied}
          />
        ) : (
          <WysiwygEditor
            key={activeFile.id}
            content={activeFile.content}
            onContentChange={updateActiveFileContent}
            onSelectionChange={onSelectionChange}
            isRtl={isRtl}
            pendingReplacement={pendingReplacement}
            onReplacementApplied={onReplacementApplied}
          />
        )}
    </div>
  );
};

export default Editor;
