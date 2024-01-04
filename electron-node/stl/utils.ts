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
  const parts = atom.split(/([<=>])/);
  return parts.filter((part) => part !== "");
};
