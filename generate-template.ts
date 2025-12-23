import { file } from "bun";

// This script is run from the `html2md/` package root.
const themesCssPath = "./node_modules/daisyui/themes.css";
const classlessCssPath = "./src/infrastructure/classless.css";
const outPath = "./src/infrastructure/template.generated.html";

const TEMPLATE = `<!DOCTYPE html>
<html lang="en" data-theme="__THEME__">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Converted Document</title>
    <style>
__CSS__
    </style>
  </head>
  <body>
    <main>
      <article>
__CONTENT__
      </article>
    </main>
  </body>
</html>
`;

try {
  const themesCss = await file(themesCssPath).text();
  const classlessCss = await file(classlessCssPath).text();
  const css = `${themesCss}\n\n${classlessCss}`;
  const html = TEMPLATE.replace("__CSS__", css);
  await file(outPath).write(html);
  console.log(`Generated ${outPath}`);
} catch (e) {
  console.error("Failed to generate template:", e);
  process.exit(1);
}
