import React from 'react';
import type { Editor } from '@tiptap/react';
import {
  BoldIcon, ItalicIcon, StrikethroughIcon, CodeIcon,
  Heading1Icon, Heading2Icon, Heading3Icon,
  ListIcon, ListOrderedIcon, QuoteIcon,
  UndoIcon, RedoIcon
} from './icons';

interface WysiwygToolbarProps {
  editor: Editor | null;
}

const WysiwygToolbar: React.FC<WysiwygToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }
  
  const ToolbarButton = ({ onClick, children, isActive, disabled }: { onClick: () => void; children: React.ReactNode; isActive?: boolean, disabled?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-md ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  return (
    <div className="p-2 bg-gray-900 border-b border-gray-800 flex flex-wrap items-center gap-1">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <BoldIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <ItalicIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
        <StrikethroughIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')}>
        <CodeIcon className="w-4 h-4" />
      </ToolbarButton>
       <div className="h-5 w-px bg-gray-700 mx-1"></div>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })}>
        <Heading1Icon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
        <Heading2Icon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })}>
        <Heading3Icon className="w-4 h-4" />
      </ToolbarButton>
      <div className="h-5 w-px bg-gray-700 mx-1"></div>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
        <ListIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
        <ListOrderedIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')}>
        <QuoteIcon className="w-4 h-4" />
      </ToolbarButton>
      <div className="h-5 w-px bg-gray-700 mx-1"></div>
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <UndoIcon className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <RedoIcon className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};

export default WysiwygToolbar;
