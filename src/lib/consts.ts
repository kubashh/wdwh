import frontendText from "./files/frontend.txt" with { type: "text" };
import serverText from "./files/server.txt" with { type: "text" };
import bunfigText from "./files/bunfig.txt" with { type: "text" };

const appPath = `../../../src/app/App.tsx`;

export const cachePath = `./node_modules/.cache/wdwh`;

export const files: Record<string, string> = {
  [`${cachePath}/frontend.tsx`]: frontendText.replace(`APP_PATH`, appPath),
  [`${cachePath}/server.ts`]: serverText,
};

// if AST works make types numbers instead of strings
// export const TIdentifier = 0;
// export const TNumber = 1;
// export const TString = 2;
// export const TPunctuator = 3;
// export const TKeyword = 4;
// export const TJSXStart = 5;
// export const TJSXEnd = 6;
// export const TJSXSelfclosed = 7;

export const defaultConfig: Required<WdwhConfig> = {
  outdir: `dist`,
  hashFiles: true,
  cleanPrev: false,
  tailwind: true,
  external: [],
};

export { bunfigText };
