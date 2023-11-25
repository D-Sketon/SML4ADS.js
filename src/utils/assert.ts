export const _assertRequired = (value: any, errMsg: string) => {
  if (value === null || value === void 0 || (value as any) === "") {
    throw new Error(errMsg);
  }
};

export const _assertNumber = (value: any, errMsg: string) => {
  if (isNaN(Number(value))) {
    throw new Error(errMsg);
  }
};

export const _assertNumberGE = (value: any, min: number, errMsg: string) => {
  _assertNumber(value, errMsg);
  if (Number(value) < min) {
    throw new Error(errMsg);
  }
};

export const _assertNumberLE = (value: any, max: number, errMsg: string) => {
  _assertNumber(value, errMsg);
  if (Number(value) > max) {
    throw new Error(errMsg);
  }
};
