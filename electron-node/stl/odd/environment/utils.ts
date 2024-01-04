export const mergeIntervals = (numArray: number[]): number[][] => {
  const result: number[][] = [];
  let currentInterval = [numArray[0]];

  for (let i = 1; i < numArray.length; i++) {
    if (numArray[i] === currentInterval[currentInterval.length - 1] + 1) {
      currentInterval.push(numArray[i]);
    } else {
      result.push([...currentInterval]);
      currentInterval = [numArray[i]];
    }
  }
  result.push([...currentInterval]);

  return result;
};
