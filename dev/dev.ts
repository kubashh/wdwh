import { cpSync, renameSync, rmSync } from "fs";

const files = [`wdwh.js`, `index.js`, `hooks.js`]; // `index.d.ts`, `hooks.d.ts`

// Setup
rmSync(`workspace/src`, { recursive: true, force: true });
cpSync(`template/${process.argv.includes(`--template`) ? `template` : `test-template`}`, `workspace`, {
  recursive: true,
  force: true,
});

await Promise.all([
  Bun.spawn({
    cmd: [`bun`, `i`],
    cwd: `workspace`,
  }).exited,
  Bun.$`bun run build`,
]);

for (const file of files) {
  renameSync(file, `workspace/node_modules/wdwh/${file}`);
}

// Test build
console.log(`Test build`);
Bun.spawnSync({
  cmd: [`bun`, `run`, `build`],
  stdio: [`inherit`, `inherit`, `inherit`],
  cwd: `workspace`,
});

// Test dev
console.log(`\nTest dev`);
Bun.spawnSync({
  cmd: [`bun`, `dev`],
  stdio: [`inherit`, `inherit`, `inherit`],
  cwd: `workspace`,
});
