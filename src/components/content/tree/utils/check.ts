import { MTree } from "../../../../model/Tree";
import {
  BEHAVIOR_TYPES,
  ACCELERATE_BEHAVIOR_PARAMS,
  TURN_BEHAVIOR_PARAMS,
  LANE_OFFSET_BEHAVIOR_PARAMS,
  KEEP_BEHAVIOR_PARAMS,
  CHANGE_BEHAVIOR_PARAMS
} from "../../../../model/Behavior";

export const checkTree = (tree: MTree) => {
  for (const behavior of tree.behaviors) {
    if (behavior.params === null) {
      throw new Error(`Behavior ${behavior.name} has null params!`);
    }
    switch (behavior.name) {
      case BEHAVIOR_TYPES.KEEP:
      case BEHAVIOR_TYPES.IDLE: {
        const params = behavior.params as KEEP_BEHAVIOR_PARAMS;
        const { duration } = params;
        if (duration !== null && duration !== void 0 && (duration as any) !== '') {
          _assertNumberGE(duration, 0, `Behavior ${behavior.name} has negative duration!`);
        }
        break;
      }
      case BEHAVIOR_TYPES.ACCELERATE:
      case BEHAVIOR_TYPES.DECELERATE: {
        const params = behavior.params as ACCELERATE_BEHAVIOR_PARAMS;
        const { acceleration, targetSpeed, duration } = params;
        _assertRequired(acceleration, `Behavior ${behavior.name} has null acceleration!`);
        _assertNumberGE(acceleration, 0, `Behavior ${behavior.name} has negative acceleration!`);

        _assertRequired(targetSpeed, `Behavior ${behavior.name} has null targetSpeed!`);
        _assertNumberGE(targetSpeed, 0, `Behavior ${behavior.name} has negative targetSpeed!`);

        if (duration !== null && duration !== void 0 && (duration as any) !== '') {
          _assertNumberGE(duration, 0, `Behavior ${behavior.name} has negative duration!`);
        }
        break;
      }
      case BEHAVIOR_TYPES.TURN_LEFT:
      case BEHAVIOR_TYPES.TURN_RIGHT: {
        const params = behavior.params as TURN_BEHAVIOR_PARAMS;
        const { acceleration, targetSpeed } = params;
        _assertRequired(acceleration, `Behavior ${behavior.name} has null acceleration!`);
        _assertNumber(acceleration, `Behavior ${behavior.name} has illegal acceleration!`);

        _assertRequired(targetSpeed, `Behavior ${behavior.name} has null targetSpeed!`);
        _assertNumberGE(targetSpeed, 0, `Behavior ${behavior.name} has negative targetSpeed!`);
        break;
      }
      case BEHAVIOR_TYPES.CHANGE_LEFT:
      case BEHAVIOR_TYPES.CHANGE_RIGHT: {
        const params = behavior.params as CHANGE_BEHAVIOR_PARAMS;
        const { acceleration, targetSpeed } = params;
        if (acceleration !== null && acceleration !== void 0 && (acceleration as any) !== '') {
          _assertNumber(acceleration, `Behavior ${behavior.name} has illegal acceleration!`);
        }
        if (targetSpeed !== null && targetSpeed !== void 0 && (targetSpeed as any) !== '') {
          _assertNumberGE(targetSpeed, 0, `Behavior ${behavior.name} has negative targetSpeed!`);
        }
        break;
      }
      case BEHAVIOR_TYPES.LANE_OFFSET: {
        const params = behavior.params as LANE_OFFSET_BEHAVIOR_PARAMS;
        const { offset, acceleration, targetSpeed, duration } = params;
        _assertRequired(offset, `Behavior ${behavior.name} has null offset!`);
        _assertNumber(offset, `Behavior ${behavior.name} has illegal offset!`);

        if (acceleration !== null && acceleration !== void 0 && (acceleration as any) !== '') {
          _assertNumber(acceleration, `Behavior ${behavior.name} has illegal acceleration!`);
        }
        if (targetSpeed !== null && targetSpeed !== void 0 && (targetSpeed as any) !== '') {
          _assertNumberGE(targetSpeed, 0, `Behavior ${behavior.name} has negative targetSpeed!`);
        }
        if (duration !== null && duration !== void 0 && (duration as any) !== '') {
          _assertNumberGE(duration, 0, `Behavior ${behavior.name} has negative duration!`);
        }
        break;
      }
      default:
    }
  }
};

const _assertRequired = (value: any, errMsg: string) => {
  if (value === null || value === void 0 || (value as any) === '') {
    throw new Error(errMsg);
  }
}

const _assertNumber = (value: any, errMsg: string) => {
  if (isNaN(Number(value))) {
    throw new Error(errMsg);
  }
}

const _assertNumberGE = (value: any, min: number, errMsg: string) => {
  _assertNumber(value, errMsg);
  if (Number(value) < min) {
    throw new Error(errMsg);
  }
}