import { rmSync } from "fs"

await build()

const packageJson = await Bun.file(`package.json`).json()
if (packageJson.version.includes(`dev`)) await Bun.$`bun publish --tag=dev`
else await Bun.$`bun publish`

// Cleaning
rmSync(`dist`, { recursive: true })

async function build() {
  await Bun.build({
    entrypoints: [`src/main.ts`],
    outdir: `dist`,
    minify: true,
    target: `bun`,
    external: [`bun-plugin-tailwind`],
  })
}
