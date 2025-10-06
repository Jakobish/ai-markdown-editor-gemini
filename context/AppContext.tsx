import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { File, EditorMode, Selection } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_FILE_CONTENT, LOCAL_STORAGE_FILES_KEY } from '../constants';

type History = Record<string, { past: string[], future: string[] }>;

interface AppContextState {
  theme: 'light' | 'dark';
  files: File[];
  activeFileId: string | null;
  editorMode: EditorMode;
  activeFile: File | undefined;
  pendingReplacement: { text: string; selection: Selection } | null;
  canUndo: boolean;
  canRedo: boolean;
  toggleTheme: () => void;
  addFile: () => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  updateActiveFileContent: (content: string) => void;
  setActiveFileId: (id: string) => void;
  setEditorMode: (mode: EditorMode) => void;
  setPendingReplacement: (replacement: { text: string; selection: Selection } | null) => void;
  undo: () => void;
  redo: () => void;
}

const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [files, setFiles] = useLocalStorage<File[]>(LOCAL_STORAGE_FILES_KEY, []);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('source');
  const [pendingReplacement, setPendingReplacement] = useState<{ text: string; selection: Selection } | null>(null);
  const [history, setHistory] = useState<History>({});

  const activeFile = useMemo(() => files.find((f) => f.id === activeFileId), [files, activeFileId]);
  const activeFileHistory = useMemo(() => activeFileId ? history[activeFileId] ?? { past: [], future: [] } : { past: [], future: [] }, [history, activeFileId]);
  
  const canUndo = activeFileHistory.past.length > 0;
  const canRedo = activeFileHistory.future.length > 0;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (files.length === 0) {
      const newFile: File = { id: crypto.randomUUID(), name: 'Untitled', content: DEFAULT_FILE_CONTENT };
      setFiles([newFile]);
      setActiveFileId(newFile.id);
    } else if (!activeFileId && files.length > 0) {
      setActiveFileId(files[0].id);
    } else if (activeFileId && !files.some(f => f.id === activeFileId)) {
      // If active file was deleted, select the first one
      setActiveFileId(files.length > 0 ? files[0].id : null);
    }
  }, [files, setFiles, activeFileId]);

  const toggleTheme = useCallback(() => setTheme(p => p === 'dark' ? 'light' : 'dark'), [setTheme]);

  const addFile = useCallback(() => {
    const newFile: File = { id: crypto.randomUUID(), name: `Untitled ${files.length + 1}`, content: `# New File\n` };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
  }, [files.length, setFiles]);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[id];
      return newHistory;
    });
  }, [setFiles]);

  const renameFile = useCallback((id: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
  }, [setFiles]);

  const updateActiveFileContent = useCallback((content: string) => {
    if (activeFileId && activeFile) {
      if (content === activeFile.content) return;

      const newPast = [...activeFileHistory.past, activeFile.content];
      setHistory(prev => ({ ...prev, [activeFileId]: { past: newPast, future: [] } }));
      setFiles(curr => curr.map(f => f.id === activeFileId ? { ...f, content } : f));
    }
  }, [activeFileId, activeFile, setFiles, activeFileHistory.past]);

  const undo = useCallback(() => {
    if (canUndo && activeFileId && activeFile) {
      const previousContent = activeFileHistory.past[activeFileHistory.past.length - 1];
      const newPast = activeFileHistory.past.slice(0, -1);
      const newFuture = [activeFile.content, ...activeFileHistory.future];
      setHistory(prev => ({ ...prev, [activeFileId]: { past: newPast, future: newFuture } }));
      setFiles(curr => curr.map(f => f.id === activeFileId ? { ...f, content: previousContent } : f));
    }
  }, [canUndo, activeFileId, activeFile, activeFileHistory, setFiles]);

  const redo = useCallback(() => {
    if (canRedo && activeFileId && activeFile) {
      const nextContent = activeFileHistory.future[0];
      const newPast = [...activeFileHistory.past, activeFile.content];
      const newFuture = activeFileHistory.future.slice(1);
      setHistory(prev => ({ ...prev, [activeFileId]: { past: newPast, future: newFuture } }));
      setFiles(curr => curr.map(f => f.id === activeFileId ? { ...f, content: nextContent } : f));
    }
  }, [canRedo, activeFileId, activeFile, activeFileHistory, setFiles]);

  const contextValue = useMemo(() => ({
    theme, files, activeFileId, editorMode, activeFile, pendingReplacement, canUndo, canRedo,
    toggleTheme, addFile, deleteFile, renameFile, updateActiveFileContent, setActiveFileId, setEditorMode, setPendingReplacement, undo, redo,
  }), [
    theme, files, activeFileId, editorMode, activeFile, pendingReplacement, canUndo, canRedo,
    toggleTheme, addFile, deleteFile, renameFile, updateActiveFileContent, undo, redo
  ]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextState => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
