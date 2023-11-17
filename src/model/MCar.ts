import MTree from "./MTree";

interface MCar {
  name: string;
  model: string;
  maxSpeed: number;
  initSpeed: number;
  locationType: string;
  locationParams: Map<string, string>;
  heading: boolean;
  roadDeviation: number;
  treePath: string;
  mTree: MTree;
}

export default MCar;