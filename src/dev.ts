import { FileSync, spawnSync } from "@kubashh/nutil"
import { bunfigText } from "./consts"
import { createFiles } from "./util"

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

  spawnSync({
    cmd: cmd.split(` `),
    stdio: `inherit`,
  })
}
