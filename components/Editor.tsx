
import React, { useCallback, useMemo } from 'react';
import CodeMirror, { ViewUpdate, EditorView } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorState } from '@codemirror/state';
import { bbedit } from '@uiw/codemirror-theme-bbedit';
import { darcula } from '@uiw/codemirror-theme-darcula';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSelectionChange: (selectedText: string) => void;
  theme: 'light' | 'dark';
}

const Editor: React.FC<EditorProps> = ({
  content,
  onContentChange,
  onSelectionChange,
  theme,
}) => {
  const handleUpdate = useCallback((update: ViewUpdate) => {
    if (update.selectionSet) {
      const selected = update.state.sliceDoc(
        update.state.selection.main.from,
        update.state.selection.main.to
      );
      onSelectionChange(selected);
    }
  }, [onSelectionChange]);

  const extensions = useMemo(() => [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorState.allowMultipleSelections.of(true),
  ], []);
  
  const editorTheme = theme === 'dark' ? darcula : bbedit;

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-950">
       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-2 bg-gray-900 border-b border-r border-gray-800 text-sm font-mono text-gray-400">
            MARKDOWN
          </div>
          <CodeMirror
            value={content}
            onChange={onContentChange}
            onUpdate={handleUpdate}
            extensions={extensions}
            theme={editorTheme}
            height="100%"
            style={{ flex: 1, overflow: 'auto' }}
            basicSetup={{
                lineNumbers: false,
                foldGutter: false,
                autocompletion: true,
                highlightActiveLine: false,
            }}
          />
        </div>
        <div className="h-full flex flex-col overflow-auto">
          <div className="p-2 bg-gray-900 border-b border-gray-800 text-sm font-mono text-gray-400">
            PREVIEW
          </div>
          <div className="p-8 bg-gray-950 flex-1">
            <ReactMarkdown
              className="prose prose-invert prose-sm md:prose-base max-w-none"
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
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
    </div>
  );
};

export default Editor;
