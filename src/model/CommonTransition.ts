import { Position } from "reactflow";
import { Behavior } from "./Behavior";
import { BranchPoint } from "./BranchPoint";
import { MPosition } from "./Position";

type BaseCommonTransition = {
  id: number;
  sourceId: number;
  targetId: number;
}

export type MCommonTransition = BaseCommonTransition & {
  linkPoints?: MPosition[];
  guard: string;
  treeTextPosition?: MPosition;
}

export type CommonTransition = BaseCommonTransition & {
  linkPoints?: Position[];
  guard: string[];
  treeTextPosition?: Position;
} & {
  level: number;
  group: number;
  number: number;
  sourceBehavior: Behavior;
  targetBehavior: Behavior;
  targetBranchPoint: BranchPoint;
}