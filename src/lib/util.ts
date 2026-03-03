import path from "path";
import { cachePath, files } from "./consts";

export async function createFiles(entries: Entry[]) {
  // generate cache files for each detected entry
  for (const entry of entries) {
    for (const path in files) {
      await Bun.write(path, files[path]!);
    }

    const { headContent, body } = await getPropsFromIndexTSX(entry);

    const outPath = path.join(cachePath, entry.urlPath, `index.html`);
    const buf = [
      `<!DOCTYPE html>`,
      `<html lang="en">`,
      `<head>`,
      `<meta charset="UTF-8" />`,
      `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
      // if page author included title/meta/link tags they will appear here
      headContent,
      `<script src="./frontend.tsx"></script>`,
      `</head>`,
      body,
      `</html>`,
    ];

    await Bun.write(outPath, buf.join(`\n`));
  }
}

async function getPropsFromIndexTSX(entry: Entry) {
  const text = await Bun.file(entry.tsxPath).text();

  let headContent = getHtmlElement(text, `head`).slice(6, -7);

  const iconSubpath = headContent.match(/<link\s+rel=["']icon["']\s+href=["']([^"']+)["']\s*\/?>/)?.at(1);
  if (iconSubpath) {
    let iconPath = path.join(
      `../`.repeat(entry.urlPath.split(`/`).length + 2),
      `src/app`,
      entry.urlPath,
      iconSubpath,
    );

    headContent = headContent.replace(
      /<link\s+rel=["']icon["']\s+href=["'][^"']+["']\s*\/?>/,
      `<link rel="icon" href="${iconPath}" />`,
    );
  }

  let body = getHtmlElement(text, `body`).replaceAll(`className`, `class`);

  const bodyStart = body.indexOf(`>`) + 1;
  const bodyEnd = body.lastIndexOf(`<`);
  body = body.replace(body.slice(bodyStart, bodyEnd), ``);

  return { headContent, body };
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
