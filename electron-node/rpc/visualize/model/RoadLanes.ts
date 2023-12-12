import { Road } from "./Road";
import { RoadRecord } from "./RoadRecord";

export class Lanes {
  private _laneOffsets: LaneOffset[] = [];
  private _laneSections: LaneSection[] = [];

  get laneOffsets() {
    return this._laneOffsets.sort((a, b) => a.start_pos! - b.start_pos!);
  }

  set laneOffsets(laneOffsets: LaneOffset[]) {
    this._laneOffsets = laneOffsets;
  }

  get lane_sections() {
    return this._laneSections.sort((a, b) => a.sPos - b.sPos);
  }

  set lane_sections(laneSections: LaneSection[]) {
    this._laneSections = laneSections;
  }

  getLaneSection(laneSectionIdx: number) {
    return this.lane_sections.find(
      (laneSection) => laneSection.idx === laneSectionIdx
    );
  }

  getLastLaneSectionIdx() {
    const numLaneSections = this.lane_sections.length;
    if (numLaneSections > 1) {
      return numLaneSections - 1;
    }
    return 0;
  }
}

export class LaneOffset extends RoadRecord {}

export class LeftLanes {
  sortDirection: boolean = false;
  private _lanes: Lane[] = [];

  get lanes(): Lane[] {
    return this._lanes.sort((a, b) => {
      if (this.sortDirection) {
        return b.id - a.id;
      }
      return a.id - b.id;
    });
  }

  set lanes(lanes: Lane[]) {
    this._lanes = lanes;
  }
}

export class CenterLanes extends LeftLanes {}

export class RightLanes extends LeftLanes {
  sortDirection = true;
}

export enum LaneType {
  NONE = "none",
  DRIVING = "driving",
  STOP = "stop",
  SHOULDER = "shoulder",
  BIKING = "biking",
  SIDEWALK = "sidewalk",
  BORDER = "border",
  RESTRICTED = "restricted",
  PARKING = "parking",
  BIDIRECTIONAL = "bidirectional",
  MEDIAN = "median",
  SPECIAL1 = "special1",
  SPECIAL2 = "special2",
  SPECIAL3 = "special3",
  ROADWORKS = "roadWorks",
  TRAM = "tram",
  RAIL = "rail",
  ENTRY = "entry",
  EXIT = "exit",
  OFFRAMP = "offRamp",
  ONRAMP = "onRamp",
}

export class Lane {
  parentRoad: Road;
  id: number;
  type: LaneType;
  level: boolean;
  link: LaneLink = new LaneLink();
  widths: LaneWidth[] = [];
  borders: LaneBorder[] = [];
  laneSection: LaneSection;
  hasBorderRecord = false;

  constructor(parentRoad: Road, laneSection: LaneSection) {
    this.parentRoad = parentRoad;
    this.laneSection = laneSection;
  }

  getSortedWidths() {
    return this.widths.sort((a, b) => a.start_pos! - b.start_pos!);
  }

  getWidth(widthIndex: number) {
    return this.widths.find((width) => width.idx === widthIndex);
  }

  getLastLaneWidthIdx() {
    const numWidths = this.widths.length;
    if (numWidths > 1) {
      return numWidths - 1;
    }
    return 0;
  }
}

export class LaneLink {
  predecessorId: number;
  successorId: number;
}

export class LaneSection {
  idx: number;
  sPos: number;
  singleSide: boolean;
  length: number;
  private _leftLanes = new LeftLanes();
  private _centerLanes = new CenterLanes();
  private _rightLanes = new RightLanes();
  parentRoad: Road;

  constructor(road: Road) {
    this.parentRoad = road;
  }

  get leftLanes() {
    return this._leftLanes.lanes;
  }

  get centerLanes() {
    return this._centerLanes.lanes;
  }

  get rightLanes() {
    return this._rightLanes.lanes;
  }

  get allLanes() {
    return [...this.leftLanes, ...this.centerLanes, ...this.rightLanes];
  }

  getLane(laneId: number) {
    return this.allLanes.find((lane) => lane.id === laneId);
  }
}

export class LaneWidth extends RoadRecord {
  idx: number | undefined;
  length = 0;
  constructor(
    polynomialCoefficients: number[],
    idx?: number,
    startOffset?: number
  ) {
    super(polynomialCoefficients, startOffset);
    this.idx = idx;
  }

  get start_offset() {
    return this.start_pos!;
  }

  set start_offset(value: number) {
    this.start_pos = value;
  }
}

export class LaneBorder extends LaneWidth {}
