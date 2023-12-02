import {
  LOCATION_TYPES,
  LOCATION_PARAMS,
  GLOBAL_POSITION_PARAMS,
  LANE_POSITION_PARAMS,
  ROAD_POSITION_PARAMS,
  RELATED_POSITION_PARAMS,
} from "../../../../../model/params/ParamLocation";
import {
  _assertRequired,
  _assertNumber,
  _assertArrayLength,
  _assertNumberGE,
} from "../../../../../utils/assert";

export const checkLocationParams = (
  locationType: LOCATION_TYPES,
  locationParams: LOCATION_PARAMS
) => {
  switch (locationType) {
    case LOCATION_TYPES.GLOBAL_POSITION:
      checkGlobalPositionParams(locationParams as GLOBAL_POSITION_PARAMS);
      break;
    case LOCATION_TYPES.LANE_POSITION:
      checkLanePositionParams(locationParams as LANE_POSITION_PARAMS);
      break;
    case LOCATION_TYPES.ROAD_POSITION:
      checkRoadPositionParams(locationParams as ROAD_POSITION_PARAMS);
      break;
    case LOCATION_TYPES.RELATED_POSITION:
      checkRelatedPositionParams(locationParams as RELATED_POSITION_PARAMS);
      break;
    default:
      throw new Error("Invalid location type");
  }
};

const checkGlobalPositionParams = (locationParams: GLOBAL_POSITION_PARAMS) => {
  const { x, y } = locationParams;

  _assertArrayLength(x, 2, "x should have length of 2");
  for (const xi of x) {
    _assertRequired(xi, "x is required");
    _assertNumber(xi, "x should be number");
  }
  _assertNumberGE(x[1], x[0], "x[1] should >= x[0]");

  _assertArrayLength(y, 2, "y should have length of 2");
  for (const yi of y) {
    _assertRequired(yi, "y is required");
    _assertNumber(yi, "y should be number");
  }
  _assertNumberGE(y[1], y[0], "y[1] should >= y[0]");
};

const checkLanePositionParams = (locationParams: LANE_POSITION_PARAMS) => {
  const { roadId, laneId, lateralOffset, longitudinalOffset } = locationParams;

  _assertRequired(roadId, "roadId is required");
  _assertNumber(roadId, "roadId should be number");

  _assertRequired(laneId, "laneId is required");
  _assertNumber(laneId, "laneId should be number");

  _assertArrayLength(lateralOffset, 2, "lateralOffset should have length of 2");
  for (const lo of lateralOffset) {
    _assertRequired(lo, "lateralOffset is required");
    _assertNumber(lo, "lateralOffset should be number");
  }
  _assertNumberGE(
    lateralOffset[1],
    lateralOffset[0],
    "lateralOffset[1] should >= lateralOffset[0]"
  );

  _assertArrayLength(
    longitudinalOffset,
    2,
    "longitudinalOffset should have length of 2"
  );
  for (const lo of longitudinalOffset) {
    _assertRequired(lo, "longitudinalOffset is required");
    _assertNumber(lo, "longitudinalOffset should be number");
  }
  _assertNumberGE(
    longitudinalOffset[1],
    longitudinalOffset[0],
    "longitudinalOffset[1] should >= longitudinalOffset[0]"
  );
};

const checkRoadPositionParams = (locationParams: ROAD_POSITION_PARAMS) => {
  const { roadId, lateralOffset, longitudinalOffset } = locationParams;

  _assertRequired(roadId, "roadId is required");
  _assertNumber(roadId, "roadId should be number");

  _assertArrayLength(lateralOffset, 2, "lateralOffset should have length of 2");
  for (const lo of lateralOffset) {
    _assertRequired(lo, "lateralOffset is required");
    _assertNumber(lo, "lateralOffset should be number");
  }
  _assertNumberGE(
    lateralOffset[1],
    lateralOffset[0],
    "lateralOffset[1] should >= lateralOffset[0]"
  );

  _assertArrayLength(
    longitudinalOffset,
    2,
    "longitudinalOffset should have length of 2"
  );
  for (const lo of longitudinalOffset) {
    _assertRequired(lo, "longitudinalOffset is required");
    _assertNumber(lo, "longitudinalOffset should be number");
  }
  _assertNumberGE(
    longitudinalOffset[1],
    longitudinalOffset[0],
    "longitudinalOffset[1] should >= longitudinalOffset[0]"
  );
};

const checkRelatedPositionParams = (
  locationParams: RELATED_POSITION_PARAMS
) => {
  const { actorRef, longitudinalOffset, lateralOffset } = locationParams;

  _assertRequired(actorRef, "actorRef is required");

  _assertArrayLength(lateralOffset, 2, "lateralOffset should have length of 2");
  for (const lo of lateralOffset) {
    _assertRequired(lo, "lateralOffset is required");
    _assertNumber(lo, "lateralOffset should be number");
  }
  _assertNumberGE(
    lateralOffset[1],
    lateralOffset[0],
    "lateralOffset[1] should >= lateralOffset[0]"
  );

  _assertArrayLength(
    longitudinalOffset,
    2,
    "longitudinalOffset should have length of 2"
  );
  for (const lo of longitudinalOffset) {
    _assertRequired(lo, "longitudinalOffset is required");
    _assertNumber(lo, "longitudinalOffset should be number");
  }
  _assertNumberGE(
    longitudinalOffset[1],
    longitudinalOffset[0],
    "longitudinalOffset[1] should >= longitudinalOffset[0]"
  );
};
