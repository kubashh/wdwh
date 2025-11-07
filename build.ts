const text = (await Bun.file(`src/main.ts`).text())
  .split(`\n`)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith(`//`))
  .join(`\n`)

await Bun.write(`dist/main.ts`, text)
