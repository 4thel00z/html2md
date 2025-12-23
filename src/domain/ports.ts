export interface MarkdownConverterPort {
  convert(markdown: string): Promise<string>;
}

export interface HtmlTemplatePort {
  render(templateHtml: string, contentHtml: string, theme: string): string;
}
