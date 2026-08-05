import { bunfigText } from "./lib/consts";
import { handleEntries } from "./lib/util";

export async function dev() {
  await handleEntries();

  // Handle bunfig
  // TODO fix bunfig existence

  const bunfigFile = Bun.file(`./bunfig.toml`);
  if (await bunfigFile.exists()) {
    // console.log(`Creating bunfig...`);
    let currentText = await bunfigFile.text();
    if (!currentText.includes(`bun-plugin-tailwind`)) {
      currentText += `${currentText === `` ? `` : `\n`}${bunfigText}`;
      await bunfigFile.write(currentText);
      await respawnIgnoreExit();
    }
  } else {
    // console.log(`Deleting bunfig...`);
    await bunfigFile.write(bunfigText);

    async function deleteBunfig() {
      const newBunfigFile = Bun.file(`bunfig.toml`);
      try {
        if (await newBunfigFile.exists()) await newBunfigFile.delete();
      } catch {}
    }

    process.on(`SIGINT`, deleteBunfig);
    setTimeout(deleteBunfig, 250);
    await respawnIgnoreExit();
  }

  Bun.spawnSync({
    cmd: [`bun`, `node_modules/.cache/wdwh/server.ts`],
    stdio: [`ignore`, `inherit`, `inherit`],
  });
}

async function respawnIgnoreExit() {
  try {
    await Bun.$`bun x wdwh dev`;
  } catch {}
  process.exit();
}
