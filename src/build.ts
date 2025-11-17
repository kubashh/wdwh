import plugin from "bun-plugin-tailwind"
import { rmSync } from "fs"
import { relative } from "path"
import { cachePath } from "./consts"
import { createFiles, readMetadata } from "./util"

export async function build() {
  const { config } = await readMetadata()

  await createFiles()

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

  console.log(`Building...`)

  rmSync(config.outdir, { recursive: true, force: true })

  const start = performance.now()

  // Build all the HTML files
  const result = await Bun.build(buildConfig)

  // Minify html code
  const htmlFile = Bun.file(`${config.outdir}/index.html`)
  let html = minifyHtml(await htmlFile.text())

  // Bundle css into html
  if (config.bundleCss) {
    const cssArtefact = result.outputs.find((e) => e.path.endsWith(`.css`))
    if (cssArtefact?.path) {
      const cssFile = Bun.file(cssArtefact.path)

      const cssStart = html.indexOf(`<link rel="stylesheet"`)

      let cssEnd = cssStart
      for (; cssEnd < html.length; cssEnd++) {
        if ([`/>`, `">`].includes(html.slice(cssEnd, cssEnd + 2))) {
          cssEnd += 2
          break
        }
      }

      const slice = html.slice(cssStart, cssEnd)
      const cssCode = `<style>${minifyHtml(await cssFile.text())}</style>`

      html = html.replace(slice, cssCode)
      cssFile.delete()
      result.outputs.splice(result.outputs.indexOf(cssArtefact), 1)
    }
  }

  htmlFile.write(html)

  // Print the results
  const buildTime = (performance.now() - start).toFixed(0)

  const outputTable = result.outputs.reduce(
    (prev, output) => prev + `  ${relative(process.cwd(), output.path)}\n`,
    ``
  )
  console.log(`\nOutput:
${outputTable}
Done in ${buildTime}ms\n`)
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
