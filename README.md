# html2md

Markdown → self-contained HTML with **Pico-like classless styling** powered by **DaisyUI theme tokens**.

## Install

```bash
bun install
```

## How to use (demo app)

```bash
bun run start
```

- **Editor**: write Markdown on the left
- **Output Theme**: changes the preview + downloaded HTML colors (does **not** change the app UI)
- **Download**: saves a standalone HTML file (CSS inlined)

## Library usage

```ts
import { convertToHtml } from "html2md";

const html = await convertToHtml("# Hello");
```

## Demo app (local)

```bash
bun run start
```

