import { cachePath, files } from "./consts"

export async function readMetadata() {
  const text = await Bun.file(`./src/app/index.tsx`).text()

  const config = getOBjFromJsString(text, `export const config`) as WdwhConfig

  const metadata = getOBjFromJsString(text, `export const metadata`) as Metadata
  if (metadata.iconPath && metadata.iconPath[0] === `.`)
    metadata.iconPath = `../../../src/app${metadata.iconPath.slice(1)}`

  return { config, metadata }
}

function getOBjFromJsString(text: string, id: string) {
  const i = text.indexOf(`{`, text.indexOf(id))
  const j = text.indexOf(`}`, i) + 1

  return parseJsObjectString(text.slice(i, j))
}

function parseJsObjectString(str: string): any {
  let s = str.trim()

  // 1. Remove comments
  s = s.replace(/\/\/.*$/gm, "")
  s = s.replace(/\/\*[\s\S]*?\*\//g, "")

  // 2. Delete trailing commas
  s = s.replace(/,\s*([}\]])/g, "$1")

  // 3. Add key quotes
  s = s.replace(/([{,]\s*)([A-Za-z0-9_$]+)\s*:/g, '$1"$2":')

  // 4. Change quotes to doubles
  s = s.replace(/'|`/g, '"')

  return JSON.parse(s)
}

export async function createFiles() {
  const { metadata } = await readMetadata()

  for (const path in files) {
    await Bun.write(path, files[path] as any)
  }

  const { headContent, body } = await getPropsFromIndexTSX()

  // write html
  const { title, iconPath, ...rest } = metadata

  const buf = [
    `<!DOCTYPE html>`,
    `<html lang="en">`,
    `<head>`,
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    headContent,
    Object.keys(rest).map((key) => `<meta name="${key}" content="${rest[key]}" />`),
    `<link rel="icon" href="${iconPath}" />`,
    `<title>${title}</title>`,
    `<script src="./frontend.tsx"></script>`,
    `</head>`,
    body,
    `</html>`,
  ]

  await Bun.write(`${cachePath}/index.html`, buf.join(`\n`))
}

async function getPropsFromIndexTSX() {
  const text = await Bun.file(`./src/app/index.tsx`).text()

  const headContent = getHtmlElement(text, `head`).slice(6, -7)
  let body = getHtmlElement(text, `body`).replaceAll(`className`, `class`)

  const bodyStart = body.indexOf(`>`) + 1
  const bodyEnd = body.lastIndexOf(`<`)
  body = body.replace(body.slice(bodyStart, bodyEnd), ``)

  return { headContent, body }
}

function getHtmlElement(text: string, name: string) {
  for (let sliceStart, sliceEnd = text.indexOf(`export default`); ; sliceEnd++) {
    if (!sliceStart && text.startsWith(`<${name}`, sliceEnd)) sliceStart = sliceEnd
    if (sliceStart && text.startsWith(`</${name}>`, sliceEnd)) {
      return text
        .slice(sliceStart, sliceEnd + name.length + 3)
        .replaceAll(`\n`, ` `)
        .replaceAll(/\s{2,}/g, ` `)
        .trim()
    }
  }
}
