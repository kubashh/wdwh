import index from "./index.html";

const { url } = Bun.serve({
  routes: {
    "/": index,
    "/*": new Response(`Not found!`),
  },
  development: { hmr: true },
});

console.log(`> Server running at ${url}`);
