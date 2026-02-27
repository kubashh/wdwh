type WdwhConfig = {
  outdir?: string
  hashFiles?: boolean
  cleanPrev?: boolean
  external?: string[]
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
