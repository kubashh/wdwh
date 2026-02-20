#!/usr/bin/env bun

import { dev } from "./dev"
import { build } from "./build"

switch (process.argv[2]) {
  case `dev`:
    await dev()
    break
  case `build`:
    await build()
    break
  case `init`:
    if (!process.argv[3]) {
      console.log(`USAGE:

  bunx wdwh@latest init my-app    # create app in 'my-app' directory, "." for current directory`)
      process.exit(1)
    }
    Bun.spawnSync([`bun`, `create`, `wdwh-app@latest`, process.argv[3]])
    break
  default: {
    console.log(`wrong command: "${process.argv.at(2)}"\ntry "dev" | "build"`)
    process.exit(1)
  }
}
