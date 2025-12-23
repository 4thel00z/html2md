import React, { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Extension } from "@tiptap/core";
import { FileText } from "lucide-react";

interface MarkdownEditorProps {
  initialMarkdown: string;
  onChange: (markdown: string) => void;
  headerActions?: React.ReactNode;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function markdownToEditorHtml(md: string): string {
  // Render the markdown as plain text in a single paragraph.
  // Newlines become <br>, so what the user types is what they see.
  return `<p>${escapeHtml(md).replace(/\n/g, "<br>")}</p>`;
}

const EnterAsHardBreak = Extension.create({
  name: "enterAsHardBreak",
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.setHardBreak(),
    };
  },
});

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialMarkdown, onChange, headerActions }) => {
  const hasInitialized = useRef(false);
  const editor = useEditor({
    extensions: [
      // StarterKit includes Document/Paragraph/Text/History. We disable everything else
      // so this behaves like a markdown text editor (not rich text).
      StarterKit.configure({
        blockquote: false,
        bold: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        dropcursor: {},
        gapcursor: false,
        hardBreak: {},
        heading: false,
        horizontalRule: false,
        italic: false,
        listItem: false,
        orderedList: false,
        strike: false,
      }),
      EnterAsHardBreak,
      Placeholder.configure({
        placeholder: "Start writing markdown…",
      }),
    ],
    onUpdate: ({ editor }) => {
      onChange(
        editor.getText({
          // Hard breaks become '\n'; we want to preserve the user's newlines verbatim.
          blockSeparator: "\n",
        })
      );
    },
    editorProps: {
      attributes: {
        class:
          "font-mono text-[13px] leading-relaxed text-base-content max-w-none focus:outline-none h-full p-6 whitespace-pre-wrap",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    editor.commands.setContent(markdownToEditorHtml(initialMarkdown));
  }, [editor, initialMarkdown]);

  if (!editor) return null;

  return (
    <div className="flex flex-col border border-base-300 rounded-xl overflow-hidden bg-base-100 shadow-sm h-full">
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-100/70">
        <div className="flex items-center gap-2 font-semibold">
          <FileText size={18} />
          <span>Editor</span>
        </div>
        <div className="flex items-center gap-3">
          {headerActions}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto bg-base-100 min-h-[500px]">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};

