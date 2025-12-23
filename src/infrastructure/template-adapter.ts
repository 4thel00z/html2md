import type { HtmlTemplatePort } from "../domain/ports.ts";

/**
 * Adapter that applies content + theme into a pre-generated HTML template.
 *
 * Placeholders expected:
 * - __THEME__
 * - __CONTENT__
 */
export const HtmlTemplateAdapter: HtmlTemplatePort = {
  render(templateHtml: string, contentHtml: string, theme: string): string {
    return templateHtml
      .replaceAll("__THEME__", theme)
      .replace("__CONTENT__", contentHtml);
  }
} as const;
