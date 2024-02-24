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
  LANE_OFFSET = "LaneOffset", // x
  // 0.4.0+
  CLOSE_UP = "CloseUp", // A MovingActivity during which the subject traffic participant moves closer to the object traffic participant.
  MOVE_AWAY = "MoveAway", // A MovingActivity with moving traffic participants in which the subject traffic participant moves away from the object traffic participant.
  CROSS = "Cross", // A MovingActivity during which the path of the subject traffic participant crosses the path of the object traffic participant.
  CUT_IN = "CutIn", // A MovingActivity in which the subject traffic participant ends up directly in front of the object traffic participant. A cutting-in activity can affect the behavior of the object.
  CUT_OUT = "CutOut", // A MovingActivity where the subject and the object traffic participants start in the same lane. During the activity, the object traffic participant suddenly leaves the lane.
  FOLLOW_ROAD_USER = "FollowRoadUser", // An activity in which the subject traffic participant drives behind the object traffic participant at the same speed.
  PASS = "Pass", // An activity in which the subject traffic participant is located in a lane adjacent to the lane in which the object traffic participant drives. The subject starts behind the object and is position ahead of the object at the end of the activity. The subject does not change lanes.
  OVERTAKE = "Overtake", // An activity in which the subject traffic participant starts behind the object traffic participant and ends up in front of the object traffic participant. The subject changes lanes two time during the activity.
  STOP = "Stop", // An Activity that starts with the subject   traffic participant driving at a non-zero speed and ends with a speed of 0 for the subject.
  MOVE_BACKWARD = "MoveBackward", // An Activity with one traffic participant in which the traffic participant moves into the direction that is opposite to the original one without changing its orientation.
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

export type STOP_BEHAVIOR_PARAMS = {
  acceleration: [number, number];
};

export const defaultStopBehaviorParams: () => STOP_BEHAVIOR_PARAMS = () => ({
  acceleration: [0, 0],
});

export type CROSS_BEHAVIOR_PARAMS = {
  acceleration: [number, number];
  targetSpeed: [number, number];
  actorRef: string;
};

export const defaultCrossBehaviorParams: () => CROSS_BEHAVIOR_PARAMS = () => ({
  acceleration: [0, 0],
  targetSpeed: [0, 0],
  actorRef: "",
});

export type BEHAVIOR_PARAMS =
  | KEEP_BEHAVIOR_PARAMS
  | ACCELERATE_BEHAVIOR_PARAMS
  | CHANGE_BEHAVIOR_PARAMS
  | TURN_BEHAVIOR_PARAMS
  | LANE_OFFSET_BEHAVIOR_PARAMS
  | STOP_BEHAVIOR_PARAMS
  | CROSS_BEHAVIOR_PARAMS;

export const defaultBehaviorParams: (
  type: BEHAVIOR_TYPES
) => BEHAVIOR_PARAMS = (type) => {
  switch (type) {
    case BEHAVIOR_TYPES.KEEP:
    case BEHAVIOR_TYPES.IDLE:
    case BEHAVIOR_TYPES.FOLLOW_ROAD_USER:
      return defaultKeepBehaviorParams();
    case BEHAVIOR_TYPES.ACCELERATE:
    case BEHAVIOR_TYPES.DECELERATE:
      return defaultAccelerateBehaviorParams();
    case BEHAVIOR_TYPES.CHANGE_LEFT:
    case BEHAVIOR_TYPES.CHANGE_RIGHT:
    case BEHAVIOR_TYPES.CUT_IN:
    case BEHAVIOR_TYPES.CUT_OUT:
      return defaultChangeBehaviorParams();
    case BEHAVIOR_TYPES.TURN_LEFT:
    case BEHAVIOR_TYPES.TURN_RIGHT:
    case BEHAVIOR_TYPES.MOVE_BACKWARD:
      return defaultTurnBehaviorParams();
    case BEHAVIOR_TYPES.LANE_OFFSET:
      return defaultLaneOffsetBehaviorParams();
    case BEHAVIOR_TYPES.STOP:
      return defaultStopBehaviorParams();
    case BEHAVIOR_TYPES.OVERTAKE:
    case BEHAVIOR_TYPES.CLOSE_UP:
    case BEHAVIOR_TYPES.MOVE_AWAY:
    case BEHAVIOR_TYPES.CROSS:
    case BEHAVIOR_TYPES.PASS:
      return defaultCrossBehaviorParams();
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
