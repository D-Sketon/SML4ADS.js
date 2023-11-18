import { MBehavior, Behavior } from "./Behavior";
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
  errMsg: string;
}

export type Tree = BaseTree & {
  behaviors: Behavior[];
  branchPoints: BranchPoint[];
  commonTransitions: CommonTransition[];
  probabilityTransitions: ProbabilityTransition[];
}