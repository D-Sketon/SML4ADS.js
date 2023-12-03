import { Behavior } from "./Behavior";
import { BranchPoint } from "./BranchPoint";
import { MPosition, Position } from "./Position";
import { WEIGHT_PARAMS, WEIGHT_TYPES } from "./params/ParamWeight";

type BaseProbabilityTransition = {
  id: number;
  sourceId: number;
  targetId: number;
  weight: {
    type: WEIGHT_TYPES;
    params: WEIGHT_PARAMS;
  };
};

export type MProbabilityTransition = BaseProbabilityTransition & {
  linkPoints?: MPosition[];
  treeTextPosition?: MPosition;
};

export type ProbabilityTransition = BaseProbabilityTransition & {
  linkPoints?: Position[];
  treeTextPosition?: Position;
} & {
  level: number;
  group: number;
  number: number;
  sourceBranchPoint: BranchPoint;
  targetBehavior: Behavior;
};
