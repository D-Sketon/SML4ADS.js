import {
  ACCELERATE_BEHAVIOR_PARAMS,
  CHANGE_BEHAVIOR_PARAMS,
  KEEP_BEHAVIOR_PARAMS,
  LANE_OFFSET_BEHAVIOR_PARAMS,
  TURN_BEHAVIOR_PARAMS,
} from "../../../../../model/Behavior";
import {
  _assertNumber,
  _assertNumberGE,
  _assertRequired,
} from "../../../../../utils/assert";

export const checkKeepBehaviorParams = (
  params: KEEP_BEHAVIOR_PARAMS,
  name: string
) => {
  const { duration } = params;
  if (duration !== null && duration !== void 0 && (duration as any) !== "") {
    _assertNumberGE(duration, 0, `Behavior ${name} has negative duration!`);
  }
};

export const checkAccelerateBehaviorParams = (
  params: ACCELERATE_BEHAVIOR_PARAMS,
  name: string
) => {
  const { acceleration, targetSpeed, duration } = params;
  _assertRequired(acceleration, `Behavior ${name} has null acceleration!`);
  _assertNumberGE(
    acceleration,
    0,
    `Behavior ${name} has negative acceleration!`
  );

  _assertRequired(targetSpeed, `Behavior ${name} has null targetSpeed!`);
  _assertNumberGE(targetSpeed, 0, `Behavior ${name} has negative targetSpeed!`);

  if (duration !== null && duration !== void 0 && (duration as any) !== "") {
    _assertNumberGE(duration, 0, `Behavior ${name} has negative duration!`);
  }
};

export const checkTurnBehaviorParams = (
  params: TURN_BEHAVIOR_PARAMS,
  name: string
) => {
  const { acceleration, targetSpeed } = params;
  _assertRequired(acceleration, `Behavior ${name} has null acceleration!`);
  _assertNumber(acceleration, `Behavior ${name} has illegal acceleration!`);

  _assertRequired(targetSpeed, `Behavior ${name} has null targetSpeed!`);
  _assertNumberGE(targetSpeed, 0, `Behavior ${name} has negative targetSpeed!`);
};

export const checkChangeBehaviorParams = (
  params: CHANGE_BEHAVIOR_PARAMS,
  name: string
) => {
  const { acceleration, targetSpeed } = params;
  if (
    acceleration !== null &&
    acceleration !== void 0 &&
    (acceleration as any) !== ""
  ) {
    _assertNumber(acceleration, `Behavior ${name} has illegal acceleration!`);
  }
  if (
    targetSpeed !== null &&
    targetSpeed !== void 0 &&
    (targetSpeed as any) !== ""
  ) {
    _assertNumberGE(
      targetSpeed,
      0,
      `Behavior ${name} has negative targetSpeed!`
    );
  }
};

export const checkLaneOffsetBehaviorParams = (
  params: LANE_OFFSET_BEHAVIOR_PARAMS,
  name: string
) => {
  const { offset, acceleration, targetSpeed, duration } = params;
  _assertRequired(offset, `Behavior ${name} has null offset!`);
  _assertNumber(offset, `Behavior ${name} has illegal offset!`);

  if (
    acceleration !== null &&
    acceleration !== void 0 &&
    (acceleration as any) !== ""
  ) {
    _assertNumber(acceleration, `Behavior ${name} has illegal acceleration!`);
  }
  if (
    targetSpeed !== null &&
    targetSpeed !== void 0 &&
    (targetSpeed as any) !== ""
  ) {
    _assertNumberGE(
      targetSpeed,
      0,
      `Behavior ${name} has negative targetSpeed!`
    );
  }
  if (duration !== null && duration !== void 0 && (duration as any) !== "") {
    _assertNumberGE(duration, 0, `Behavior ${name} has negative duration!`);
  }
};
