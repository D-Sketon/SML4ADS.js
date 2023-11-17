import MPosition from "./MPosition";

interface MBehavior {
  id: number;
  position: MPosition;
  name: string;
  params: Map<string, string>;
  treeTextPosition: MPosition;
}

export default MBehavior;