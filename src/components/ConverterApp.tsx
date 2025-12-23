import React, { useEffect, useMemo, useRef, useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor.tsx";
import { HtmlPreview } from "./HtmlPreview.tsx";
import { FileCode, Zap } from "lucide-react";
import { MarkdownAdapter } from "../infrastructure/markdown-adapter.ts";
import { HtmlTemplateAdapter } from "../infrastructure/template-adapter.ts";

const DAISY_THEMES = [
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

const THEME_KEY = "html2md-theme";
const UI_THEME = "light";

export const ConverterApp: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Hello World

This is a **responsive**, realtime Markdown to self-contained HTML converter.

## How to use
- Type Markdown on the left.
- Pick an **Output Theme** (it only affects the preview + downloaded HTML).
- The preview updates as you type (slight debounce).
- Click **Download** to save a standalone HTML file.

## Features
- Markdown → HTML
- Tailwind CSS v4 + Typography
- Self-contained output (Tailwind CSS inlined)

### Code Example
\`\`\`javascript
const greeting = "Hello!";
console.log(greeting);
\`\`\`

| Feature | Status |
|---|---|
| Responsive | ✅ |
| Self-contained | ✅ |
`);
  const [html, setHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outputTheme, setOutputTheme] = useState<string>(() => {
    try {
      return localStorage.getItem(THEME_KEY) ?? "light";
    } catch {
      return "light";
    }
  });
  const [previewRefreshToken, setPreviewRefreshToken] = useState(0);
  const [templateHtml, setTemplateHtml] = useState<string>("");
  const [templateError, setTemplateError] = useState<string>("");
  
  // No longer need abort controller for sync/fast client ops
  // const abortRef = useRef<AbortController | null>(null);

  const debouncedMarkdown = useMemo(() => markdown, [markdown]);

  // Load the generated template ONCE (contains the inlined CSS already).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setTemplateError("");
        const res = await fetch("/template.generated.html", { cache: "no-cache" });
        if (!res.ok) throw new Error(`Failed to load template: ${res.status} ${res.statusText}`);
        const txt = await res.text();
        if (!cancelled) setTemplateHtml(txt);
      } catch (e: any) {
        if (!cancelled) setTemplateError(e?.message ?? String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Realtime conversion: debounce requests while typing.
  useEffect(() => {
    const handle = setTimeout(async () => {
      if (!templateHtml) return;
      setIsLoading(true);
      try {
        const contentHtml = await MarkdownAdapter.convert(debouncedMarkdown);
        const fullHtml = HtmlTemplateAdapter.render(templateHtml, contentHtml, outputTheme);
        setHtml(fullHtml);
      } catch (e: any) {
        console.error("Conversion failed:", e);
      } finally {
        setIsLoading(false);
      }
    }, 150); // Lower debounce since it's client-side

    return () => clearTimeout(handle);
  }, [debouncedMarkdown, outputTheme, templateHtml]);

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-page.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleThemeChange = (next: string) => {
    setOutputTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setPreviewRefreshToken((x) => x + 1);
  };

  return (
    <div
      data-theme={UI_THEME}
      className="min-h-screen bg-base-200 text-base-content font-sans selection:bg-base-300"
    >
      <nav className="border-b border-base-300 bg-base-100/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral rounded-lg flex items-center justify-center text-neutral-content">
              <FileCode size={20} />
            </div>
            <span className="text-xl font-black tracking-tight">md2html</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com" className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">Documentation</a>
            <button className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity">GitHub</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <header className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-base-100 text-xs font-bold uppercase tracking-wider mb-4 border border-base-300">
            <Zap size={14} />
            <span>Tailwind v4 Powered</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            Markdown to professional <br /> 
            <span className="opacity-70">HTML in seconds.</span>
          </h1>
          <p className="text-xl opacity-80 leading-relaxed">
            Create beautiful, self-contained HTML documents from Markdown. 
            Tailwind v4 + typography for great readability.
          </p>
          <div className="mt-6 rounded-xl border border-base-300 bg-base-100 p-4 text-sm leading-relaxed">
            <div className="font-bold mb-2">How to use</div>
            <ul className="list-disc pl-5 space-y-1 opacity-90">
              <li>Write Markdown in the editor.</li>
              <li>Select an <span className="font-semibold">Output Theme</span> (applies to preview + downloaded HTML only).</li>
              <li>Click <span className="font-semibold">Download</span> to save a standalone HTML file.</li>
            </ul>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-2 h-[650px]">
            <MarkdownEditor
              initialMarkdown={markdown}
              onChange={setMarkdown}
              headerActions={
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold opacity-70 hidden sm:inline">Theme</span>
                  <select
                    value={outputTheme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="select select-sm select-bordered font-sans h-8 min-h-0"
                    aria-label="Select theme"
                  >
                    {DAISY_THEMES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              }
            />
            <div className="text-xs opacity-70 px-1">
              {templateError ? `Template error: ${templateError}` : "Preview updates automatically while you type."}
            </div>
          </div>

          <div className="flex flex-col gap-2 h-[650px] lg:sticky lg:top-24">
            <HtmlPreview
              html={html}
              isLoading={isLoading}
              refreshToken={previewRefreshToken}
              onDownload={handleDownload}
              canDownload={!!html}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-base-300 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-6 text-center opacity-60 text-sm">
          <p>© 2025 md2html. Built with Bun, React, and Tailwind CSS v4.</p>
        </div>
      </footer>
    </div>
  );
};

