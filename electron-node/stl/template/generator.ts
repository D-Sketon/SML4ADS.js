import {
  Operator,
  FutureOperator,
  GloballyOperator,
  FinallyOperator,
  UntilOperator,
  AndOperator,
  OrOperator,
  Atom,
  ImplyOperator,
  NotOperator,
} from "./operator";

export const generateRange = (ast: FutureOperator): string => {
  let range = "";
  if (ast.from && ast.to) {
    range = `[${ast.from}:${ast.to}]`;
  } else if (ast.from) {
    range = `[${ast.from}:inf]`;
  } else if (ast.to) {
    range = `[0:${ast.to}]`;
  }
  return range;
};

export const generateStl = (ast: Operator): string => {
  let stl = "";
  if (ast instanceof GloballyOperator || ast instanceof FinallyOperator) {
    if (ast.not) {
      stl = `not(${ast.name}${generateRange(ast)} (${generateStl(
        ast.children
      )}))`;
    } else {
      stl = `${ast.name}${generateRange(ast)} (${generateStl(ast.children)})`;
    }
  } else if (ast instanceof UntilOperator) {
    if (ast.not) {
      stl = `not((${generateStl(ast.left)}) ${ast.name}${generateRange(
        ast
      )} (${generateStl(ast.right)}))`;
    } else {
      stl = `(${generateStl(ast.left)}) ${ast.name}${generateRange(
        ast
      )} (${generateStl(ast.right)})`;
    }
  } else if (ast instanceof AndOperator || ast instanceof OrOperator) {
    stl = `${generateStl(ast.left)} ${ast.name} ${generateStl(ast.right)}`;
  } else if (ast instanceof Atom) {
    stl = ast.name;
  } else if (ast instanceof ImplyOperator) {
    if (ast.not) {
      stl = `not((${generateStl(ast.left)}) ${ast.name} (${generateStl(
        ast.right
      )}))`;
    } else {
      stl = `(${generateStl(ast.left)}) ${ast.name} (${generateStl(ast.right)})`;
    }
  } else if (ast instanceof NotOperator) {
    stl = `${ast.name}(${generateStl(ast.children)})`;
  }
  return stl;
};
