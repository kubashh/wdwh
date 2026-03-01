type Entry = {
  filePath: string;
  htmlPath: string;
  urlPath: string;
  tmpPath: string;
  iconPath: string;
};

type WdwhConfig = {
  outdir?: string;
  hashFiles?: boolean;
  cleanPrev?: boolean;
  external?: string[];
};
