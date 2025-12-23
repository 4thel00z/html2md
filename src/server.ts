import indexHtml from "./index.html";

const server = Bun.serve({
  routes: {
    "/": indexHtml,
    "/template.generated.html": () => {
      return new Response(
        Bun.file(new URL("./infrastructure/template.generated.html", import.meta.url)),
        {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    },
  },
  development: true,
});

console.log(`Demo running at http://localhost:${server.port}`);
