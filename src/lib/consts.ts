// @ts-ignore
import frontendText from "./files/frontend.tsx" with { type: "text" };
// @ts-ignore
import serverText from "./files/server.ts" with { type: "text" };
import bunfigText from "./files/bunfig.toml" with { type: "text" };

const appPath = `../../../src/app/App.tsx`;
const cssPath = `../../../src/app/global.css`;

export const cachePath = `./node_modules/.cache/wdwh`;

export const files: Record<string, string> = {
  [`${cachePath}/frontend.tsx`]: minifyJs(
    frontendText.replace(`CSS_PATH`, cssPath).replace(`APP_PATH`, appPath),
  ),
  [`${cachePath}/server.ts`]: minifyJs(serverText),
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
  cleanPrev: true,
  tailwind: true,
  external: [],
};

export { bunfigText };

function minifyJs(code: string) {
  return code
    .replaceAll(/\/\*[\s\S]*?\*\//g, ``) // block comments
    .replaceAll(/\/\/.*$/gm, ``) // line comments
    .replaceAll(/\s+/g, ` `) // collapse whitespace
    .replaceAll(/\s*([{};,:()=])\s*/g, `$1`) // trim around some punctuation
    .replaceAll(`from "`, `from"`)
    .replaceAll(` />`, `/>`)
    .trim();
}
