export default class RangeValue {
  min: number | string;
  max: number | string;
  minRef: number | string;
  maxRef: number | string;
  unit: string;

  constructor(min: number | string, max: number | string, minRef = min, maxRef = max, unit = "") {
    this.min = min;
    this.max = max;
    this.minRef = minRef;
    this.maxRef = maxRef;
    this.unit = unit;
  }
}
