// change from space to _
export const space2_ = (str: string) => {
  return str
    .split(" ")
    .filter((v) => v)
    .join("_");
};
