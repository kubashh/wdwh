#!/usr/bin/env bun

import { dev } from "./dev"
import { build } from "./build"

switch (process.argv.at(2)) {
  case `dev`:
    dev()
    break
  case `build`:
    await build()
    break
  default: {
    console.log(`wrong command: "${process.argv.at(2)}"\ntry "dev" | "build"`)
    process.exit()
  }
}
