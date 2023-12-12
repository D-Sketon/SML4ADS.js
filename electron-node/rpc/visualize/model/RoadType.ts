export class RoadType {
  startPos: string;
  useType: string;
  speed: Speed;
  constructor(sPos: string, useType: string, speed: Speed) {
    this.startPos = sPos;
    this.useType = useType;
    this.speed = speed;
  }
}

export class Speed {
  max: string | number;
  unit: string;
  constructor(max: string | number, unit: string) {
    this.max = max;
    this.unit = unit;
  }
}
