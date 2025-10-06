
import React, { useState, useCallback } from 'react';
import { Selection } from './types';
import { AppProvider, useAppContext } from './context/AppContext';
import { AiProvider, useAiContext } from './context/AiContext';
import Header from './components/Header';
import FileBrowser from './components/FileBrowser';
import Editor from './components/Editor';
import AiAssistant from './components/AiAssistant';
import SettingsModal from './components/SettingsModal';
import ContextMenu from './components/ContextMenu';

const MainLayout: React.FC = () => {
  // FIX: Get `activeFile` from context to use in `handleExport`.
  const { setPendingReplacement, activeFile } = useAppContext();
  const { setLastAiEdit } = useAiContext();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; selection: Selection } | null>(null);

  const handleApplyAiEdit = useCallback((newText: string, selectionToReplace: Selection) => {
    setPendingReplacement({ text: newText, selection: selectionToReplace });
    setLastAiEdit(null);
    setSelection(null);
  }, [setPendingReplacement, setLastAiEdit]);
  
  const handleSelectionChange = useCallback((newSelection: Selection | null) => {
    if (contextMenu) return; // Don't change selection while context menu is open
    setSelection(newSelection);
  }, [contextMenu]);

  const handleExport = useCallback(() => {
    // FIX: `useAppContext` is a hook and does not have a `getState` method.
    // `activeFile` is now obtained from the hook call above and included in the dependency array.
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

  const handleContextMenu = (event: React.MouseEvent, currentSelection: Selection | null) => {
      if (currentSelection?.text) {
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY, selection: currentSelection });
      }
  };
  
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-white font-sans" onClick={handleCloseContextMenu}>
      <Header
        onShowSettings={() => setIsSettingsOpen(true)}
        onExport={handleExport}
      />
      <div className="flex flex-1 overflow-hidden">
        <FileBrowser />
        <main className="flex-1 flex">
          <Editor
            onSelectionChange={handleSelectionChange}
            onContextMenu={handleContextMenu}
          />
        </main>
        <AiAssistant 
          selection={selection}
          onApplyEdit={handleApplyAiEdit}
        />
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            selection={contextMenu.selection}
            onClose={handleCloseContextMenu}
          />
      )}
    </div>
  );
};


const App: React.FC = () => (
  <AppProvider>
    <AiProvider>
      <MainLayout />
    </AiProvider>
  </AppProvider>
);


export default App;