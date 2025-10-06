
import React, { useCallback, useMemo, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import type { ViewUpdate } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { bbedit } from '@uiw/codemirror-theme-bbedit';
import { darcula } from '@uiw/codemirror-theme-darcula';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { EditorMode, Selection } from '../types';
import WysiwygEditor from './WysiwygEditor';

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSelectionChange: (selection: Selection | null) => void;
  theme: 'light' | 'dark';
  editorMode: EditorMode;
  onEditorModeChange: (mode: EditorMode) => void;
  pendingReplacement: { text: string; selection: Selection } | null;
  onReplacementApplied: () => void;
}

const isRtlText = (text: string): boolean => {
  const snippet = text.substring(0, 200);
  const rtlRegex = /[\u0590-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlRegex.test(snippet);
};

const Editor: React.FC<EditorProps> = ({
  content,
  onContentChange,
  onSelectionChange,
  theme,
  editorMode,
  onEditorModeChange,
  pendingReplacement,
  onReplacementApplied,
}) => {
  const isRtl = useMemo(() => isRtlText(content), [content]);

  useEffect(() => {
    if (pendingReplacement && pendingReplacement.selection.mode === 'source') {
      const { text, selection } = pendingReplacement;
      const newContent = content.substring(0, selection.from) + text + content.substring(selection.to);
      onContentChange(newContent);
      onReplacementApplied();
    }
  }, [pendingReplacement, content, onContentChange, onReplacementApplied]);

  const handleUpdate = useCallback((update: ViewUpdate) => {
    if (update.selectionSet) {
      const { from, to } = update.state.selection.main;
      const text = update.state.sliceDoc(from, to);
      if (text) {
        onSelectionChange({ from, to, text, mode: 'source' });
      } else {
        onSelectionChange(null);
      }
    }
  }, [onSelectionChange]);

  const extensions = useMemo(() => [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorState.allowMultipleSelections.of(true),
  ], []);
  
  const editorTheme = theme === 'dark' ? darcula : bbedit;

  const SourceEditor = () => (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
      <div className="h-full flex flex-col overflow-hidden">
        <CodeMirror
          value={content}
          onChange={onContentChange}
          onUpdate={handleUpdate}
          extensions={extensions}
          theme={editorTheme}
          height="100%"
          style={{ 
              flex: 1, 
              overflow: 'auto',
              direction: isRtl ? 'rtl' : 'ltr'
          }}
          basicSetup={{
              lineNumbers: false,
              foldGutter: false,
              autocompletion: true,
              highlightActiveLine: false,
          }}
        />
      </div>
      <div className="h-full flex flex-col overflow-auto border-l border-gray-800">
        <div className="p-8 bg-gray-950 flex-1 prose prose-invert prose-sm md:prose-base max-w-none" dir={isRtl ? 'rtl' : 'ltr'}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // FIX: Add `any` type to props to fix type error on `inline` property.
              // This is a workaround for a potential type definition issue with react-markdown.
              code({node, className, children, ...props}: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !props.inline && match ? (
                  <div className="bg-gray-800 rounded-md my-4">
                    <div className="bg-gray-700 text-gray-300 px-4 py-1 text-xs rounded-t-md">{match[1]}</div>
                    <pre className="p-4 overflow-x-auto text-sm"><code className={className} {...props}>
                      {children}
                    </code></pre>
                  </div>
                ) : (
                  <code className="bg-gray-700 text-red-300 px-1 py-0.5 rounded-sm" {...props}>
                    {children}
                  </code>
                )
              },
              table({children}) {
                  return <table className="w-full text-sm">{children}</table>
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );

  const ModeToggle = () => (
    <div className="flex items-center space-x-1 bg-gray-800 p-1 rounded-lg">
      <button
        onClick={() => onEditorModeChange('source')}
        className={`px-3 py-1 text-xs font-medium rounded-md ${editorMode === 'source' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
      >
        Source
      </button>
      <button
        onClick={() => onEditorModeChange('wysiwyg')}
        className={`px-3 py-1 text-xs font-medium rounded-md ${editorMode === 'wysiwyg' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
      >
        WYSIWYG
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950">
       <div className="p-2 bg-gray-900 border-b border-gray-800 flex justify-between items-center text-sm font-mono text-gray-400">
          <span>{editorMode === 'source' ? 'MARKDOWN / PREVIEW' : 'WYSIWYG EDITOR'}</span>
          <ModeToggle />
       </div>
       {editorMode === 'source' ? (
          <SourceEditor />
        ) : (
          <WysiwygEditor 
            content={content}
            onContentChange={onContentChange}
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
