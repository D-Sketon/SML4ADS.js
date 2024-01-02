export default class RangeValue {
  min: number;
  max: number;
  minRef: number;
  maxRef: number;
  unit: string;

  constructor(min: number, max: number, minRef = min, maxRef = max, unit = "") {
    this.min = min;
    this.max = max;
    this.minRef = minRef;
    this.maxRef = maxRef;
    this.unit = unit;
  }
}
