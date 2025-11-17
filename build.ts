await Bun.build({
  entrypoints: [`src/main.ts`],
  outdir: `dist`,
  minify: true,
  target: `bun`,
  external: [`bun-plugin-tailwind`],
})
