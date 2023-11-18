import { MTree, Tree } from "./Tree";

type BaseCar = {
  id: number;
  name: string;
  model: string;
  maxSpeed: number;
  initSpeed: number;
  locationType: string;
  locationParams: Record<string, string>;
  heading: boolean;
  roadDeviation: number;
  treePath: string;
}

export type MCar = BaseCar & {
  mTree: MTree;
}

export type Car = BaseCar & {
  mTree: Tree;
} & {
  roadId: number;
  laneId: number;
  minOffset: number;
  maxOffset: number;
  minLateralOffset: number;
  maxLateralOffset: number;
  x: number;
  y: number;
  
  actorRef: string;

  laneSingleId: number;
  offset: number;
  laneSectionId: number;
  laneIndex: number;
  laneSectionIndex: number;
  roadIndex: number;
  width: number;
  length: number;
}