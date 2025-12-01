import plugin from "bun-plugin-tailwind"
import { FileSync, fs } from "@kubashh/nutil"
import { cachePath } from "./consts"
import { createFiles, readConfig } from "./util"

export async function build() {
  const { config } = readConfig()

  createFiles()

  const buildConfig: Bun.BuildConfig = {
    entrypoints: [`${cachePath}/index.html`],
    outdir: config.outdir,
    plugins: [plugin],
    minify: true,
    target: `browser`,
    sourcemap: `none`,
    define: {
      "process.env.NODE_ENV": `"production"`,
    },
    external: config.external,
    naming: !config.hashFiles
      ? {
          chunk: `[name].[ext]`,
          asset: `[name].[ext]`,
        }
      : undefined,
  }

  // Cleaning
  if (config.cleanPrev && fs.existsSync(config.outdir)) fs.rmSync(config.outdir, { recursive: true })

  // Build all the HTML files
  const result = await Bun.build(buildConfig)

  // Minify html code
  const htmlFile = FileSync(`${config.outdir}/index.html`)
  let html = minifyHtml(htmlFile.text())

  // Bundle css into html
  if (config.bundleCss) {
    const cssArtefact = result.outputs.find((e) => e.path.endsWith(`.css`))
    if (cssArtefact?.path) {
      const cssFile = FileSync(cssArtefact.path)

      const cssStart = html.indexOf(`<link rel="stylesheet"`)

      let cssEnd = cssStart
      for (; cssEnd < html.length; cssEnd++) {
        if ([`/>`, `">`].includes(html.slice(cssEnd, cssEnd + 2))) {
          cssEnd += 2
          break
        }
      }

      const slice = html.slice(cssStart, cssEnd)
      const cssCode = `<style>${minifyHtml(cssFile.text())}</style>`

      html = html.replace(slice, cssCode)
      cssFile.delete()
      result.outputs.splice(result.outputs.indexOf(cssArtefact), 1)
    }
  }

  htmlFile.write(html)

  // Print the results
  console.log(`See "${config.outdir}"`)
}

function minifyHtml(text: string) {
  return text
    .replaceAll(`\n`, ` `)
    .replaceAll(/\s{2,}/g, ` `)
    .replaceAll(/ > | >|> /g, `>`)
    .replaceAll(/ < | <|< /g, `<`)
    .replaceAll(/ ; | ;|; /g, `;`)
    .replaceAll(/ { | {|{ /g, `{`)
    .replaceAll(/ } | }|} /g, `}`)
    .replaceAll(/ " | "|" /g, `"`)
    .replaceAll(/ , | ,|, /g, `,`)
}
