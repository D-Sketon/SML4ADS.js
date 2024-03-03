import { normalizeAttribute, space2_ } from "../utils";
import {
  MultiDimensionalArray,
  Operator,
  Atom,
  AndOperator,
  OrOperator,
  NotOperator,
  GloballyOperator,
  FinallyOperator,
  ImplyOperator,
  ThenOperator,
  UntilOperator,
  FutureOperator,
  Comment,
} from "./operator";
import { TemplateToken } from "./token";

export const tokenize = (template: string): string[] => {
  let templatePost: string[] = [];
  if(template.startsWith("#")) {
    templatePost.push(template);
    return templatePost;
  }
  template = template.replace(/\s+/g, " ").trim();
  const tokens = Object.values(TemplateToken);
  let startPos = 0;
  let atom = "";
  while (startPos < template.length) {
    let findToken = false;
    for (const token of tokens) {
      if (template.startsWith(token, startPos)) {
        templatePost.push(space2_(normalizeAttribute(atom)));
        atom = "";
        templatePost.push(token);
        findToken = true;
        startPos += token.length + 1;
        break;
      }
    }
    if (!findToken) {
      atom += template[startPos++];
    }
  }
  if (atom) {
    templatePost.push(space2_(normalizeAttribute(atom)));
  }
  return templatePost.filter((t) => t);
};

export const generateAtomAst = (
  tokens: string[]
): MultiDimensionalArray<Operator> => {
  const operatorStack: MultiDimensionalArray<Operator> = [];
  let currentStackTokens: MultiDimensionalArray<Operator> = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if(token.startsWith("#")) {
      currentStackTokens.push(new Comment(token));
      continue;
    }
    switch (token) {
      case TemplateToken.LEFT_BRACKET:
        operatorStack.push(currentStackTokens);
        currentStackTokens = [];
        break;
      case TemplateToken.RIGHT_BRACKET:
        const parentArray =
          operatorStack.pop() as MultiDimensionalArray<Operator>;
        parentArray.push(currentStackTokens);
        currentStackTokens = parentArray;
        break;
      case TemplateToken.IS_EQUAL_TO:
        currentStackTokens.push(new Atom(`${tokens[i - 1]}==${tokens[i + 1]}`));
        break;
      case TemplateToken.IS_GREATER_THAN:
        currentStackTokens.push(new Atom(`${tokens[i - 1]}>${tokens[i + 1]}`));
        break;
      case TemplateToken.IS_LESS_THAN:
        currentStackTokens.push(new Atom(`${tokens[i - 1]}<${tokens[i + 1]}`));
        break;
      case TemplateToken.IS_NOT_EQUAL_TO:
        currentStackTokens.push(
          new Atom(`not(${tokens[i - 1]}==${tokens[i + 1]})`)
        );
        break;
      case TemplateToken.IS_NOT_GREATER_THAN:
        currentStackTokens.push(
          new Atom(`not(${tokens[i - 1]}>${tokens[i + 1]})`)
        );
        break;
      case TemplateToken.IS_NOT_LESS_THAN:
        currentStackTokens.push(
          new Atom(`not(${tokens[i - 1]}<${tokens[i + 1]})`)
        );
        break;
      case TemplateToken.AND:
        currentStackTokens.push(new AndOperator());
        break;
      case TemplateToken.OR:
        currentStackTokens.push(new OrOperator());
        break;
      case TemplateToken.NOT:
        const nextToken = tokens[i + 1];
        if (
          nextToken === TemplateToken.FINALLY ||
          nextToken === TemplateToken.ALWAYS ||
          nextToken === TemplateToken.EVENTUALLY ||
          nextToken === TemplateToken.GLOBALLY ||
          nextToken === TemplateToken.UNTIL ||
          nextToken === TemplateToken.IF
        ) {
          /** do nothing */
        } else {
          // NOT ( any )
          currentStackTokens.push(new NotOperator());
        }
        break;
      case TemplateToken.GLOBALLY:
      case TemplateToken.ALWAYS: {
        const prevToken = tokens[i - 1];
        currentStackTokens.push(
          new GloballyOperator(prevToken === TemplateToken.NOT)
        );
        break;
      }
      case TemplateToken.FINALLY:
      case TemplateToken.EVENTUALLY: {
        const prevToken = tokens[i - 1];
        currentStackTokens.push(
          new FinallyOperator(prevToken === TemplateToken.NOT)
        );
        break;
      }
      case TemplateToken.IF: {
        const prevToken = tokens[i - 1];
        currentStackTokens.push(
          new ImplyOperator(prevToken === TemplateToken.NOT)
        );
        break;
      }
      case TemplateToken.THEN:
        currentStackTokens.push(new ThenOperator());
        break;
      case TemplateToken.UNTIL: {
        const prevToken = tokens[i - 1];
        currentStackTokens.push(
          new UntilOperator(prevToken === TemplateToken.NOT)
        );
        break;
      }
      case TemplateToken.FROM:
        if (tokens[i + 2] !== TemplateToken.TO)
          throw new Error("Invalid input: from and to do not match");
        const top = currentStackTokens[
          currentStackTokens.length - 1
        ] as FutureOperator;
        top.from = tokens[i + 1];
        top.to = tokens[i + 3];
        break;
    }
  }
  return currentStackTokens;
};

const extractAtomAst = (tokens: Operator[]) => {
  // NOT
  tokens.forEach((token, i, tokens) => {
    if (token instanceof NotOperator && !token.children) {
      token.children = tokens[i + 1];
      tokens.splice(i + 1, 1);
    }
  });
  // GLOBALLY / FINALLY
  tokens.forEach((token, i, tokens) => {
    if (
      (token instanceof FinallyOperator || token instanceof GloballyOperator) &&
      !token.children
    ) {
      token.children = tokens[i + 1];
      tokens.splice(i + 1, 1);
    }
  });
  // AND / OR
  tokens.forEach((token, i, tokens) => {
    if (token instanceof AndOperator && !token.left && !token.right) {
      token.left = tokens[i - 1];
      token.right = tokens[i + 1];
      tokens.splice(i + 1, 1);
      tokens.splice(i - 1, 1);
      i--;
    }
  });
  tokens.forEach((token, i, tokens) => {
    if (token instanceof OrOperator && !token.left && !token.right) {
      token.left = tokens[i - 1];
      token.right = tokens[i + 1];
      tokens.splice(i + 1, 1);
      tokens.splice(i - 1, 1);
      i--;
    }
  });
  // IMPLY
  tokens.forEach((token, i, tokens) => {
    if (
      token instanceof ImplyOperator &&
      tokens[i + 2] instanceof ThenOperator &&
      !token.left &&
      !token.right
    ) {
      token.left = tokens[i + 1];
      token.right = tokens[i + 3];
      tokens.splice(i + 1, 3);
    }
  });
  // UNTIL
  tokens.forEach((token, i, tokens) => {
    if (token instanceof UntilOperator && !token.left && !token.right) {
      token.left = tokens[i - 1];
      token.right = tokens[i + 1];
      tokens.splice(i + 1, 1);
      tokens.splice(i - 1, 1);
      i--;
    }
  });
};

export const generateAst = (
  tokens: MultiDimensionalArray<Operator>
): Operator[] => {
  let globalFlag = false;
  const flattenNestedArray = (
    parentArray: MultiDimensionalArray<Operator>,
    nestedArray: MultiDimensionalArray<Operator>
  ) => {
    let flag = false;
    for (const a of nestedArray) {
      if (Array.isArray(a)) {
        flag = true;
        flattenNestedArray(nestedArray, a);
      }
    }
    if (!flag) {
      extractAtomAst(nestedArray as Operator[]);
      globalFlag = true;
      const index = parentArray.findIndex((n) => nestedArray === n);
      if (index === -1) {
        globalFlag = false;
      }
      parentArray.splice(index, 1, ...nestedArray);
    }
  };
  do {
    globalFlag = false;
    flattenNestedArray([], tokens);
  } while (globalFlag);
  return tokens as Operator[];
};
