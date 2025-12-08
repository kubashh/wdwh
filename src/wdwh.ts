#!/usr/bin/env bun

import { dev } from "./dev"
import { build } from "./build"

if (process.argv.includes(`build`)) await build()
else dev()
