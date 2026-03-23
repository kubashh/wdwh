import path from "path";
import { cachePath, files } from "./consts";
import type { Metadata } from "../..";

export async function createFiles(entries: Entry[]) {
  // generate cache files for each detected entry
  for (const entry of entries) {
    for (const path in files) {
      await Bun.write(path, files[path]!);
    }

    const body = await getBodyPropsFromIndexTSX(entry);
    const { title, iconPath, ...rest } = await readMetadata(entry);

    const iconRealPath = path.join(
      `../`.repeat(entry.urlPath.split(`/`).length + 2),
      `src/app`,
      entry.urlPath,
      iconPath,
    );

    const outPath = path.join(cachePath, entry.urlPath, `index.html`);
    const buf = [
      `<!DOCTYPE html>`,
      `<html lang="en">`,
      `<head>`,
      `<meta charset="UTF-8" />`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
      `<title>${title}</title>`,
      `<link rel="icon" href="${iconRealPath}" />`,
      // if page author included title/meta/link tags they will appear here
      ...Object.entries(rest).map(([key, value]) => `<meta name="${key}" content="${value}" />`),
      `<script src="${path.join(entry.urlPath, `./frontend.tsx`)}"></script>`,
      `</head>`,
      body,
      `</html>`,
    ];

    await Bun.write(outPath, buf.join(`\n`));
  }
}

async function getBodyPropsFromIndexTSX(entry: Entry) {
  const text = await Bun.file(entry.tsxPath).text();

  let body = getHtmlElement(text, `body`).replaceAll(`className`, `class`);

  const bodyStart = body.indexOf(`>`) + 1;
  const bodyEnd = body.lastIndexOf(`<`);
  body = body.replace(body.slice(bodyStart, bodyEnd), ``);

  return body;
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
export function detectEntries(): Entry[] {
  const glob = new Bun.Glob(`**/index.tsx`);
  const entries: Entry[] = [];
  for (const relPath of glob.scanSync(`src/app`)) {
    const tsxPath = path.join(`src/app`, relPath);
    const urlPath = relPath.replace(/index\.tsx$/, ``).replace(/\\/g, `/`);
    entries.push({
      tsxPath,
      urlPath,
    });
  }
  return entries;
}

async function readMetadata(entry: Entry): Promise<Metadata> {
  let text = await Bun.file(entry.tsxPath).text();
  text = text
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

  if (!metadata.title) error(`Matadata must contain "title"`);
  if (!metadata.iconPath) error(`Matadata must contain "iconPath"`);
  if (!metadata.description) error(`Matadata must contain "description"`);

  return metadata;
}

function error(msg: string): never {
  console.error(`Error:`, msg);
  process.exit(1);
}
