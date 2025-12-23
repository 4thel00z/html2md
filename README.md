<h1 align="center">html2md 📝</h1>

<p align="center">
  Markdown → self-contained HTML with <strong>Pico-like classless styling</strong> powered by <strong>DaisyUI theme tokens</strong>.
</p>

<p align="center">
  <a href="https://github.com/4thel00z/html2md/actions/workflows/ci.yml">
    <img alt="CI" src="https://github.com/4thel00z/html2md/actions/workflows/ci.yml/badge.svg" />
  </a>
  <a href="https://www.npmjs.com/package/%404thel00z%2Fhtml2md">
    <img alt="npm" src="https://img.shields.io/npm/v/%404thel00z%2Fhtml2md" />
  </a>
  <a href="LICENSE">
    <img alt="License" src="https://img.shields.io/npm/l/%404thel00z%2Fhtml2md" />
  </a>
</p>

![Demo](demo.gif)

## Requirements

- Bun (recommended for dev + demo)

## Install

```bash
bun install
```

## How to use (React component)

```bash
# In your React app
bun add @4thel00z/html2md
```

```tsx
import React from "react";
import { Converter } from "@4thel00z/html2md";

export function App() {
  return <Converter />;
}
```

## Theming / embedding (Tailwind class pass-through)

If you want the host app (e.g. your website) to fully control styling, use `unstyled` and pass Tailwind classes via slots:

```tsx
import React from "react";
import { Converter } from "@4thel00z/html2md";

export function App() {
  return (
    <Converter
      unstyled
      className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      heightClassName="min-h-[600px]"
      classNames={{
        editorColumn: "flex flex-col gap-2",
        previewColumn: "flex flex-col gap-2 lg:sticky lg:top-24",
        themeControls: "flex items-center gap-2",
        themeLabel: "text-xs font-semibold text-neutral-600 hidden sm:inline",
        themeSelect: "h-8 rounded-md border border-neutral-300 bg-white px-2 text-sm",
        helperText: "px-1 text-xs text-neutral-500",
      }}
      markdownEditorClassNames={{
        root: "rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm",
        header: "flex items-center justify-between border-b border-neutral-200 px-4 py-3",
        headerTitle: "flex items-center gap-2 text-sm font-semibold text-neutral-900",
        headerActions: "flex items-center gap-3",
        body: "min-h-[500px]",
        editor: "h-full p-6 font-mono text-[13px] leading-relaxed text-neutral-900 outline-none",
      }}
      htmlPreviewClassNames={{
        root: "rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-sm",
        header: "flex items-center justify-between border-b border-neutral-200 px-4 py-3",
        headerTitle: "flex items-center gap-2 text-sm font-semibold text-neutral-900",
        headerActions: "flex items-center gap-3",
        downloadButton: "rounded-md border border-neutral-200 px-2 py-1 text-sm hover:bg-neutral-50 disabled:opacity-50",
        fullscreenButton: "rounded-md border border-neutral-200 px-2 py-1 text-sm hover:bg-neutral-50",
        body: "min-h-[500px] bg-neutral-50 overflow-auto",
        emptyState: "absolute inset-0 flex items-center justify-center text-sm text-neutral-500",
        iframe: "block w-full border-0 bg-white",
        spinner: "h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900",
      }}
    />
  );
}
```

## Template

- By default, `Converter` (and `render()`) uses an **embedded HTML template with inlined CSS** — **no routes/static files** are required.
- If you want to use a custom template, pass `templateUrl` (it will be fetched once and cached):

```tsx
<Converter templateUrl="/my-template.html" />
```

```ts
await render("# Hello", { theme: "night", templateUrl: "/my-template.html" });
```

## Library usage

```ts
import { render } from "@4thel00z/html2md";

const fullHtml = await render("# Hello", { theme: "night" });
```

## Demo app (local)

```bash
bun run start
```

## Build a bundled `index.html` (static)

```bash
bun install
bun run build:static
```

## Contributing / Dev

```bash
bun install
bun run generate:template
bun run start
```

### Quality checks

```bash
bun run check
bun run format
```

### Enable pre-commit hooks (recommended)

```bash
bun run hooks:install
```

## LICENSE

This repo is MIT licensed.
