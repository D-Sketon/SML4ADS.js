import { BranchPoint } from "./BranchPoint";
import { CommonTransition } from "./CommonTransition";
import { MPosition, Position } from "./Position";

export enum BEHAVIOR_TYPES {
  ACCELERATE = "Accelerate",
  DECELERATE = "Decelerate",
  KEEP = "Keep",
  TURN_LEFT = "TurnLeft",
  TURN_RIGHT = "TurnRight",
  CHANGE_LEFT = "ChangeLeft",
  CHANGE_RIGHT = "ChangeRight",
  IDLE = "Idle",
  LANE_OFFSET = "laneOffset",
}

export type KEEP_BEHAVIOR_PARAMS = {
  duration: [number, number] | [null, null];
};

export const defaultKeepBehaviorParams: () => KEEP_BEHAVIOR_PARAMS = () => ({
  duration: [null, null],
});

export type ACCELERATE_BEHAVIOR_PARAMS = {
  acceleration: [number, number];
  targetSpeed: [number, number];
  duration: [number, number] | [null, null];
};

export const defaultAccelerateBehaviorParams: () => ACCELERATE_BEHAVIOR_PARAMS =
  () => ({
    acceleration: [0, 0],
    targetSpeed: [0, 0],
    duration: [null, null],
  });

export type CHANGE_BEHAVIOR_PARAMS = {
  acceleration: [number, number] | [null, null];
  targetSpeed: [number, number] | [null, null];
};

export const defaultChangeBehaviorParams: () => CHANGE_BEHAVIOR_PARAMS =
  () => ({
    acceleration: [null, null],
    targetSpeed: [null, null],
  });

export type TURN_BEHAVIOR_PARAMS = {
  acceleration: [number, number];
  targetSpeed: [number, number];
};

export const defaultTurnBehaviorParams: () => TURN_BEHAVIOR_PARAMS = () => ({
  acceleration: [0, 0],
  targetSpeed: [0, 0],
});

export type LANE_OFFSET_BEHAVIOR_PARAMS = {
  offset: [number, number];
  acceleration: [number, number] | [null, null];
  targetSpeed: [number, number] | [null, null];
  duration: [number, number] | [null, null];
};

export const defaultLaneOffsetBehaviorParams: () => LANE_OFFSET_BEHAVIOR_PARAMS =
  () => ({
    offset: [0, 0],
    acceleration: [null, null],
    targetSpeed: [null, null],
    duration: [null, null],
  });

export type BEHAVIOR_PARAMS =
  | KEEP_BEHAVIOR_PARAMS
  | ACCELERATE_BEHAVIOR_PARAMS
  | CHANGE_BEHAVIOR_PARAMS
  | TURN_BEHAVIOR_PARAMS
  | LANE_OFFSET_BEHAVIOR_PARAMS;

export const defaultBehaviorParams: (
  type: BEHAVIOR_TYPES
) => BEHAVIOR_PARAMS = (type) => {
  switch (type) {
    case BEHAVIOR_TYPES.KEEP:
      return defaultKeepBehaviorParams();
    case BEHAVIOR_TYPES.ACCELERATE:
    case BEHAVIOR_TYPES.DECELERATE:
      return defaultAccelerateBehaviorParams();
    case BEHAVIOR_TYPES.CHANGE_LEFT:
    case BEHAVIOR_TYPES.CHANGE_RIGHT:
      return defaultChangeBehaviorParams();
    case BEHAVIOR_TYPES.TURN_LEFT:
    case BEHAVIOR_TYPES.TURN_RIGHT:
      return defaultTurnBehaviorParams();
    case BEHAVIOR_TYPES.LANE_OFFSET:
      return defaultLaneOffsetBehaviorParams();
    default:
      return defaultKeepBehaviorParams();
  }
};

type BaseBehavior = {
  id: number;
  name: BEHAVIOR_TYPES;
  params: BEHAVIOR_PARAMS;
};

export type MBehavior = BaseBehavior & {
  position: MPosition;
  treeTextPosition?: MPosition;
};

export type Behavior = BaseBehavior & {
  position: Position;
  treeTextPosition?: Position;
} & {
  level: number;
  group: number;
  number: number;
  nextTransitions: CommonTransition[];
  nextBehaviors: Behavior[];
  nextBranchPoints: BranchPoint[];
};
