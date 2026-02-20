import { bunfigText } from "./consts"
import { createFiles } from "./util"

export async function dev() {
  await createFiles()

  // Handle bunfig

  const bunfigFile = Bun.file(`./bunfig.toml`)
  if (await bunfigFile.exists()) {
    let currentText = await bunfigFile.text()
    if (!currentText.includes(`bun-plugin-tailwind`)) {
      currentText += `${currentText === `` ? `` : `\n`}${bunfigText}`
      await bunfigFile.write(currentText)
      try {
        await Bun.$`bunx wdwh dev`
      } catch {}
      process.exit()
    }
  } else {
    await bunfigFile.write(bunfigText)

    async function deleteBunfig() {
      const newBunfigFile = Bun.file(`bunfig.toml`)
      try {
        if (await newBunfigFile.exists()) await newBunfigFile.delete()
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
