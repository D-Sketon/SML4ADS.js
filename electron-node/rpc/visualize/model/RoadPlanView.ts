import { Arc, Geometry, Line, ParamPoly3, Poly3, Spiral } from "./Geometry";

export class PlanView {
  _geometries: Geometry[];
  _precalculation: number[][];
  should_precalculate: number;
  _geo_lengths: number[];
  cache_time: number;
  normal_time: number;
  constructor() {
    this._geometries = [];
    this.should_precalculate = 0;
    this._geo_lengths = [0];
    this.cache_time = 0;
    this.normal_time = 0;
  }

  _addGeometry(geometry: Geometry, shouldPrecalculate: boolean) {
    this._geometries.push(geometry);
    if (shouldPrecalculate) {
      this.should_precalculate += 1;
    } else {
      this.should_precalculate -= 1;
    }
    this._addGeoLength(geometry.length);
  }

  _addGeoLength(length: number) {
    this._geo_lengths.push(
      length + this._geo_lengths[this._geo_lengths.length - 1]
    );
  }

  addLine(startPos: number[], heading: number, length: number) {
    this._addGeometry(new Line(startPos, heading, length), false);
  }

  addSpiral(
    startPos: number[],
    heading: number,
    length: number,
    curvStart: number,
    curvEnd: number
  ) {
    this._addGeometry(
      new Spiral(startPos, heading, length, curvStart, curvEnd),
      true
    );
  }

  addArc(startPos: number[], heading: number, length: number, curvature: number) {
    this._addGeometry(new Arc(startPos, heading, length, curvature), true);
  }

  addParamPoly3(
    startPos: number[],
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
    pRange?: number
  ) {
    this._addGeometry(
      new ParamPoly3(
        startPos,
        heading,
        length,
        aU,
        bU,
        cU,
        dU,
        aV,
        bV,
        cV,
        dV,
        pRange
      ),
      true
    );
  }

  addPoly3(
    startPos: number[],
    heading: number,
    length: number,
    a: number,
    b: number,
    c: number,
    d: number
  ) {
    this._addGeometry(new Poly3(startPos, heading, length, a, b, c, d), true);
  }

  get length() {
    return this._geo_lengths[this._geo_lengths.length - 1];
  }

  calc(sPos: number): [number[], number] {
    if (this._precalculation) {
      return this.interpolateCachedValues(sPos);
    }
    return this.calcGeometry(sPos);
  }

  interpolateCachedValues(sPos: number): [number[], number] {
    let idx = -1;
    let minDistance = Infinity;
    for (let i = 0; i < this._precalculation!.length; i++) {
      const currentDistance = Math.abs(this._precalculation![i][0] - sPos);

      if (currentDistance < minDistance) {
        minDistance = currentDistance;
        idx = i;
      }
    }

    if (
      sPos - this._precalculation![idx][0] < 0 ||
      idx + 1 === this._precalculation!.length
    ) {
      idx -= 1;
    }

    function interpolate(
      x: number,
      x0: number,
      y0: number,
      x1: number,
      y1: number
    ) {
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }

    const resultPosX = interpolate(
      sPos,
      this._precalculation![idx][0],
      this._precalculation![idx][1],
      this._precalculation![idx + 1][0],
      this._precalculation![idx + 1][1]
    );

    const resultPosY = interpolate(
      sPos,
      this._precalculation![idx][0],
      this._precalculation![idx][2],
      this._precalculation![idx + 1][0],
      this._precalculation![idx + 1][2]
    );

    const resultTang = this.interpolateAngle(idx, sPos);

    const resultPos = [resultPosX, resultPosY];

    return [resultPos, resultTang];
  }

  interpolateAngle(idx: number, sPos: number): number {
    const anglePrev = this._precalculation![idx][3];
    const angleNext = this._precalculation![idx + 1][3];
    const posPrev = this._precalculation![idx][0];
    const posNext = this._precalculation![idx + 1][0];

    const shortest_angle =
      ((angleNext - anglePrev + Math.PI) % (2 * Math.PI)) - Math.PI;
    return (
      anglePrev + (shortest_angle * (sPos - posPrev)) / (posNext - posPrev)
    );
  }

  calcGeometry(sPos: number): [number[], number] {
    try {
      const mask = this._geo_lengths.map((length) => length > sPos);
      const subIdxArray = this._geo_lengths
        .filter((length, index) => mask[index])
        .map((length, index) => length - sPos);

      const subIdx = subIdxArray.indexOf(Math.min(...subIdxArray));
      var geoIdx = mask.indexOf(true, subIdx) - 1;
    } catch (error) {
      if (
        Math.abs(sPos - this._geo_lengths[this._geo_lengths.length - 1]) <
        Number.EPSILON
      ) {
        geoIdx = this._geo_lengths.length - 2;
      } else {
        throw new Error(
          `Tried to calculate a position outside of the borders of the reference path at s=${sPos}, but path has only length of l=${
            this._geo_lengths[this._geo_lengths.length - 1]
          }`
        );
      }
    }
    return this._geometries[geoIdx].calcPosition(
      sPos - this._geo_lengths[geoIdx]
    );
  }

  precalculate(precision = 0.5): void {
    if (this.should_precalculate < 1) {
      return;
    }

    const numSteps = Math.max(2, Math.ceil(this.length / precision));
    const positions = Array.from(
      { length: numSteps },
      (_, i) => (i / (numSteps - 1)) * this.length
    );
    this._precalculation = new Array(numSteps);

    for (let i = 0; i < numSteps; i++) {
      const pos = positions[i];
      const [coord, tang] = this.calcGeometry(pos);

      this._precalculation[i] = [pos, coord[0], coord[1], tang];
    }
  }
}
