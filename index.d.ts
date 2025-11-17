type WdwhConfig = {
  outdir: string
  bundleCss: boolean
  hashFiles: boolean
  external: string[]
}

type Metadata = {
  iconPath: string
  title: string
  description?: string
  author?: string
  keywords?: string
  themeColor?: string
  [name: string]: string | undefined
}
