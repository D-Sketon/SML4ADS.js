import { generateAst, generateAtomAst, tokenize } from "./ast";
import { generatePstl, generateStl } from "./generator";
import { convertIndentToNestedString } from "./preprocess";

export const template2Stl = (template: string[]): string[] => {
  return template
    .map(convertIndentToNestedString)
    .map(tokenize)
    .map(generateAtomAst)
    .map(generateAst)
    .map((ast) => {
      if (ast.length !== 1) {
        throw new Error(
          `Invalid input: parse error, expect 1 root node, got ${
            ast.length
          }: ${JSON.stringify(ast)}`
        );
      }
      return generateStl(ast[0]);
    });
};

export const template2PStl = (template: string[]): string[] => {
  return template
    .map(convertIndentToNestedString)
    .map(tokenize)
    .map(generateAtomAst)
    .map(generateAst)
    .map((ast) => {
      if (ast.length !== 1) {
        throw new Error(
          `Invalid input: parse error, expect 1 root node, got ${
            ast.length
          }: ${JSON.stringify(ast)}`
        );
      }
      return generatePstl(ast[0]);
    });
};
