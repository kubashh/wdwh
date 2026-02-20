/// <reference path="../../node_modules/wdwh/index.d.ts" />

import App from "./App.tsx"

export const config: WdwhConfig = {
  outdir: `./dist`,
  bundleCss: true,
  hashFiles: true,
  cleanPrev: true,
  external: [],
}

export const metadata: Metadata = {
  iconPath: `./react.svg`,
  title: `Example`,
}

export default function Page() {
  return (
    <html>
      <head></head>
      <body className="bg-black text-white">
        <App />
      </body>
    </html>
  )
}
