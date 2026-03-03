import fs from "fs";
import path from "path";
import plugin from "bun-plugin-tailwind";
import { cachePath } from "../lib/consts";
import { createFiles, detectEntries } from "../lib/util";

export async function build() {
  const entries = detectEntries();
  // await tsCheck(entries.map((e) => e.tsxPath));

  const start = performance.now();

  const packageJson = await Bun.file(`package.json`).json();
  const config: WdwhConfig = packageJson.wdwh || {};
  if (!config.outdir) config.outdir = `dist`;

  await createFiles(entries);

  // build each html file created in cache as separate entrypoint
  const entrypoints = entries.map((e) => path.join(cachePath, e.urlPath, `index.html`));
  // TODO cannot handle many entrypoints in build/dev, dev need to be dynamic
  // console.log(entrypoints);

  const buildConfig: Bun.BuildConfig = {
    entrypoints,
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

  // Minify & adjust html for each entry
  for (const entry of entries) {
    const htmlFile = Bun.file(path.join(config.outdir, entry.urlPath, `index.html`));
    let html = minifyHtml(await htmlFile.text());

    // if only one page, bundle css inline (preserves old behaviour)
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
