export const cachePath = `./node_modules/.cache/wdwh`

export const bunfigText = `
[serve.static]
plugins = ["bun-plugin-tailwind"]
env = "BUN_PUBLIC_*"`

export const files: Record<string, string> = {
  [`${cachePath}/frontend.tsx`]: `import { createRoot } from "react-dom/client"
import "../../../src/app/index.css"
import App from "../../../src/app/App.tsx"

createRoot(document.getElementsByTagName("body")[0]).render(<App />)`,
  [`${cachePath}/server.ts`]: `import index from "./index.html"

const server = Bun.serve({
  routes: { "/*": index },
  development: { hmr: true },
})

console.log(\`> Server running at \${server.url}\`)
`,
}
