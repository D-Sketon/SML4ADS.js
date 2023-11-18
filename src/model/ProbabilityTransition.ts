import { Behavior } from "./Behavior";
import { BranchPoint } from "./BranchPoint";
import { MPosition, Position } from "./Position";

type BaseProbabilityTransition = {
  id: number;
  sourceId: number;
  targetId: number;
  weight: string;
}

export type MProbabilityTransition = BaseProbabilityTransition & {
  linkPoints: MPosition[];
  treeTextPosition: MPosition;
}

export type ProbabilityTransition = BaseProbabilityTransition & {
  linkPoints: Position[];
  treeTextPosition: Position;
} & {
  level: number;
  group: number;
  number: number;
  sourceBranchPoint: BranchPoint;
  targetBehavior: Behavior;
}