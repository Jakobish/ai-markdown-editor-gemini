
import React, { useState, useEffect, useCallback } from 'react';
import { File } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_FILE_CONTENT, LOCAL_STORAGE_FILES_KEY } from './constants';
import Header from './components/Header';
import FileBrowser from './components/FileBrowser';
import Editor from './components/Editor';
import AiAssistant from './components/AiAssistant';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [files, setFiles] = useLocalStorage<File[]>(LOCAL_STORAGE_FILES_KEY, []);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Initialize with a default file if none exist
  useEffect(() => {
    if (files.length === 0) {
      const newFile: File = {
        id: crypto.randomUUID(),
        name: 'Untitled',
        content: DEFAULT_FILE_CONTENT,
      };
      setFiles([newFile]);
      setActiveFileId(newFile.id);
    } else if (!activeFileId && files.length > 0) {
      setActiveFileId(files[0].id);
    }
  }, [files, setFiles, activeFileId]);

  const activeFile = files.find((f) => f.id === activeFileId);

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleAddFile = () => {
    const newFile: File = {
      id: crypto.randomUUID(),
      name: `Untitled ${files.length + 1}`,
      content: `# New File\n`,
    };
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    if (activeFileId === id) {
      setActiveFileId(files.length > 1 ? files.filter(f => f.id !== id)[0].id : null);
    }
  };

  const handleRenameFile = (id: string, newName: string) => {
    setFiles(
      files.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  };
  
  const handleContentChange = useCallback((content: string) => {
    if (activeFileId) {
      setFiles(files.map(f => f.id === activeFileId ? {...f, content} : f));
    }
  }, [activeFileId, files, setFiles]);

  const handleApplyAiEdit = (newText: string) => {
    if (!activeFile || !selectedText) return;

    // A simple replacement for now. A more advanced implementation would use ranges.
    const newContent = activeFile.content.replace(selectedText, newText);
    handleContentChange(newContent);
  };

  const handleExport = () => {
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
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-950 text-white font-sans">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onShowSettings={() => setIsSettingsOpen(true)}
        onExport={handleExport}
        activeFileName={activeFile?.name || 'No file selected'}
      />
      <div className="flex flex-1 overflow-hidden">
        <FileBrowser
          files={files}
          activeFileId={activeFileId}
          onSelectFile={setActiveFileId}
          onAddFile={handleAddFile}
          onDeleteFile={handleDeleteFile}
          onRenameFile={handleRenameFile}
        />
        <main className="flex-1 flex">
          {activeFile ? (
            <Editor
              key={activeFile.id}
              content={activeFile.content}
              onContentChange={handleContentChange}
              onSelectionChange={setSelectedText}
              theme={theme}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a file or create a new one to start.
            </div>
          )}
        </main>
        <AiAssistant 
          selectedText={selectedText}
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

export default App;
