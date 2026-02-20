import { rmSync } from "fs"

// Build
await Bun.build({
  entrypoints: [`src/wdwh.ts`],
  outdir: `.`,
  target: `bun`,
  minify: true,
  external: [`bun-plugin-tailwind`],
})
await Bun.build({
  entrypoints: [`signal.ts`],
  outdir: `.`,
  target: `bun`,
  minify: true,
  external: [`react`],
})
await Bun.$`tsc signal.ts --declaration --emitDeclarationOnly --outDir .`

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
rmSync(`signal.js`)
rmSync(`signal.d.ts`)
rmSync(`wdwh.js`)
