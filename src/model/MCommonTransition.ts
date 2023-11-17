import MPosition from "./MPosition";

interface MCommonTransition {
  id: number;
  sourceId: number;
  targetId: number;
  linkPoints: Array<MPosition>;
  guard: string;
  treeTextPosition: MPosition;
}

export default MCommonTransition;