import { cpSync, renameSync } from "fs";

const files = [`wdwh.js`, `index.js`, `hooks.js`]; // `index.d.ts`, `hooks.d.ts`

// Setup
cpSync(`template/template`, `workspace`, { recursive: true, force: true });
Bun.spawnSync({
  cmd: [`bun`, `i`],
  cwd: `workspace`,
});
await Bun.$`bun run build --noTypes`;
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

// Cleanup
// rmSync(`workspace`, { recursive: true });
