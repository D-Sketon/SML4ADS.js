import { CommonTransition } from "./CommonTransition";
import { MPosition, Position } from "./Position";

type BaseBehavior = {
  id: number;
  name: string;
  params: Record<string, string>;
}

export type MBehavior = BaseBehavior & {
  position: MPosition;
  treeTextPosition: MPosition;
};

export type Behavior = BaseBehavior & {
  position: Position;
  treeTextPosition: Position;
} & {
  level: number;
  group: number;
  number: number;
  nextTransitions: CommonTransition[];
  nextBehaviors: Behavior[];
  nextBranchPoints: Behavior[];
}