
export const DEFAULT_FILE_CONTENT = `
# Welcome to AI Markdown Editor

This is a browser-based Markdown editor with an integrated AI chat panel.

## Features

- **File Management**: Create, rename, and delete files on the left.
- **Markdown Editor**: Write Markdown in this central pane.
- **AI Assistant**: Use the panel on the right to chat with an AI.

## AI Workflow

1.  **Open Settings**: Click the gear icon in the top right to add your Google Gemini API key.
2.  **Select Text**: Highlight any text in this editor.
3.  **Chat with AI**: Ask the AI to modify it. For example, type "summarize this" or "fix grammar".
4.  **Apply Changes**: The AI's response will appear in the chat. You can then apply the changes to your document.

---

| Feature         | Status      |
|-----------------|-------------|
| Markdown Tables | Supported   |
| Code Blocks     | Supported   |
| AI Integration  | Ready       |

\`\`\`javascript
function helloWorld() {
  console.log("Hello, from the AI Markdown Editor!");
}
\`\`\`
`;

export const LOCAL_STORAGE_FILES_KEY = 'ai-markdown-editor-files';
export const LOCAL_STORAGE_SETTINGS_KEY = 'ai-markdown-editor-settings';
