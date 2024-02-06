import { generateAlphanumeric, isNumeric, splitAtom } from "../utils";
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
  Comment,
} from "./operator";

const getNextAlphanumeric = generateAlphanumeric();

const generateRange = (ast: FutureOperator): string => {
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

const generateParameterRange = (ast: FutureOperator): string => {
  let range = "";
  if (ast.from && ast.to) {
    range = `[${isNumeric(ast.from) ? getNextAlphanumeric() : ast.from}:${
      isNumeric(ast.to) ? getNextAlphanumeric() : ast.to
    }]`;
  } else if (ast.from) {
    range = `[${isNumeric(ast.from) ? getNextAlphanumeric() : ast.from}:inf]`;
  } else if (ast.to) {
    range = `[0:${isNumeric(ast.to) ? getNextAlphanumeric() : ast.to}]`;
  }
  return range;
};

export const generateStl = (ast: Operator): string => {
  if(ast instanceof Comment) {
    return ast.children;
  }
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
    stl = `(${generateStl(ast.left)}) ${ast.name} (${generateStl(ast.right)})`;
  } else if (ast instanceof Atom) {
    stl = ast.name;
  } else if (ast instanceof ImplyOperator) {
    if (ast.not) {
      stl = `not((${generateStl(ast.left)}) ${ast.name} (${generateStl(
        ast.right
      )}))`;
    } else {
      stl = `(${generateStl(ast.left)}) ${ast.name} (${generateStl(
        ast.right
      )})`;
    }
  } else if (ast instanceof NotOperator) {
    stl = `${ast.name}(${generateStl(ast.children)})`;
  }
  return stl;
};

export const generatePstl = (ast: Operator): string => {
  let stl = "";
  if (ast instanceof GloballyOperator || ast instanceof FinallyOperator) {
    if (ast.not) {
      stl = `not(${ast.name}${generateParameterRange(ast)} (${generatePstl(
        ast.children
      )}))`;
    } else {
      stl = `${ast.name}${generateParameterRange(ast)} (${generatePstl(
        ast.children
      )})`;
    }
  } else if (ast instanceof UntilOperator) {
    if (ast.not) {
      stl = `not((${generatePstl(ast.left)}) ${
        ast.name
      }${generateParameterRange(ast)} (${generatePstl(ast.right)}))`;
    } else {
      stl = `(${generatePstl(ast.left)}) ${ast.name}${generateParameterRange(
        ast
      )} (${generatePstl(ast.right)})`;
    }
  } else if (ast instanceof AndOperator || ast instanceof OrOperator) {
    stl = `(${generatePstl(ast.left)}) ${ast.name} (${generatePstl(
      ast.right
    )})`;
  } else if (ast instanceof Atom) {
    const splitAtoms = splitAtom(ast.name);
    if(isNumeric(splitAtoms[0])) {
      splitAtoms[0] = getNextAlphanumeric();
    }
    if(isNumeric(splitAtoms[2])) {
      splitAtoms[2] = getNextAlphanumeric();
    }
    stl = splitAtoms.join("");
  } else if (ast instanceof ImplyOperator) {
    if (ast.not) {
      stl = `not((${generatePstl(ast.left)}) ${ast.name} (${generatePstl(
        ast.right
      )}))`;
    } else {
      stl = `(${generatePstl(ast.left)}) ${ast.name} (${generatePstl(
        ast.right
      )})`;
    }
  } else if (ast instanceof NotOperator) {
    stl = `${ast.name}(${generatePstl(ast.children)})`;
  }
  return stl;
};
