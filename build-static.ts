import { mkdir, rm } from "node:fs/promises";

/**
 * Build the demo app as static assets in ./out.
 *
 * Why not `bun build ./src/index.html`?
 * Bun currently emits an empty JS entry for this repo's HTML entrypoint.
 * Bundling `./src/main.tsx` is reliable and produces `main.js` + `main.css`.
 */
async function main() {
  const outDir = new URL("./out/", import.meta.url);

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // Bundle the browser entry
  await Bun.$`bun build ./src/main.tsx --outdir ./out --minify --target browser --format esm --splitting`;

  // Patch index.html to point to the built assets
  const srcIndex = await Bun.file(new URL("./src/index.html", import.meta.url)).text();
  const patched = srcIndex.replace(
    `<script type="module" src="./main.tsx"></script>`,
    `<link rel="stylesheet" href="./main.css" />\n    <script type="module" src="./main.js"></script>`
  );
  await Bun.write(new URL("./out/index.html", import.meta.url), patched);
}

await main();
