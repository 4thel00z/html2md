import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { render } from "../render.ts";
import { HtmlPreview } from "./HtmlPreview.tsx";
import { MarkdownEditor } from "./MarkdownEditor.tsx";

const DEFAULT_THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
] as const;

export interface ConverterProps {
  initialMarkdown?: string;
  templateUrl?: string;
  themeStorageKey?: string;
  themes?: readonly string[];
  heightClassName?: string;
  onHtmlChange?: (html: string) => void;
}

const DEFAULT_MARKDOWN = `# Hello World

This is a **responsive**, realtime Markdown to self-contained HTML converter.

## Features
- Markdown → HTML
- Themeable preview + download (DaisyUI theme tokens)
- Self-contained output (CSS inlined)

### Code Example
\`\`\`javascript
const greeting = "Hello!";
console.log(greeting);
\`\`\`

| Feature | Status |
|---|---|
| Responsive | ✅ |
| Self-contained | ✅ |
`;

export const Converter: React.FC<ConverterProps> = ({
  initialMarkdown = DEFAULT_MARKDOWN,
  templateUrl,
  themeStorageKey = "html2md-theme",
  themes = DEFAULT_THEMES as unknown as readonly string[],
  heightClassName = "h-[650px]",
  onHtmlChange,
}) => {
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputTheme, setOutputTheme] = useState<string>(() => {
    try {
      return localStorage.getItem(themeStorageKey) ?? "light";
    } catch {
      return "light";
    }
  });
  const [previewRefreshToken, setPreviewRefreshToken] = useState(0);
  const [templateError, setTemplateError] = useState<string>("");

  const debouncedMarkdown = useMemo(() => markdown, [markdown]);

  // Realtime conversion: debounce while typing.
  useEffect(() => {
    const handle = setTimeout(async () => {
      setIsLoading(true);
      try {
        setTemplateError("");
        const fullHtml = await render(debouncedMarkdown, { theme: outputTheme, templateUrl });
        setHtml(fullHtml);
        onHtmlChange?.(fullHtml);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        setTemplateError(message);
        console.error("Conversion failed:", e);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(handle);
  }, [debouncedMarkdown, outputTheme, templateUrl, onHtmlChange]);

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleThemeChange = (next: string) => {
    setOutputTheme(next);
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {}
    setPreviewRefreshToken((x) => x + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className={`flex flex-col gap-2 ${heightClassName}`}>
        <MarkdownEditor
          initialMarkdown={markdown}
          onChange={setMarkdown}
          headerActions={
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold opacity-70 hidden sm:inline">Output theme</span>
              <select
                value={outputTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="select select-sm select-bordered font-sans h-8 min-h-0"
                aria-label="Select output theme"
              >
                {themes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          }
        />
        <div className="text-xs opacity-70 px-1">
          {templateError
            ? `Template error: ${templateError}`
            : "Preview updates automatically while you type."}
        </div>
      </div>

      <div className={`flex flex-col gap-2 ${heightClassName} lg:sticky lg:top-24`}>
        <HtmlPreview
          html={html}
          isLoading={isLoading}
          refreshToken={previewRefreshToken}
          onDownload={handleDownload}
          canDownload={!!html}
        />
      </div>
    </div>
  );
};
