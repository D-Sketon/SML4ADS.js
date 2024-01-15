// change from space to _
export const space2_ = (str: string) => {
  return str
    .split(" ")
    .filter((v) => v)
    .join("_");
};

export const isNumeric = (str: string): boolean => {
  return !isNaN(Number(str));
};

export const generateAlphanumeric = (): (() => string) => {
  let currentCharCode = 97;
  let currentNumber = 0;

  return (): string => {
    const currentLetter = String.fromCharCode(currentCharCode);
    let result = currentLetter;

    if (currentNumber > 0) {
      result += "_" + String.fromCharCode(97 + currentNumber);
    }
    currentCharCode++;
    if (currentCharCode > 122) {
      currentCharCode = 97;
      currentNumber++;
    }
    if (currentNumber >= 26) {
      currentNumber = 0;
    }
    return result;
  };
};

export const splitAtom = (atom: string) => {
  const parts = atom.split(/(<=|>=|==|<|>)/);
  return parts.filter((part) => part !== "");
};

export const normalizeAttribute = (atom: string) => {
  if (atom.includes("of")) {
    const parts = atom.split(" of ");
    return (
      normalizeAttribute(parts[0]) +
      "_" +
      normalizeAttribute(parts.slice(1).join(" "))
    );
  }
  if (atom.includes("between")) {
    // between ... and ...
    const parts = atom.split(" between ");
    const parts2 = parts[1].split(" and ");
    return (
      normalizeAttribute(parts[0]) +
      "_" +
      normalizeAttribute(parts2[0]) +
      "-" +
      normalizeAttribute(parts2[1])
    );
  }
  return atom;
};
