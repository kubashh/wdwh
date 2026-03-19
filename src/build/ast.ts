import ts from "typescript"; // need be import type

export class AST {
  code;
  i = 0;
  tokens: Token[] = [];

  static async ast(code: string) {
    await FromTSAST.from(code);
  }

  constructor(source: string) {
    this.code = source;
  }

  generate() {
    // const node: ASTNode = {
    //   type: `program`,
    //   props: {},
    //   children: [],
    // };
    // return node;
  }

  next() {}
}

class FromTSAST {
  source;

  static async from(code: string) {
    const fta = new FromTSAST(code);
    return fta;
  }

  constructor(code: string) {
    // const ts = await import(`typescript`);
    this.source = ts.createSourceFile(`test/testCode.tsx`, code, ts.ScriptTarget.Latest, true);

    // export default function
    const expDef = this.findExportDefault();

    // find return statement
    const ret = findExpDefReturn(expDef);

    const htmlTag = getHtmlTag(ret);
    // console.log(htmlTag.getText());

    htmlTag.forEachChild((node) => {
      if (!node.getText().startsWith(` `)) {
        console.log(`Child:`, node.getText(), node.kind);
      }
    });
    // console.log(htmlTag.getChildCount());

    // TODO find head/body and their childs
  }

  findExportDefault() {
    let expDef: ts.Node | undefined;
    this.source.forEachChild((node) => {
      if (node.getText().startsWith(`export default`)) {
        expDef = node;
      }
    });

    if (expDef) {
      if (expDef.kind !== ts.SyntaxKind.FunctionDeclaration) {
        throw new Error(`Export default must be function!`);
      }
      return expDef;
    }
    throw new Error(`No export default!`);
  }
}

function findExpDefReturn(expDef: ts.Node) {
  let ret: ts.Node | undefined;
  expDef.forEachChild((node) => {
    // function block
    if (node.kind === ts.SyntaxKind.Block) {
      node.forEachChild((node) => {
        if (node.kind === ts.SyntaxKind.ReturnStatement) {
          ret = node;
        }
      });
    }
  });

  if (ret) return ret;
  throw new Error(`No return in export default function!`);
}

function getHtmlTag(ret: ts.Node) {
  let htmlTag: ts.Node | undefined;
  ret.forEachChild((node) => {
    if (node.kind === ts.SyntaxKind.ParenthesizedExpression) {
      htmlTag = getHtmlTag(node);
    } else if (node.kind === ts.SyntaxKind.JsxElement) {
      htmlTag = node;
    }
  });

  if (htmlTag) return htmlTag;
  throw new Error(`No html tag in return function!`);
}

// class Tokenizer {
//   code;
//   i = 0;
//   tokens: Token[] = [];

//   static tokenize(code: string) {
//     const tokenizer = new Tokenizer(code);

//     let tokens: Token[] = [];

//     let tok: Token;
//     while ((tok = tokenizer.next())) {
//       tokens.push();
//     }

//     return tokens;
//   }

//   constructor(code: string) {
//     this.code = code;
//   }

//   next(): Token {
//     // Comments

//     // Punctuators

//     // Numbers

//     // String

//     // Identifiers/Keywords

//     // Whitespace
//     if ([` `, `\n`].includes(this.peek())) {
//       return this.next();
//     }

//     throw new Error(`Tokenization error!`);
//   }

//   peek(n = 0) {
//     return this.code[this.i + n]!;
//   }
// }
