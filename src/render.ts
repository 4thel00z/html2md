import { MarkdownAdapter } from "./infrastructure/markdown-adapter.ts";
import { HtmlTemplateAdapter } from "./infrastructure/template-adapter.ts";
import { TEMPLATE_HTML } from "./infrastructure/template.generated.ts";

export interface RenderOptions {
  theme?: string;
  templateUrl?: string;
}

// Module-local cache (keeps API simple: no required instantiation).
const templateCache = new Map<string, Promise<string>>();

async function loadTemplate(templateUrl: string): Promise<string> {
  const cached = templateCache.get(templateUrl);
  if (cached) return cached;

  const p = (async () => {
    const res = await fetch(templateUrl, { cache: "no-cache" });
    if (!res.ok) {
      throw new Error(`Failed to load template: ${res.status} ${res.statusText}`);
    }
    return await res.text();
  })();

  templateCache.set(templateUrl, p);
  return p;
}

/**
 * Single public API: Markdown -> self-contained HTML document.
 *
 * - Uses an embedded template (generated at build-time) that contains inlined CSS.
 * - Applies theme via `data-theme="<theme>"`.
 */
export async function render(markdown: string, options: RenderOptions = {}): Promise<string> {
  const theme = options.theme ?? "light";
  const templateHtml = options.templateUrl
    ? await loadTemplate(options.templateUrl)
    : TEMPLATE_HTML;
  const contentHtml = await MarkdownAdapter.convert(markdown);
  return HtmlTemplateAdapter.render(templateHtml, contentHtml, theme);
}
