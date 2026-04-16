import fs from "fs";
import path from "path";
import plugin from "bun-plugin-tailwind";
import { cachePath, defaultConfig } from "../lib/consts";
import { createFiles, detectEntries } from "../lib/util";

export async function build() {
  const entries = await detectEntries();
  // await tsCheck(entries.map((e) => e.tsxPath));

  const start = performance.now();

  const packageJson = await Bun.file(`package.json`).json();

  // Can assign to defaultConfig, because it is used only once
  const config: Required<WdwhConfig> = Object.assign(defaultConfig, packageJson.wdwh);

  await createFiles(entries);

  // build each html file created in cache as separate entrypoint
  const entrypoints = entries.map((e) => path.join(cachePath, e.urlPath, `index.html`));
  // TODO cannot handle many entrypoints in build/dev, dev need to be dynamic
  // console.log(entrypoints);

  const buildConfig: Bun.BuildConfig = {
    entrypoints,
    outdir: config.outdir,
    plugins: config.tailwind ? [plugin] : undefined,
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

// async function tsCheck(files: string[] = []) {
//   const ts = await import("typescript");

//   // perform type check on all entry files (plus src/**/*.ts by default)
//   const rootNames = files.length ? files : ["./src/app/index.tsx"];
//   const program = ts.createProgram({
//     rootNames,
//     options: {
//       strict: true,
//       jsx: ts.JsxEmit.React,
//       allowUmdGlobalAccess: true,
//       noEmit: true,
//     },
//   });

//   const diagnostics = ts.getPreEmitDiagnostics(program);

//   diagnostics.forEach((d) => {
//     const message = ts.flattenDiagnosticMessageText(d.messageText, "\n");

//     if (d.file && d.start !== undefined) {
//       const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);

//       console.log(`${d.file.fileName} ${line + 1}:${character + 1}: ${message}`);
//     } else {
//       console.log(message);
//     }
//   });
// }
