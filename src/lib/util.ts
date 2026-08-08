import path from "path";
import { cachePath, files } from "./consts";
import type { Metadata } from "../..";

export async function handleEntries(): Promise<Entry[]> {
  // TODO handle .html files too `**/index.{tsx,html}`
  const glob = new Bun.Glob(`**/index.tsx`);
  const entries: Entry[] = [];
  for (const relPath of glob.scanSync(`src/app`)) {
    const tsxPath = path.join(`src/app`, relPath);
    const urlPath = relPath.replace(/index\.tsx$/, ``).replace(/\\/g, `/`);
    const frontendPath = path.join(urlPath, `./frontend.tsx`);
    const htmlOutPath = path.join(cachePath, urlPath, `index.html`);
    entries.push({
      tsxPath,
      tsxText: await Bun.file(tsxPath).text(),
      urlPath,
      frontendPath,
      htmlOutPath,
    });
  }

  await createFiles(entries);

  return entries;
}

// generate cache files for each detected entry
async function createFiles(entries: Entry[]) {
  const promises = entries.map((entry) => createEntryFiles(entry));
  await Promise.all(promises);
}

async function createEntryFiles(entry: Entry) {
  log(`Create entry:`, entry.urlPath); // TMP
  for (const path in files) {
    await Bun.write(path, files[path]!);
  }

  // index.html
  log(`Creating index.html...`); // TMP
  const body = getBodyPropsFromIndexTSX(entry);
  const { title, iconPath, bundleIcon, htmlLang, ...rest } = await readMetadata(entry);

  let iconElement: string = ``;
  const iconRealPath = path.join(
    `../`.repeat(entry.urlPath.split(`/`).length + 2),
    `src/app`,
    entry.urlPath,
    iconPath,
  );

  if (bundleIcon !== `true`) {
    iconElement = `<link rel="icon" href="${iconRealPath}" />`;
  } else {
    const ppp = path.join(process.cwd(), `src/app`, iconPath);
    const file = Bun.file(ppp);
    const buf = await file.bytes();
    const base64 = buf.toBase64();

    const lower = iconPath.toLowerCase();
    let mime = `application/octet-stream`;
    if (lower.endsWith(`.ico`)) mime = `image/x-icon`;
    else if (lower.endsWith(`.png`)) mime = `image/png`;
    else if (lower.endsWith(`.jpg`) || lower.endsWith(`.jpeg`)) mime = `image/jpeg`;
    else if (lower.endsWith(`.webp`)) mime = `image/webp`;
    else if (lower.endsWith(`.svg`)) mime = `image/svg+xml`;

    iconElement = `<link rel="icon" href="data:${mime};base64,${base64}" />`;
  }

  const buf = [
    `<!DOCTYPE html>`,
    `<html lang="${htmlLang || `en`}">`,
    `<head>`,
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    `<title>${title}</title>`,
    iconElement,
    // if page author included title/meta/link tags they will appear here
    ...Object.entries(rest).map(([key, value]) => `<meta name="${key}" content="${value}" />`),
    `<script src="${entry.frontendPath}"></script>`,
    `</head>`,
    body,
    `</html>`,
  ];

  await Bun.write(entry.htmlOutPath, buf.join(`\n`));
}

async function readMetadata(entry: Entry): Promise<Metadata> {
  let text = entry.tsxText
    // Convert string template quotes
    .replaceAll("`", `"`);

  const start = text.indexOf(`{`, text.indexOf(`export const metadata`));
  const end = text.indexOf(`}`, start) + 1;
  text = text.slice(start, end);

  const metadata: any = Bun.JSON5.parse(text);

  if (typeof metadata.title !== `string`) error(`Matadata must contain "title"`);
  if (typeof metadata.iconPath !== `string`) error(`Matadata must contain "iconPath"`);
  if (typeof metadata.description !== `string`) error(`Matadata must contain "description"`);

  return metadata;
}

function getBodyPropsFromIndexTSX(entry: Entry) {
  const body = getHtmlElement(entry.tsxText, `body`).replaceAll(`className`, `class`);

  const bodyStart = body.indexOf(`>`) + 1;
  const bodyEnd = body.lastIndexOf(`<`);

  return body.replace(body.slice(bodyStart, bodyEnd), ``);
}

function getHtmlElement(text: string, name: string) {
  for (let sliceStart, sliceEnd = text.indexOf(`export default`); ; sliceEnd++) {
    if (!sliceStart && text.startsWith(`<${name}`, sliceEnd)) sliceStart = sliceEnd;
    if (sliceStart && text.startsWith(`</${name}>`, sliceEnd)) {
      return text
        .slice(sliceStart, sliceEnd + name.length + 3)
        .replaceAll(`\n`, ` `)
        .replaceAll(/\s{2,}/g, ` `)
        .trim();
    }
  }
}

function error(msg: string): never {
  console.error(`[error]`, msg);
  process.exit(1);
}

function log(...msgs: string[]) {
  process.argv.includes(`--wdwh-dev`) && console.log(`[log]`, ...msgs);
}
