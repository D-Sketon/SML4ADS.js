import { Position } from "reactflow";
import { Behavior } from "./Behavior";
import { MPosition } from "./Position";
import { ProbabilityTransition } from "./ProbabilityTransition";

type BaseBranchPoint = {
  id: number;
}

export type MBranchPoint = BaseBranchPoint & {
  position: MPosition;
}

export type BranchPoint = BaseBranchPoint & {
  position: Position;
} & {
  level: number;
  group: number;
  number: number;
  nextTransitions: ProbabilityTransition[];
  nextBehaviors: Behavior[];
}