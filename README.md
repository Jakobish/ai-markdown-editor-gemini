
# AI Markdown Editor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![TypeScript](https://img.shields.io/badge/--typescript?logo=typescript&color=3178C6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/--react?logo=react&color=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/--tailwindcss?logo=tailwind-css&color=06B6D4)](https://tailwindcss.com/)

A browser-based Markdown editor with a fully integrated AI assistant powered by Google Gemini. Write, edit, and refactor your documents with the help of a powerful language model right inside your editor.

![AI Markdown Editor Screenshot](https://storage.googleapis.com/aistudio-hosting/generative-ai-studio/assets/readme/ai-markdown-editor-screenshot.png)

## 🚀 Motivation

Writing is often a process of constant refinement. Whether you're drafting technical documentation, creating blog posts, or taking notes, the ability to quickly iterate on your text is essential. This project was born from the idea of merging a clean, efficient Markdown writing environment with the advanced capabilities of modern AI.

The goal is to create a seamless workflow where you can:
-   Draft your content without distractions.
-   Instantly summon an AI to fix grammar, summarize text, change the tone, or even translate.
-   Apply AI-suggested changes with a single click, directly in the context of your document.
-   Eliminate the need to copy-paste between your editor and a separate AI chat window.

## ✨ Key Features

-   **📝 Dual-Mode Markdown Editor**:
    -   **Source Mode**: A powerful source editor with syntax highlighting, built with CodeMirror.
    -   **WYSIWYG Mode**: A rich-text editor experience for a more visual editing flow, built with Tiptap.
    -   Live, side-by-side preview in source mode.
-   **🤖 Integrated AI Assistant (Google Gemini)**:
    -   **Context-Aware Editing**: Select any text in your document and instruct the AI to modify it (e.g., "make this more formal," "fix spelling and grammar").
    -   **General Chat**: Use the assistant as a general-purpose chatbot for ideas, outlines, or questions.
    -   **One-Click Apply**: Instantly replace your selected text with the AI's suggestion.
-   **🗂️ File Management**:
    -   Create, rename, and delete multiple files.
    -   All your work is saved automatically to your browser's local storage.
-   **🎨 Theming & Export**:
    -   Switch between beautiful **Dark** and **Light** themes.
    -   Export your documents as standard `.md` files.
-   **Responsive Design**: A clean, intuitive, and fully responsive UI built with Tailwind CSS.

## 💼 Use Cases

This editor is perfect for:
-   **Developers**: Writing clear and concise documentation for projects.
-   **Content Creators**: Drafting blog posts, articles, and scripts.
-   **Students**: Taking organized notes and summarizing study materials.
-   **Technical Writers**: Creating and maintaining technical guides and manuals.
-   **Anyone** who wants to leverage AI to enhance their writing efficiency and quality in Markdown.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **AI**: Google Gemini API (`@google/genai`)
-   **Styling**: Tailwind CSS
-   **Source Editor**: CodeMirror 6
-   **WYSIWYG Editor**: Tiptap 2
-   **Markdown Parsing**: `react-markdown`, `remark-gfm`

## 🏁 Getting Started

To run the AI Markdown Editor locally, follow these steps:

### Prerequisites

-   Node.js (v18 or later)
-   `npm` or `yarn`

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ai-markdown-editor.git
    cd ai-markdown-editor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your AI provider:**
    -   This project uses the Google Gemini API. You'll need an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   Create a file named `.env` in the root of the project.
    -   Add your API key to the `.env` file:
        ```env
        API_KEY=your_google_gemini_api_key_here
        ```
    > **Note**: The application is designed to source the API key from this environment variable. It is not stored in local storage or exposed on the client-side bundle.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:3000`.

## 🗺️ Roadmap & To-Do

We have big plans for the future! Here are some features and improvements on our roadmap:

-   [ ] **Support More AI Providers**: Integrate OpenAI (GPT-4), Anthropic (Claude), and others.
-   [ ] **Cloud Synchronization**: Optionally back up and sync files across devices.
-   [ ] **Version History**: View and revert to previous versions of a document.
-   [ ] **Advanced AI Actions**:
    -   Generate tables from descriptions.
    -   Create document summaries.
    -   Generate images from text prompts and embed them.
-   [ ] **Extensibility**: Develop a plugin system for custom functionality.
-   [ ] **Accessibility Improvements**: Ensure the application is fully accessible (WCAG compliance).
-   [ ] **Live Collaboration**: Allow multiple users to edit a document simultaneously.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

Don't forget to give the project a star! Thanks again!

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.

---

_This project is a demonstration of building a modern web application with integrated AI capabilities and is not an official Google product._
