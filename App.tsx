
import React, { useState, useCallback } from 'react';
import { Selection } from './types';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import FileBrowser from './components/FileBrowser';
import Editor from './components/Editor';
import AiAssistant from './components/AiAssistant';
import SettingsModal from './components/SettingsModal';

const MainLayout: React.FC = () => {
  const { activeFile } = useAppContext();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pendingReplacement, setPendingReplacement] = useState<{ text: string; selection: Selection } | null>(null);

  const handleApplyAiEdit = useCallback((newText: string, selectionToReplace: Selection) => {
    if (!activeFile) return;
    setPendingReplacement({ text: newText, selection: selectionToReplace });
    setSelection(null);
  }, [activeFile]);
  
  const handleSelectionChange = useCallback((newSelection: Selection | null) => {
    if (pendingReplacement) return;
    setSelection(newSelection);
  }, [pendingReplacement]);

  const handleExport = useCallback(() => {
      if (activeFile) {
          const blob = new Blob([activeFile.content], { type: 'text/markdown;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${activeFile.name.replace(/ /g, '_')}.md`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
      }
  }, [activeFile]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-white font-sans">
      <Header
        onShowSettings={() => setIsSettingsOpen(true)}
        onExport={handleExport}
      />
      <div className="flex flex-1 overflow-hidden">
        <FileBrowser />
        <main className="flex-1 flex">
          <Editor
            onSelectionChange={handleSelectionChange}
            pendingReplacement={pendingReplacement}
            onReplacementApplied={() => setPendingReplacement(null)}
          />
        </main>
        <AiAssistant 
          selection={selection}
          onApplyEdit={handleApplyAiEdit}
          onShowSettings={() => setIsSettingsOpen(true)}
        />
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};


const App: React.FC = () => (
  <AppProvider>
    <MainLayout />
  </AppProvider>
);


export default App;
