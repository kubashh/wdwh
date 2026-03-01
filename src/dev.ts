import { bunfigText } from "./lib/consts";
import { createFiles, detectEntries } from "./lib/util";

export async function dev() {
  const entries = detectEntries();

  await createFiles(entries);

  // Handle bunfig

  const bunfigFile = Bun.file(`./bunfig.toml`);
  if (await bunfigFile.exists()) {
    let currentText = await bunfigFile.text();
    if (!currentText.includes(`bun-plugin-tailwind`)) {
      currentText += `${currentText === `` ? `` : `\n`}${bunfigText}`;
      await bunfigFile.write(currentText);
      try {
        await Bun.$`bunx wdwh dev`;
      } catch {}
      process.exit();
    }
  } else {
    await bunfigFile.write(bunfigText);

    async function deleteBunfig() {
      const newBunfigFile = Bun.file(`bunfig.toml`);
      try {
        if (await newBunfigFile.exists()) await newBunfigFile.delete();
      } catch {}
    }

    process.on(`SIGINT`, deleteBunfig);
    setTimeout(deleteBunfig, 250);
    try {
      await Bun.$`bunx wdwh dev`;
    } catch {}
    process.exit();
  }

  // Need be spawn (no spawnSync) because of ipc
  const child = Bun.spawn({
    cmd: [`bun`, `node_modules/.cache/wdwh/server.ts`],
    stdout: "ignore", // discard normal output
    stderr: "inherit", // show errors in your terminal
    ipc:
      // Handles messages from the child, print port
      (message: { text?: string }) => {
        console.log(message);
        // child.disconnect()
      },
  });

  await child.exited;
}
