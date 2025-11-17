const packageJson = await Bun.file(`package.json`).json()
if (packageJson.version.includes(`dev`)) await Bun.$`npm publish --tag=dev`
else await Bun.$`npm publish`
