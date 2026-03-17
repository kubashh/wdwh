import { rmSync } from "fs";

// Config
// publish => emit types (is slow with ts 5.x)
const isPublish = process.argv.includes(`--publish`);
const emitTypes = isPublish || !process.argv.includes(`--noTypes`);
const isClear = process.argv.includes(`--clear`);
const rmOptions = { force: true };

// Build
await Promise.all([
  buildWithBun(`src/wdwh.ts`),
  ...buildWithDeclarations(`signal.ts`),
  ...buildWithDeclarations(`hooks.ts`),
]);

// Publish
if (isPublish) {
  try {
    const packageJson = await Bun.file(`package.json`).json();
    if (packageJson.version.includes(`dev`)) await Bun.$`bun publish --tag=dev`;
    else await Bun.$`bun publish`;
  } catch (e) {
    console.error(e);
  }
}

// Cleanup
if (isClear) {
  rmSync(`signal.js`);
  rmSync(`signal.d.ts`, rmOptions);
  rmSync(`hooks.js`);
  rmSync(`hooks.d.ts`, rmOptions);
  rmSync(`wdwh.js`);
}

// Helper
function buildWithDeclarations(name: string) {
  return [
    buildWithBun(name),
    emitTypes && Bun.spawn([`tsc`, name, `--declaration`, `--emitDeclarationOnly`, `--outDir`, `.`]).exited,
  ];
}

function buildWithBun(name: string) {
  return Bun.build({
    entrypoints: [name],
    outdir: `.`,
    target: `bun`,
    minify: true,
    external: [`react`, `bun-plugin-tailwind`, `path`, `typescript`],
  });
}
