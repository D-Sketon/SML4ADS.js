export abstract class RoadRecord {
  start_pos: number | undefined;
  polynomial_coefficients: number[];
  
  constructor(polynomialCoefficients: number[], startPos?: number) {
    this.start_pos = startPos;
    this.polynomial_coefficients = [...polynomialCoefficients];
  }
}
