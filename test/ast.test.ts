import { AST } from "../src/build/ast";

const code = await Bun.file(`test/testCode.tsx`).text();

await Bun.$`clear`;
await AST.ast(code);
