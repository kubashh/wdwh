import { rmSync } from "fs"

await build()

const file = Bun.file(`./package.json`)
const text = await file.text()
const start = text.indexOf(`"version"`) + 12
let end = start

for (; ; end++) if (text[end] === `"`) break

const oldVersion = text.slice(start, end)
const arr = oldVersion.split(`-dev.`)
if (arr[1]) {
  arr[1] = String(Number(arr[1]) + 1)
  const newVersion = arr.join(`-dev.`)
  await file.write(text.replaceAll(oldVersion, newVersion))

  await Bun.$`bun publish --tag=dev`
} else {
  await Bun.$`bun publish`
}

// Cleaning
rmSync(`dist`, { recursive: true })

async function build() {
  const text = (await Bun.file(`src/main.ts`).text())
    .split(`\n`)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith(`//`))
    .join(`\n`)

  await Bun.write(`dist/main.ts`, text)
}
