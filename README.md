# html2md

Markdown → self-contained HTML with **Pico-like classless styling** powered by **DaisyUI theme tokens**.

## Install

```bash
bun install
```

## How to use (React component)

```bash
# In your React app
bun add html2md
```

```tsx
import React from "react";
import { Converter } from "html2md";

export function App() {
  return <Converter />;
}
```

### Required: serve the generated template once

`Converter` fetches `/template.generated.html` once and then only replaces placeholders for:
- `__THEME__` (selected output theme)
- `__CONTENT__` (rendered HTML)

In this repo, `src/server.ts` serves that route. In your app, you can either:
- place `template.generated.html` in your public/static folder at `/template.generated.html`, or
- add an equivalent route.

To generate it:

```bash
bun run generate:template
```

## Library usage

```ts
import { render } from "html2md";

const fullHtml = await render("# Hello", { theme: "night" });
```

## Demo app (local)

```bash
bun run start
```

