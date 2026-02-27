import { cpSync, renameSync, rmSync } from "fs"

const files = [`wdwh.js`, `signal.js`, `signal.d.ts`, `hooks.js`, `hooks.d.ts`]

// Setup
if (process.argv.includes(`-i`)) {
  cpSync(`template/template`, `workspace`, { recursive: true })
  Bun.spawnSync({
    cmd: [`bun`, `i`],
    cwd: `workspace`,
  })
  await Bun.$`bun run build -s`
  for (const file of files) {
    renameSync(file, `workspace/node_modules/wdwh/${file}`)
  }
}

// Jobs
Bun.spawnSync({
  cmd: [`bun`, `run`, `build`],
  stdio: [`inherit`, `inherit`, `inherit`],
  cwd: `workspace`,
})
Bun.spawnSync({
  cmd: [`bun`, `dev`],
  stdio: [`inherit`, `inherit`, `inherit`],
  cwd: `workspace`,
})

// Cleanup
rmSync(`workspace`, { recursive: true })
