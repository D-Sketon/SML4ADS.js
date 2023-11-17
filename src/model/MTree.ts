import MBehavior from "./MBehavior";
import MBranchPoint from "./MBranchPoint";
import MCommonTransition from "./MCommonTransition";
import MProbabilityTransition from "./MProbabilityTransition";

interface MTree {
  rootId: number;
  behaviors: MBehavior[];
  branchPoints: MBranchPoint[];
  commonTransitions: MCommonTransition[];
  probabilityTransitions: MProbabilityTransition[];
  errMsg: string;
}

export default MTree;