// information about a single page entrypoint
type Entry = {
  tsxPath: string; // path to src/app/.../index.tsx
  urlPath: string; // URL segment ('' for root)
};

type WdwhConfig = {
  outdir?: string;
  hashFiles?: boolean;
  cleanPrev?: boolean;
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

type Token = {
  value: string;
  type:
    | `Identifier`
    | `Number`
    | `String`
    | `Punctuator`
    | `Keyword`
    | `JSXStart`
    | `JSXEnd`
    | `JSXSelfclosed`;
};
