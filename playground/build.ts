#!/usr/bin/env bun
import plugin from "bun-plugin-tailwind";
import { existsSync, rmSync } from "fs";
import path from "path";

const formatFileSize = (bytes: number): string => {
  const units = ["B", "KB", "MB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

console.log("\nStarting build process...\n");

const outdir = `./dist`;

if (existsSync(outdir)) {
  console.log(`Cleaning previous build at ${outdir}`);
  rmSync(outdir, { recursive: true, force: true });
}

const start = performance.now();

const entrypoints = [`./src/app/index.html`, `./src/app/test.html`, `./src/app/tt/tt.html`];

const result = await Bun.build({
  entrypoints,
  outdir,
  plugins: [plugin],
  minify: true,
  splitting: true,
  target: "browser",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
});

const end = performance.now();

const outputTable = result.outputs.map((output) => ({
  File: path.relative(process.cwd(), output.path),
  Type: output.kind,
  Size: formatFileSize(output.size),
}));

console.table(outputTable);
const buildTime = (end - start).toFixed(2);

console.log(`\nBuild completed in ${buildTime}ms\n`);
