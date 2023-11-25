import { MTree } from "../../../../../model/Tree";
import {
  BEHAVIOR_TYPES,
  ACCELERATE_BEHAVIOR_PARAMS,
  TURN_BEHAVIOR_PARAMS,
  LANE_OFFSET_BEHAVIOR_PARAMS,
  KEEP_BEHAVIOR_PARAMS,
  CHANGE_BEHAVIOR_PARAMS,
} from "../../../../../model/Behavior";
import {
  checkAccelerateBehaviorParams,
  checkChangeBehaviorParams,
  checkKeepBehaviorParams,
  checkLaneOffsetBehaviorParams,
  checkTurnBehaviorParams,
} from "./checkBehaviorParams";

export const checkTree = (tree: MTree) => {
  for (const behavior of tree.behaviors) {
    if (behavior.params === null) {
      throw new Error(`Behavior ${behavior.name} has null params!`);
    }
    switch (behavior.name) {
      case BEHAVIOR_TYPES.KEEP:
      case BEHAVIOR_TYPES.IDLE: {
        const params = behavior.params as KEEP_BEHAVIOR_PARAMS;
        checkKeepBehaviorParams(params, behavior.name);
        break;
      }
      case BEHAVIOR_TYPES.ACCELERATE:
      case BEHAVIOR_TYPES.DECELERATE: {
        const params = behavior.params as ACCELERATE_BEHAVIOR_PARAMS;
        checkAccelerateBehaviorParams(params, behavior.name);
        break;
      }
      case BEHAVIOR_TYPES.TURN_LEFT:
      case BEHAVIOR_TYPES.TURN_RIGHT: {
        const params = behavior.params as TURN_BEHAVIOR_PARAMS;
        checkTurnBehaviorParams(params, behavior.name);
        break;
      }
      case BEHAVIOR_TYPES.CHANGE_LEFT:
      case BEHAVIOR_TYPES.CHANGE_RIGHT: {
        const params = behavior.params as CHANGE_BEHAVIOR_PARAMS;
        checkChangeBehaviorParams(params, behavior.name);
        break;
      }
      case BEHAVIOR_TYPES.LANE_OFFSET: {
        const params = behavior.params as LANE_OFFSET_BEHAVIOR_PARAMS;
        checkLaneOffsetBehaviorParams(params, behavior.name);
        break;
      }
      default:
    }
  }
};
