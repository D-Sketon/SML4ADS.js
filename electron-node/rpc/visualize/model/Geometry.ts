import { EulerSpiral } from "./eulerspiral";

export abstract class Geometry {
  start_position: number[];
  length: number;
  heading: number;
  constructor(startPosition: number[], heading: number, length: number) {
    this.start_position = startPosition;
    this.length = length;
    this.heading = heading;
  }

  abstract calcPosition(sPos: number): [number[], number];
}

export class Line extends Geometry {
  calcPosition(sPos: number): [number[], number] {
    const pos = [
      this.start_position[0] + sPos * Math.cos(this.heading),
      this.start_position[1] + sPos * Math.sin(this.heading),
    ];
    const tangent = this.heading;

    return [pos, tangent];
  }
}

export class Arc extends Geometry {
  curvature: number;
  constructor(
    startPosition: number[],
    heading: number,
    length: number,
    curvature: number
  ) {
    super(startPosition, heading, length);
    this.curvature = curvature;
  }

  calcPosition(sPos: number): [number[], number] {
    const c = this.curvature;
    const hdg = this.heading - Math.PI / 2;

    const a = (2 / c) * Math.sin((sPos * c) / 2);
    const alpha = (Math.PI - sPos * c) / 2 - hdg;

    const dx = -1 * a * Math.cos(alpha);
    const dy = a * Math.sin(alpha);

    const pos = [this.start_position[0] + dx, this.start_position[1] + dy];

    const tangent = this.heading + sPos * this.curvature;

    return [pos, tangent];
  }
}

export class Spiral extends Geometry {
  curvStart: number;
  curvEnd: number;
  spiral: EulerSpiral;
  constructor(
    startPosition: number[],
    heading: number,
    length: number,
    curvStart: number,
    curvEnd: number
  ) {
    super(startPosition, heading, length);
    this.curvStart = curvStart;
    this.curvEnd = curvEnd;
    this.spiral = EulerSpiral.createFromLengthAndCurvature(
      this.length,
      this.curvStart,
      this.curvEnd
    );
  }

  calcPosition(sPos: number): [number[], number] {
    const [x, y, t] = this.spiral.calc(
      sPos,
      this.start_position[0],
      this.start_position[1],
      this.curvStart,
      this.heading
    );
    return [[x, y], t];
  }
}

export class Poly3 extends Geometry {
  a: number;
  b: number;
  c: number;
  d: number;
  constructor(
    startPosition: number[],
    heading: number,
    length: number,
    a: number,
    b: number,
    c: number,
    d: number
  ) {
    super(startPosition, heading, length);
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  calcPosition(sPos: number): [number[], number] {
    const coeffs: number[] = [this.a, this.b, this.c, this.d];

    const t: number = this.polyval(sPos, coeffs);

    // Rotate and translate
    const srot: number =
      sPos * Math.cos(this.heading) - t * Math.sin(this.heading);
    const trot: number =
      sPos * Math.sin(this.heading) + t * Math.cos(this.heading);

    // Derivate to get heading change
    const dCoeffs: number[] = coeffs
      .slice(1)
      .map((coeff, index) => coeff * (index + 1));
    const tangent: number = this.polyval(sPos, dCoeffs);

    return [
      [this.start_position[0] + srot, this.start_position[1] + trot],
      this.heading + tangent,
    ];
  }

  private polyval(x: number, coeffs: number[]): number {
    return coeffs.reduce(
      (accumulator, coeff, index) => accumulator + coeff * Math.pow(x, index),
      0
    );
  }
}

export class ParamPoly3 extends Geometry {
  aU: number;
  bU: number;
  cU: number;
  dU: number;
  aV: number;
  bV: number;
  cV: number;
  dV: number;
  pRange: number;
  constructor(
    startPosition: number[],
    heading: number,
    length: number,
    aU: number,
    bU: number,
    cU: number,
    dU: number,
    aV: number,
    bV: number,
    cV: number,
    dV: number,
    pRange = 1
  ) {
    super(startPosition, heading, length);
    this.aU = aU;
    this.bU = bU;
    this.cU = cU;
    this.dU = dU;
    this.aV = aV;
    this.bV = bV;
    this.cV = cV;
    this.dV = dV;
    this.pRange = pRange;
  }

  calcPosition(sPos: number): [number[], number] {
    sPos = (sPos / this.length) * this.pRange
    const coeffsU = [this.aU, this.bU, this.cU, this.dU];
    const coeffsV = [this.aV, this.bV, this.cV, this.dV];

    const u = this.polyval(sPos, coeffsU);
    const v = this.polyval(sPos, coeffsV);

    // Rotate and translate
    const srot =
      u * Math.cos(this.heading) - v * Math.sin(this.heading);
    const trot =
      u * Math.sin(this.heading) + v * Math.cos(this.heading);

    // Derivate to get heading change
    const dCoeffsU = coeffsU
      .slice(1)
      .map((coeff, index) => coeff * (index + 1));
    const dCoeffsV = coeffsV
      .slice(1)
      .map((coeff, index) => coeff * (index + 1));
    const tangent =
      Math.atan2(this.polyval(sPos, dCoeffsV), this.polyval(sPos, dCoeffsU) );

    return [
      [this.start_position[0] + srot, this.start_position[1] + trot],
      this.heading + tangent,
    ];
  }

  private polyval(x: number, coeffs: number[]): number {
    return coeffs.reduce(
      (accumulator, coeff, index) => accumulator + coeff * Math.pow(x, index),
      0
    );
  }
}
