import { CommonTransition } from "./CommonTransition";
import { MPosition, Position } from "./Position";

export enum BEHAVIOR_TYPES {
  ACCELERATE = 'Accelerate',
  DECELERATE = 'Decelerate',
  KEEP = 'Keep',
  TURN_LEFT = 'TurnLeft',
  TURN_RIGHT = 'TurnRight',
  CHANGE_LEFT = 'ChangeLeft',
  CHANGE_RIGHT = 'ChangeRight',
  IDLE = 'Idle',
  LANE_OFFSET = 'laneOffset',
  START = 'Start',
  END = 'End',
}

export type KEEP_BEHAVIOR_PARAMS = {
  duration?: number | null;
}

export const defaultKeepBehaviorParams: () => KEEP_BEHAVIOR_PARAMS = () => ({
  duration: null
});

export type ACCELERATE_BEHAVIOR_PARAMS = {
  acceleration: number;
  targetSpeed: number;
  duration?: number | null;
}

export const defaultAccelerateBehaviorParams: () => ACCELERATE_BEHAVIOR_PARAMS = () => ({
  acceleration: 0,
  targetSpeed: 0,
  duration: null,
});

export type CHANGE_BEHAVIOR_PARAMS = {
  acceleration?: number | null;
  targetSpeed?: number | null;
}

export const defaultChangeBehaviorParams: () => CHANGE_BEHAVIOR_PARAMS = () => ({
  acceleration: null,
  targetSpeed: null
});

export type TURN_BEHAVIOR_PARAMS = {
  acceleration: number;
  targetSpeed: number;
}

export const defaultTurnBehaviorParams: () => TURN_BEHAVIOR_PARAMS = () => ({
  acceleration: 0,
  targetSpeed: 0,
});

export type LANE_OFFSET_BEHAVIOR_PARAMS = {
  offset: number;
  acceleration?: number | null;
  targetSpeed?: number | null;
  duration?: number | null;
}

export const defaultLaneOffsetBehaviorParams: () => LANE_OFFSET_BEHAVIOR_PARAMS = () => ({
  offset: 0,
  acceleration: null,
  targetSpeed: null,
  duration: null,
});

export type BEHAVIOR_PARAMS =
  | KEEP_BEHAVIOR_PARAMS
  | ACCELERATE_BEHAVIOR_PARAMS
  | CHANGE_BEHAVIOR_PARAMS
  | TURN_BEHAVIOR_PARAMS
  | LANE_OFFSET_BEHAVIOR_PARAMS

type BaseBehavior = {
  id: number;
  name: string;
  params: BEHAVIOR_PARAMS;
}

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
  nextBranchPoints: Behavior[];
}