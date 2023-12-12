import { RoadRecord } from "./RoadRecord";

export class LateralProfile {
  superelevations: Superelevation[] = [];
  crossfalls: Crossfall[] = [];
  shapes: Shape[] = [];
}

export class Superelevation extends RoadRecord {}

export class Crossfall extends RoadRecord {
  side: string | undefined;
  constructor(
    polynomialCoefficients: number[],
    startPos?: number,
    side?: "left" | "right" | "both"
  ) {
    super(polynomialCoefficients, startPos);
    this.side = side;
  }
}

export class Shape extends RoadRecord {
  start_pos_t: number | undefined;
  constructor(
    polynomialCoefficients: number[],
    startPos?: number,
    startPosT?: number
  ) {
    super(polynomialCoefficients, startPos);
    this.start_pos_t = startPosT;
  }
}
