import { MBehavior, Behavior, BEHAVIOR_TYPES } from "./Behavior";
import { MBranchPoint, BranchPoint } from "./BranchPoint";
import { MCommonTransition, CommonTransition } from "./CommonTransition";
import { MProbabilityTransition, ProbabilityTransition } from "./ProbabilityTransition";

type BaseTree = {
  rootId: number;
}
export type MTree = BaseTree & {
  behaviors: MBehavior[];
  branchPoints: MBranchPoint[];
  commonTransitions: MCommonTransition[];
  probabilityTransitions: MProbabilityTransition[];
  errMsg?: string;
}

export type Tree = BaseTree & {
  behaviors: Behavior[];
  branchPoints: BranchPoint[];
  commonTransitions: CommonTransition[];
  probabilityTransitions: ProbabilityTransition[];
}

export const defaultTree: () => MTree = () => ({
  rootId: 0,
  behaviors: [{
    id: 0,
    name: BEHAVIOR_TYPES.KEEP,
    params: {
      duration: 10,
    },
    position: {
      x: 200,
      y: 200,
    }
  }],
  branchPoints: [],
  commonTransitions: [],
  probabilityTransitions: [],
});