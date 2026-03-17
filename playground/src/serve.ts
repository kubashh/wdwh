import index from "./app/index.html";
import test from "./app/test.html";

const server = Bun.serve({
  routes: {
    "/test": test,
    "/": index,
  },
  development: { hmr: true },
});

console.log(`> Server running at ${server.url}`);
