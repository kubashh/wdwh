// information about a single page entrypoint
type Entry = {
  tsxPath: string; // path to src/app/.../index.tsx
  tsxText: string; // text of index.tsx
  urlPath: string; // URL segment ("" for root)
  htmlOutPath: string; // out path for index.html
  frontendPath: string; // for frontend.tsx
  // fileHash: string; // to implememt
};

type WdwhConfig = {
  /** Default: "./dist" */
  outdir?: string;

  /** Default: true */
  hashFiles?: boolean;

  /** Default: false */
  cleanPrev?: boolean;

  /** Default: true */
  tailwind?: boolean;

  /** Default: [] */
  external?: string[];
};

type TArg<T = any> = {
  name: string;
  value: T;
};

type TFunction<T = any> = {
  type: `functions`;
  args: TArg[];
  ret: T;
};

type ASTNode = {
  type: string;
  ret: ReactNode;
};

type ReactNode = {
  type: string;
  props: Record<string, any>;
  children: ASTNode[];
};

type TokenType =
  | `Identifier`
  | `Number`
  | `String`
  | `Punctuator`
  | `Keyword`
  | `JSXStart`
  | `JSXEnd`
  | `JSXSelfclosed`; // is needed?

// <div> - JSXStart; </div> - JSXEnd
// <div  - JSXStart;     /> - JSXEnd // but self-closed

type Token = {
  value: string;
  type: TokenType;
};
