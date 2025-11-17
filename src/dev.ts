import child_process from "child_process"
import { bunfigText } from "./consts"
import { createFiles } from "./util"

export async function dev() {
  await createFiles()

  // Handle bunfig
  let cmd = `bun node_modules/.cache/wdwh/server.ts`

  const bunfigFile = Bun.file(`./bunfig.toml`)
  if (await bunfigFile.exists()) {
    let currentText = await bunfigFile.text()
    if (!currentText.includes(`bun-plugin-tailwind`)) {
      currentText += `${currentText === `` ? `` : `\n`}${bunfigText}`
      bunfigFile.write(currentText)
      cmd = `wdwh dev`
    }
  } else {
    bunfigFile.write(bunfigText)

    async function deleteBunfig() {
      const bunfigFile = Bun.file(`bunfig.toml`)
      try {
        if (await bunfigFile.exists()) await bunfigFile.delete()
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
