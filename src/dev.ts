import { FileSync } from "@kubashh/nutil"
import { bunfigText } from "./consts"
import { createFiles } from "./util"

export async function dev() {
  createFiles()

  // Handle bunfig

  const bunfigFile = FileSync(`./bunfig.toml`)
  if (bunfigFile.exists()) {
    let currentText = bunfigFile.text()
    if (!currentText.includes(`bun-plugin-tailwind`)) {
      currentText += `${currentText === `` ? `` : `\n`}${bunfigText}`
      bunfigFile.write(currentText)
      try {
        await Bun.$`bunx wdwh dev`
      } catch {}
      process.exit()
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
    try {
      await Bun.$`bunx wdwh dev`
    } catch {}
    process.exit()
  }

  await Bun.$`bun node_modules/.cache/wdwh/server.ts`
}
