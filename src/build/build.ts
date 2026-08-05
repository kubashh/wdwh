import fs from "fs";
import path from "path";
import { cachePath, defaultConfig } from "../lib/consts";
import { handleEntries } from "../lib/util";

export async function build() {
  const entries = await handleEntries();

  const start = performance.now();

  const packageJson = await Bun.file(`package.json`).json();

  const config: Required<WdwhConfig> = { ...defaultConfig, ...packageJson.wdwh };

  // build each html file created in cache as separate entrypoint
  const entrypoints = entries.map((e) => path.join(cachePath, e.urlPath, `index.html`));
  // TODO handle many entrypoints in build/dev, dev need to be dynamic
  // console.log(entrypoints);

  const buildConfig: Bun.BuildConfig = {
    entrypoints,
    outdir: config.outdir,
    plugins: config.tailwind ? [(await import("bun-plugin-tailwind")).default] : undefined,
    minify: true,
    target: `browser`,
    external: config.external,
    naming: !config.hashFiles
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
  await Bun.build(buildConfig);

  // Minify & adjust html for each entry
  for (const entry of entries) {
    const htmlFile = Bun.file(path.join(config.outdir, entry.urlPath, `index.html`));
    const html = minifyHtml(await htmlFile.text());

    await htmlFile.write(html);
  }

  // Print the results
  const end = performance.now();
  if (process.argv.includes(`--info`)) {
    console.log(`See "${config.outdir}"`);
    console.log(`Build in ${end - start}ms`);
  }
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
