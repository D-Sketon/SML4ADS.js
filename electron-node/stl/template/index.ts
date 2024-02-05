import { generateAst, generateAtomAst, tokenize } from "./ast";
import { generatePstl, generateStl } from "./generator";
import { convertIndentToNestedString } from "./preprocess";

export const _template2Stl = (template: string[]): string[] => {
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

export const template2Stl = (template: string): string[] => {
  if (template.trim() === "") {
    return [];
  }
  return _template2Stl(template.split(/\n\s*\n/));
};

export const _template2PStl = (template: string[]): string[] => {
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

export const template2PStl = (template: string): string[] => {
  return _template2PStl(template.split(/\n\s*\n/));
};
