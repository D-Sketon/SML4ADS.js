import MPosition from "./MPosition";

interface MProbabilityTransition {
  id: number;
  sourceId: number;
  targetId: number;
  linkPoints: Array<MPosition>;
  weight: string;
  treeTextPosition: MPosition;
}

export default MProbabilityTransition;