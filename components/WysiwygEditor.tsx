
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/extension-markdown';
import WysiwygToolbar from './WysiwygToolbar';
import { Selection } from '../types';

interface WysiwygEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onSelectionChange: (selection: Selection | null) => void;
  isRtl: boolean;
  pendingReplacement: { text: string; selection: Selection } | null;
  onReplacementApplied: () => void;
}

const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  content,
  onContentChange,
  onSelectionChange,
  isRtl,
  pendingReplacement,
  onReplacementApplied
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown.configure({
          html: false,
          tightLists: true,
          linkify: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.storage.markdown.getMarkdown());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, '');
      if (text) {
        onSelectionChange({ from, to, text, mode: 'wysiwyg' });
      } else {
        onSelectionChange(null);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm md:prose-base max-w-none focus:outline-none p-8 flex-1',
      },
    },
  });

  useEffect(() => {
    if (editor && pendingReplacement && pendingReplacement.selection.mode === 'wysiwyg') {
      const { text, selection } = pendingReplacement;
      // Use transaction to chain commands. focus() is not needed here.
      editor.chain()
        .setTextSelection({ from: selection.from, to: selection.to })
        .insertContent(text)
        .run();
      
      // onUpdate will be triggered by the command, which calls onContentChange.
      // We then clear the pending state.
      onReplacementApplied();
    }
  }, [pendingReplacement, editor, onReplacementApplied]);

  useEffect(() => {
    if (editor && editor.isReady) {
        // This is a workaround to update content when the file is switched.
        // `setContent` replaces the document, which is what we want.
        // Comparing strings avoids an infinite loop.
        const currentMarkdown = editor.storage.markdown.getMarkdown();
        if (currentMarkdown !== content) {
            editor.commands.setContent(content, false, { preserveWhitespace: 'full' });
        }
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col h-full bg-gray-950 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <WysiwygToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
       <style>{`
        .ProseMirror {
          min-height: 100%;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
};

export default WysiwygEditor;
