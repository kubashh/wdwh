import child_process from "child_process"
import { bunfigText } from "./consts"
import { createFiles } from "./util"
import { FileSync } from "@kubashh/nutil"

export function dev() {
  createFiles()

  // Handle bunfig
  let cmd = `bun node_modules/.cache/wdwh/server.ts`

  const bunfigFile = FileSync(`./bunfig.toml`)
  if (bunfigFile.exists()) {
    let currentText = bunfigFile.text()
    if (!currentText.includes(`bun-plugin-tailwind`)) {
      currentText += `${currentText === `` ? `` : `\n`}${bunfigText}`
      bunfigFile.write(currentText)
      cmd = `wdwh dev`
    }
  } else {
    bunfigFile.write(bunfigText)

    function deleteBunfig() {
      const bunfigFile = FileSync(`bunfig.toml`)
      try {
        if (bunfigFile.exists()) bunfigFile.delete()
      } catch {}
    }

    process.on(`SIGINT`, deleteBunfig)
    setTimeout(deleteBunfig, 250)
    cmd = `wdwh dev`
  }

  const [a1, ...rest] = cmd.split(` `)
  child_process.spawnSync(a1!, rest, {
    stdio: `inherit`,
  })
}
