import { rmSync } from "fs"

// Build
const prom = [
  buildWithBun(`src/wdwh.ts`),
  ...buildWithDeclarations(`signal.ts`),
  ...buildWithDeclarations(`hooks.ts`),
]
await Promise.all(prom)

// Publish
if (process.argv[2] === `pub`) {
  try {
    const packageJson = await Bun.file(`package.json`).json()
    if (packageJson.version.includes(`dev`)) await Bun.$`bun publish --tag=dev`
    else await Bun.$`bun publish`
  } catch (e) {
    console.error(e)
  }
}

// Cleanup
if (!process.argv.includes(`-s`)) {
  rmSync(`signal.js`)
  rmSync(`signal.d.ts`)
  rmSync(`hooks.js`)
  rmSync(`hooks.d.ts`)
  rmSync(`wdwh.js`)
}

// Helper
function buildWithDeclarations(name: string) {
  return [
    buildWithBun(name),
    Bun.spawn([`tsc`, name, `--declaration`, `--emitDeclarationOnly`, `--outDir`, `.`]).exited,
  ]
}

function buildWithBun(name: string) {
  return Bun.build({
    entrypoints: [name],
    outdir: `.`,
    target: `bun`,
    minify: true,
    external: [`react`, `bun-plugin-tailwind`, `path`],
  })
}
