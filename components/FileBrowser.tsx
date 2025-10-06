
import React, { useState } from 'react';
import { File } from '../types';
import { FileIcon, PlusIcon, TrashIcon, EditIcon, CheckIcon, XIcon } from './icons';
import { useAppContext } from '../context/AppContext';

const FileBrowser: React.FC = () => {
  const { 
    files, 
    activeFileId, 
    setActiveFileId, 
    addFile, 
    deleteFile, 
    renameFile 
  } = useAppContext();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleRenameClick = (file: File) => {
    setRenamingId(file.id);
    setRenameValue(file.name);
  };

  const handleRenameSubmit = (fileId: string) => {
    if (renameValue.trim()) {
      renameFile(fileId, renameValue.trim());
    }
    setRenamingId(null);
  };
    
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, fileId: string) => {
      if (e.key === 'Enter') {
          handleRenameSubmit(fileId);
      } else if (e.key === 'Escape') {
          setRenamingId(null);
      }
  }

  return (
    <div className="bg-gray-900 text-gray-300 w-64 p-4 flex flex-col h-full border-r border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold tracking-wider uppercase text-gray-400">Files</h2>
        <button
          onClick={addFile}
          className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md"
          aria-label="New file"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
      <ul className="flex-grow space-y-1 overflow-y-auto">
        {files.map((file) => (
          <li key={file.id}>
            <div
              className={`group flex items-center justify-between p-2 rounded-md cursor-pointer ${
                activeFileId === file.id
                  ? 'bg-blue-600/20 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              {renamingId === file.id ? (
                <div className="flex-grow flex items-center">
                    <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, file.id)}
                        onBlur={() => setRenamingId(null)}
                        className="bg-gray-700 text-white p-1 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        autoFocus
                    />
                    <button onClick={() => handleRenameSubmit(file.id)} className="ml-1 p-1 text-gray-400 hover:text-green-400"><CheckIcon className="w-4 h-4" /></button>
                    <button onClick={() => setRenamingId(null)} className="p-1 text-gray-400 hover:text-red-400"><XIcon className="w-4 h-4"/></button>
                </div>
              ) : (
                <>
                  <div className="flex items-center truncate flex-grow" onClick={() => setActiveFileId(file.id)}>
                    <FileIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate text-sm">{file.name}</span>
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRenameClick(file)}
                      className="p-1 text-gray-400 hover:text-white"
                      aria-label="Rename file"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteFile(file.id)}
                      className="p-1 text-gray-400 hover:text-red-400"
                      aria-label="Delete file"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileBrowser;
