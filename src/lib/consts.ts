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
// export const Identifier = 0;
// export const Number = 1;
// export const String = 2;
// export const Punctuator = 3;
// export const Keyword = 4;
// export const JSXStart = 5;
// export const JSXEnd = 6;
// export const JSXSelfclosed = 7;

export { bunfigText };
