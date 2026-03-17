import { bunfigText } from "./lib/consts";
import { createFiles, detectEntries } from "./lib/util";

export async function dev() {
  const entries = detectEntries();

  await createFiles(entries);

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
  // console.log(`Exists of bunfig...`);

  // function onExit() {
  //   console.log(`Exit`);
  // }

  // // process.on(`beforeExit`, onExit);
  // // process.on(`exit`, onExit);
  // // process.on(`SIGTERM`, onExit);
  // process.on(`SIGINT`, onExit);

  // Need be spawn (no spawnSync) because of ipc
  Bun.spawnSync({
    cmd: [`bun`, `node_modules/.cache/wdwh/server.ts`],
    stdio: [`ignore`, `inherit`, `inherit`],
  });
}

async function respawnIgnoreExit() {
  try {
    await Bun.$`bunx wdwh dev`;
  } catch {}
  process.exit();
}
