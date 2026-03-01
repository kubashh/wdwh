import plugin from "bun-plugin-tailwind";
import fs from "fs";
import { cachePath } from "../lib/consts";
import { createFiles, detectEntries } from "../lib/util";

export async function build() {
  const start = performance.now();

  const entries = detectEntries();

  const packageJson = await Bun.file(`package.json`).json();
  const config: WdwhConfig = packageJson.wdwh || {};
  if (!config.outdir) config.outdir = `dist`;

  await createFiles(entries);

  const buildConfig: Bun.BuildConfig = {
    entrypoints: [`${cachePath}/index.html`],
    outdir: config.outdir,
    plugins: [plugin],
    minify: true,
    target: `browser`,
    sourcemap: `none`,
    // compile: config.bundle === true,
    external: config.external,
    naming:
      config.hashFiles === false
        ? {
            chunk: `[name].[ext]`,
            asset: `[name].[ext]`,
          }
        : undefined,
    define: {
      "process.env.NODE_ENV": `"production"`,
    },
  };

  // Cleaning
  if (config.cleanPrev) {
    fs.rmSync(config.outdir, {
      recursive: true,
      force: true,
    });
  }

  // Build all the HTML files
  const result = await Bun.build(buildConfig);

  // Minify html code
  const htmlFile = Bun.file(`${config.outdir}/index.html`);
  let html = minifyHtml(await htmlFile.text());

  // Bundle css into html
  if (entries.length === 1) {
    const cssArtefact = result.outputs.find((e) => e.path.endsWith(`.css`));
    if (cssArtefact?.path) {
      const cssFile = Bun.file(cssArtefact.path);

      const cssStart = html.indexOf(`<link rel="stylesheet"`);

      let cssEnd = cssStart;
      for (; cssEnd < html.length; cssEnd++) {
        if ([`/>`, `">`].includes(html.slice(cssEnd, cssEnd + 2))) {
          cssEnd += 2;
          break;
        }
      }

      const slice = html.slice(cssStart, cssEnd);
      const cssCode = `<style>${minifyHtml(await cssFile.text())}</style>`;

      html = html.replace(slice, cssCode);
      await cssFile.delete();
      result.outputs.splice(result.outputs.indexOf(cssArtefact), 1);
    }
  }

  await htmlFile.write(html);

  // Print the results
  const end = performance.now();
  if (process.argv.includes(`--dir`)) console.log(`See "${config.outdir}"`);
  if (process.argv.includes(`--time`)) console.log(`Build in ${end - start}ms`);
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
    .replaceAll(/ , | ,|, /g, `,`);
}
