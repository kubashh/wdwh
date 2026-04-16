import path from "path";
import { cachePath, files } from "./consts";
import type { Metadata } from "../..";

export async function createFiles(entries: Entry[]) {
  // generate cache files for each detected entry
  const promises: Promise<void>[] = [];
  for (const entry of entries) {
    promises.push(createEntryFiles(entry));
  }
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
  const { title, iconPath, htmlLang, ...rest } = await readMetadata(entry);

  const iconRealPath = path.join(
    `../`.repeat(entry.urlPath.split(`/`).length + 2),
    `src/app`,
    entry.urlPath,
    iconPath,
  );

  const buf = [
    `<!DOCTYPE html>`,
    `<html lang="${htmlLang || `en`}>`,
    `<head>`,
    `<meta charset="UTF-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    `<title>${title}</title>`,
    `<link rel="icon" href="${iconRealPath}" />`,
    // if page author included title/meta/link tags they will appear here
    ...Object.entries(rest).map(([key, value]) => `<meta name="${key}" content="${value}" />`),
    `<script src="${entry.frontendPath}"></script>`,
    `</head>`,
    body,
    `</html>`,
  ];

  await Bun.write(entry.htmlOutPath, buf.join(`\n`));
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

// TODO handle entries
export async function detectEntries(): Promise<Entry[]> {
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
  return entries;
}

async function readMetadata(entry: Entry): Promise<Metadata> {
  let text = entry.tsxText
    // Convert single quotes to double quotes
    .replaceAll(/'|`/g, `"`)
    // Add quotes around unquoted keys
    .replaceAll(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, `$1"$2":`)
    // Temove trailing comma
    .replace(/,\s*([}\]])/g, `$1`);

  const start = text.indexOf(`{`, text.indexOf(`export const metadata`));
  const end = text.indexOf(`}`, start) + 1;
  text = text.slice(start, end);

  const metadata = JSON.parse(text);

  if (typeof metadata.title !== `string`) error(`Matadata must contain "title"`);
  if (typeof metadata.iconPath !== `string`) error(`Matadata must contain "iconPath"`);
  if (typeof metadata.description !== `string`) error(`Matadata must contain "description"`);

  return metadata;
}

function error(msg: string): never {
  console.error(`[error]`, msg);
  process.exit(1);
}

function log(...msgs: string[]) {
  console.log(`[log]`, ...msgs);
}
