#!/usr/bin/env bun

import { cpSync, existsSync, rmSync } from "fs";
import path from "path";
import { dev } from "./dev";
import { build } from "./build/build";

const zipPath = `./tmp.zip`;
const url = "https://raw.githubusercontent.com/kubashh/wdwh/main/template/template.zip";

switch (process.argv[2]) {
  case `dev`:
    await dev();
    break;
  case `build`:
    await build();
    break;
  case `init`: {
    // Get zipped template
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`feach error: ${res.status}`);
      process.exit(1);
    }
    const buffer = await res.bytes();
    await Bun.write(zipPath, buffer);

    // Unpack zip
    const cmd =
      process.platform === `win32`
        ? [`powershell`, `-Command`, `Expand-Archiv`, `-Path`, zipPath, `-DestinationPath`, `.`, `-Force`]
        : [`unzip`, `-o`, zipPath, `-d`, `.`]; // Linux / macOS: use system unzip
    Bun.spawnSync(cmd);

    // Copy in not exist
    const glob = new Bun.Glob(`**/*`);
    for (const relPath of glob.scanSync(`template/template`)) {
      if (!existsSync(relPath)) {
        cpSync(path.join(`template/template`, relPath), relPath);
        console.log(`+ ${relPath}`);
      }
    }
    cpSync(`./template/template`, `.`, { recursive: true });

    // Cleanup
    rmSync(zipPath);
    rmSync(`./template`, { recursive: true });

    console.log(`\nRun "bun i && bun dev" and start development!`);
    break;
  }
  default: {
    console.log(`Usage:
wdwh dev
wdwh build
      --dir             # Print out dir
      --time            # Print build time

bunx wdwh@latest init   # Init new project in current directory

wrong command: "${process.argv.at(2)}"`);
    process.exit(1);
  }
}
