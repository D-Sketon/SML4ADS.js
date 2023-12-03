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
  _assertArrayLength,
} from "../../../../../utils/assert";

export const checkKeepBehaviorParams = (
  params: KEEP_BEHAVIOR_PARAMS,
  name: string
) => {
  const { duration } = params;
  _assertArrayLength(duration, 2, `Behavior ${name} has illegal duration!`);
  const [minDuration, maxDuration] = duration;
  if (minDuration === null && maxDuration === null) {
    return;
  }
  if (minDuration !== null && maxDuration !== null) {
    _assertNumberGE(minDuration, 0, `Behavior ${name} has negative duration!`);
    _assertNumberGE(maxDuration, 0, `Behavior ${name} has negative duration!`);
    _assertNumberGE(
      maxDuration,
      minDuration,
      `Behavior ${name} has illegal duration!`
    );
    return;
  }
  throw new Error(`Behavior ${name} has illegal duration!`);
};

export const checkAccelerateBehaviorParams = (
  params: ACCELERATE_BEHAVIOR_PARAMS,
  name: string
) => {
  const { acceleration, targetSpeed, duration } = params;
  _assertArrayLength(
    acceleration,
    2,
    `Behavior ${name} has illegal acceleration!`
  );
  const [minAcceleration, maxAcceleration] = acceleration;
  _assertRequired(minAcceleration, `Behavior ${name} has null acceleration!`);
  _assertNumber(minAcceleration, `Behavior ${name} has illegal acceleration!`);
  _assertRequired(maxAcceleration, `Behavior ${name} has null acceleration!`);
  _assertNumber(maxAcceleration, `Behavior ${name} has illegal acceleration!`);
  _assertNumberGE(
    maxAcceleration,
    minAcceleration,
    `Behavior ${name} has illegal acceleration!`
  );

  _assertArrayLength(
    targetSpeed,
    2,
    `Behavior ${name} has illegal targetSpeed!`
  );
  const [minTargetSpeed, maxTargetSpeed] = targetSpeed;
  _assertRequired(minTargetSpeed, `Behavior ${name} has null targetSpeed!`);
  _assertNumberGE(
    minTargetSpeed,
    0,
    `Behavior ${name} has negative targetSpeed!`
  );
  _assertRequired(maxTargetSpeed, `Behavior ${name} has null targetSpeed!`);
  _assertNumberGE(
    maxTargetSpeed,
    0,
    `Behavior ${name} has negative targetSpeed!`
  );
  _assertNumberGE(
    maxTargetSpeed,
    minTargetSpeed,
    `Behavior ${name} has illegal targetSpeed!`
  );

  _assertArrayLength(duration, 2, `Behavior ${name} has illegal duration!`);
  const [minDuration, maxDuration] = duration;
  if (minDuration === null && maxDuration === null) {
    return;
  }
  if (minDuration !== null && maxDuration !== null) {
    _assertNumberGE(minDuration, 0, `Behavior ${name} has negative duration!`);
    _assertNumberGE(maxDuration, 0, `Behavior ${name} has negative duration!`);
    _assertNumberGE(
      maxDuration,
      minDuration,
      `Behavior ${name} has illegal duration!`
    );
    return;
  }
  throw new Error(`Behavior ${name} has illegal duration!`);
};

export const checkTurnBehaviorParams = (
  params: TURN_BEHAVIOR_PARAMS,
  name: string
) => {
  const { acceleration, targetSpeed } = params;
  _assertArrayLength(
    acceleration,
    2,
    `Behavior ${name} has illegal acceleration!`
  );
  const [minAcceleration, maxAcceleration] = acceleration;
  _assertRequired(minAcceleration, `Behavior ${name} has null acceleration!`);
  _assertNumber(minAcceleration, `Behavior ${name} has illegal acceleration!`);
  _assertRequired(maxAcceleration, `Behavior ${name} has null acceleration!`);
  _assertNumber(maxAcceleration, `Behavior ${name} has illegal acceleration!`);
  _assertNumberGE(
    maxAcceleration,
    minAcceleration,
    `Behavior ${name} has illegal acceleration!`
  );

  _assertArrayLength(
    targetSpeed,
    2,
    `Behavior ${name} has illegal targetSpeed!`
  );
  const [minTargetSpeed, maxTargetSpeed] = targetSpeed;
  _assertRequired(minTargetSpeed, `Behavior ${name} has null targetSpeed!`);
  _assertNumberGE(
    minTargetSpeed,
    0,
    `Behavior ${name} has negative targetSpeed!`
  );
  _assertRequired(maxTargetSpeed, `Behavior ${name} has null targetSpeed!`);
  _assertNumberGE(
    maxTargetSpeed,
    0,
    `Behavior ${name} has negative targetSpeed!`
  );
  _assertNumberGE(
    maxTargetSpeed,
    minTargetSpeed,
    `Behavior ${name} has illegal targetSpeed!`
  );
};

export const checkChangeBehaviorParams = (
  params: CHANGE_BEHAVIOR_PARAMS,
  name: string
) => {
  const { acceleration, targetSpeed } = params;
  _assertArrayLength(
    acceleration,
    2,
    `Behavior ${name} has illegal acceleration!`
  );
  const [minAcceleration, maxAcceleration] = acceleration;
  if (minAcceleration !== null && maxAcceleration !== null) {
    _assertNumber(
      minAcceleration,
      `Behavior ${name} has illegal acceleration!`
    );
    _assertNumber(
      maxAcceleration,
      `Behavior ${name} has illegal acceleration!`
    );
    _assertNumberGE(
      maxAcceleration,
      minAcceleration,
      `Behavior ${name} has illegal acceleration!`
    );
  } else if (minAcceleration === null && maxAcceleration === null) {
    /** empty */
  } else {
    throw new Error(`Behavior ${name} has illegal acceleration!`);
  }

  _assertArrayLength(
    targetSpeed,
    2,
    `Behavior ${name} has illegal targetSpeed!`
  );
  const [minTargetSpeed, maxTargetSpeed] = targetSpeed;
  if (minTargetSpeed !== null && maxTargetSpeed !== null) {
    _assertNumberGE(
      minTargetSpeed,
      0,
      `Behavior ${name} has negative targetSpeed!`
    );
    _assertNumberGE(
      maxTargetSpeed,
      0,
      `Behavior ${name} has negative targetSpeed!`
    );
    _assertNumberGE(
      maxTargetSpeed,
      minTargetSpeed,
      `Behavior ${name} has illegal targetSpeed!`
    );
  } else if (minTargetSpeed === null && maxTargetSpeed === null) {
    /** empty */
  } else {
    throw new Error(`Behavior ${name} has illegal targetSpeed!`);
  }
};

export const checkLaneOffsetBehaviorParams = (
  params: LANE_OFFSET_BEHAVIOR_PARAMS,
  name: string
) => {
  const { offset, acceleration, targetSpeed, duration } = params;
  _assertArrayLength(offset, 2, `Behavior ${name} has illegal offset!`);
  const [minOffset, maxOffset] = offset;
  _assertRequired(minOffset, `Behavior ${name} has null offset!`);
  _assertNumber(minOffset, `Behavior ${name} has illegal offset!`);
  _assertRequired(maxOffset, `Behavior ${name} has null offset!`);
  _assertNumber(maxOffset, `Behavior ${name} has illegal offset!`);
  _assertNumberGE(maxOffset, minOffset, `Behavior ${name} has illegal offset!`);

  _assertArrayLength(
    acceleration,
    2,
    `Behavior ${name} has illegal acceleration!`
  );
  const [minAcceleration, maxAcceleration] = acceleration;
  if (minAcceleration !== null && maxAcceleration !== null) {
    _assertNumber(
      minAcceleration,
      `Behavior ${name} has illegal acceleration!`
    );
    _assertNumber(
      maxAcceleration,
      `Behavior ${name} has illegal acceleration!`
    );
    _assertNumberGE(
      maxAcceleration,
      minAcceleration,
      `Behavior ${name} has illegal acceleration!`
    );
  } else if (minAcceleration === null && maxAcceleration === null) {
    /** empty */
  } else {
    throw new Error(`Behavior ${name} has illegal acceleration!`);
  }

  _assertArrayLength(
    targetSpeed,
    2,
    `Behavior ${name} has illegal targetSpeed!`
  );
  const [minTargetSpeed, maxTargetSpeed] = targetSpeed;
  if (minTargetSpeed !== null && maxTargetSpeed !== null) {
    _assertNumberGE(
      minTargetSpeed,
      0,
      `Behavior ${name} has negative targetSpeed!`
    );
    _assertNumberGE(
      maxTargetSpeed,
      0,
      `Behavior ${name} has negative targetSpeed!`
    );
    _assertNumberGE(
      maxTargetSpeed,
      minTargetSpeed,
      `Behavior ${name} has illegal targetSpeed!`
    );
  } else if (minTargetSpeed === null && maxTargetSpeed === null) {
    /** empty */
  } else {
    throw new Error(`Behavior ${name} has illegal targetSpeed!`);
  }

  _assertArrayLength(duration, 2, `Behavior ${name} has illegal duration!`);
  const [minDuration, maxDuration] = duration;
  if (minDuration === null && maxDuration === null) {
    return;
  }
  if (minDuration !== null && maxDuration !== null) {
    _assertNumberGE(minDuration, 0, `Behavior ${name} has negative duration!`);
    _assertNumberGE(maxDuration, 0, `Behavior ${name} has negative duration!`);
    _assertNumberGE(
      maxDuration,
      minDuration,
      `Behavior ${name} has illegal duration!`
    );
    return;
  }
  throw new Error(`Behavior ${name} has illegal duration!`);
};
