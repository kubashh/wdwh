#!/usr/bin/env bun

import { dev } from "./dev"
import { build } from "./build"

if (process.argv.includes(`dev`)) dev()
else if (process.argv.includes(`build`)) await build()
else console.log(`wrong command: "${process.argv.at(2)}"\ntry "dev" | "build"`)
