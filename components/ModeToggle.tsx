
import React from 'react';
import { useAppContext } from '../context/AppContext';

const ModeToggle: React.FC = () => {
    const { editorMode, setEditorMode } = useAppContext();

    return (
        <div className="flex items-center space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
            onClick={() => setEditorMode('source')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${editorMode === 'source' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
            Source
        </button>
        <button
            onClick={() => setEditorMode('wysiwyg')}
            className={`px-3 py-1 text-xs font-medium rounded-md ${editorMode === 'wysiwyg' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
        >
            WYSIWYG
        </button>
        </div>
    );
};

export default ModeToggle;
