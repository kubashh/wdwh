#!/usr/bin/env bun

import { cpSync, readdirSync, rmSync } from "fs"
import { dev } from "./dev"
import { build } from "./build"

const zipPath = `./tmp.zip`
const url = "https://raw.githubusercontent.com/kubashh/wdwh/main/template/template.zip"

switch (process.argv[2]) {
  case `dev`:
    await dev()
    break
  case `build`:
    await build()
    break
  case `init`: {
    const files = readdirSync(`.`)

    if (files.length === 0) {
      // Get zipped template
      const res = await fetch(url)
      const buffer = await res.bytes()
      await Bun.write(zipPath, buffer)

      // Unpack zip
      const cmd =
        process.platform === `win32`
          ? [`powershell`, `-Command`, `Expand-Archiv`, `-Path`, zipPath, `-DestinationPath`, `.`, `-Force`]
          : [`unzip`, `-o`, zipPath, `-d`, `.`] // Linux / macOS: use system unzip
      Bun.spawnSync(cmd)
      cpSync(`./template/template`, `.`, { recursive: true })

      // Cleanup
      await Bun.file(zipPath).delete()
      rmSync(`./template`, { recursive: true })

      console.log(`Run "bun i && bun dev" and start development!`)
    } else {
      console.log(`Cannot initialize wdwh project: folder is not empty. Use an empty directory.`)
      process.exit(1)
    }

    break
  }
  default: {
    console.log(`wrong command: "${process.argv.at(2)}"\ntry "dev" | "build" | "init"`)
    process.exit(1)
  }
}
