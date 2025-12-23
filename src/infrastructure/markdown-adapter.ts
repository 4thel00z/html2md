import { marked } from "marked";
import type { MarkdownConverterPort } from "../domain/ports.ts";

/**
 * Adapter that uses 'marked' to convert Markdown to HTML.
 * Implemented as a data class (object) as per project conventions.
 */
export const MarkdownAdapter: MarkdownConverterPort = {
  async convert(md: string): Promise<string> {
    const renderer = new marked.Renderer();

    // Custom code block renderer (basic escaping)
    renderer.code = ({ text, lang }) => {
      const escapedText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const languageClass = lang ? ` class="language-${lang}"` : "";
      return `<pre><code${languageClass}>${escapedText}</code></pre>`;
    };

    // Preserve whitespace in a GFM-friendly way to match previous behavior
    const lines = md.replace(/\r\n/g, "\n").split("\n");
    let inFence = false;
    let emptyRun = 0;
    const expanded = lines
      .map((line) => {
        const fence = line.match(/^\s*(```|~~~)/);
        if (fence) {
          inFence = !inFence;
          emptyRun = 0;
          return line;
        }
        if (inFence) {
          emptyRun = 0;
          return line;
        }
        const isEmpty = line.trim().length === 0;
        if (!isEmpty) {
          emptyRun = 0;
          return line;
        }
        emptyRun += 1;
        return emptyRun <= 1 ? "" : "&nbsp;";
      })
      .join("\n");

    return marked(expanded, {
      renderer,
      breaks: true,
      gfm: true,
    });
  },
} as const;
