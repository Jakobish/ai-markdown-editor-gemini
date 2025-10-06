
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { File, EditorMode } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_FILE_CONTENT, LOCAL_STORAGE_FILES_KEY } from '../constants';

interface AppContextState {
  theme: 'light' | 'dark';
  files: File[];
  activeFileId: string | null;
  editorMode: EditorMode;
  activeFile: File | undefined;
  toggleTheme: () => void;
  addFile: () => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  updateActiveFileContent: (content: string) => void;
  setActiveFileId: (id: string) => void;
  setEditorMode: (mode: EditorMode) => void;
}

const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [files, setFiles] = useLocalStorage<File[]>(LOCAL_STORAGE_FILES_KEY, []);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('source');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

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

  const activeFile = useMemo(() => files.find((f) => f.id === activeFileId), [files, activeFileId]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  const addFile = useCallback(() => {
    const newFile: File = {
      id: crypto.randomUUID(),
      name: `Untitled ${files.length + 1}`,
      content: `# New File\n`,
    };
    setFiles((prevFiles) => [...prevFiles, newFile]);
    setActiveFileId(newFile.id);
  }, [files.length, setFiles]);

  const deleteFile = useCallback((id: string) => {
    setFiles((prevFiles) => {
        const remainingFiles = prevFiles.filter((f) => f.id !== id);
        if (activeFileId === id) {
          setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
        }
        return remainingFiles;
    });
  }, [activeFileId, setFiles]);

  const renameFile = useCallback((id: string, newName: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((f) => (f.id === id ? { ...f, name: newName } : f))
    );
  }, [setFiles]);

  const updateActiveFileContent = useCallback((content: string) => {
    if (activeFileId) {
      setFiles((currentFiles) =>
        currentFiles.map((f) =>
          f.id === activeFileId ? { ...f, content } : f
        )
      );
    }
  }, [activeFileId, setFiles]);

  const contextValue = useMemo(() => ({
    theme,
    files,
    activeFileId,
    editorMode,
    activeFile,
    toggleTheme,
    addFile,
    deleteFile,
    renameFile,
    updateActiveFileContent,
    setActiveFileId,
    setEditorMode,
  }), [
    theme, files, activeFileId, editorMode, activeFile,
    toggleTheme, addFile, deleteFile, renameFile, updateActiveFileContent
  ]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
