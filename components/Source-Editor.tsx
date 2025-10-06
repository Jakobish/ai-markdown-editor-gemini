import React, { useCallback, useMemo, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import type { ViewUpdate } from '@codemirror/view';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { bbedit } from '@uiw/codemirror-theme-bbedit';
import { darcula } from '@uiw/codemirror-theme-darcula';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Selection } from '../types';
import { useAppContext } from '../context/AppContext';

interface SourceEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSelectionChange: (selection: Selection | null) => void;
  isRtl: boolean;
  pendingReplacement: { text: string; selection: Selection } | null;
  onReplacementApplied: () => void;
}

const SourceEditor: React.FC<SourceEditorProps> = ({
  content,
  onContentChange,
  onSelectionChange,
  isRtl,
  pendingReplacement,
  onReplacementApplied,
}) => {
  const { theme } = useAppContext();

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
  
  const markdownComponents: Components = useMemo(() => ({
    // FIX: Removed `...props` from destructuring and element spread. This prevents
    // non-standard HTML attributes from being passed to the `<code>` tag, which
    // was causing a fatal runtime error on application load.
    code({ node, inline, className, children }: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match ? (
        <div className="bg-gray-800 rounded-md my-4">
          <div className="bg-gray-700 text-gray-300 px-4 py-1 text-xs rounded-t-md">{match[1]}</div>
          <pre className="p-4 overflow-x-auto text-sm"><code className={className}>
            {String(children).replace(/\n$/, '')}
          </code></pre>
        </div>
      ) : (
        <code className="bg-gray-700 text-red-300 px-1 py-0.5 rounded-sm">
          {children}
        </code>
      )
    },
    table({children}) {
        return <table className="w-full text-sm">{children}</table>
    }
  }), []);

  return (
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
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default SourceEditor;