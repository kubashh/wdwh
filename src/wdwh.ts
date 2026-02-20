#!/usr/bin/env bun

import { readdirSync, mkdirSync } from "fs"
import { join } from "path"
import { dev } from "./dev"
import { build } from "./build"

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
      await downloadGitHubFolder(`template`, `.`)
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

export async function downloadGitHubFolder(folderPath: string, localPath: string) {
  const apiUrl = `https://api.github.com/repos/kubashh/wdwh/contents/${folderPath}`

  const res = await fetch(apiUrl)
  if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)

  const files: GitHubFile[] = (await res.json()) as any

  mkdirSync(localPath, { recursive: true })

  for (const file of files) {
    const fileLocalPath = join(localPath, file.name)

    if (file.type === `file` && file.download_url) {
      const fileRes = await fetch(file.download_url)
      const buffer = new Uint8Array(await fileRes.arrayBuffer()) // supports text & binary
      await Bun.write(fileLocalPath, buffer)
      console.log(`Created: ${fileLocalPath}`)
    }

    if (file.type === `dir`) {
      await downloadGitHubFolder(file.path, fileLocalPath)
    }
  }
}

type GitHubFile = {
  name: string
  path: string
  type: string
  download_url: string
}
