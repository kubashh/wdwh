import frontendText from "./files/frontend.txt" with { type: "text" }
import serverText from "./files/server.txt" with { type: "text" }

const appPath = `../../../src/app/App.tsx`

export const cachePath = `./node_modules/.cache/wdwh`

export const files: Record<string, string> = {
  [`${cachePath}/frontend.tsx`]: frontendText.replace(`APP_PATH`, appPath),
  [`${cachePath}/server.ts`]: serverText,
}
