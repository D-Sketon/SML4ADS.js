import {
  LOCATION_TYPES,
  LOCATION_PARAMS,
  GLOBAL_POSITION_PARAMS,
  LANE_POSITION_PARAMS,
  ROAD_POSITION_PARAMS,
  RELATED_POSITION_PARAMS,
} from "../../../../../model/params/ParamLocation";
import { _assertRequired, _assertNumber } from "../../../../../utils/assert";

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

  _assertRequired(x, "x is required");
  _assertNumber(x, "x should be number");

  _assertRequired(y, "y is required");
  _assertNumber(y, "y should be number");
};

const checkLanePositionParams = (locationParams: LANE_POSITION_PARAMS) => {
  const {
    roadId,
    laneId,
    minLateralOffset,
    maxLateralOffset,
    minLongitudinalOffset,
    maxLongitudinalOffset,
  } = locationParams;

  _assertRequired(roadId, "roadId is required");
  _assertNumber(roadId, "roadId should be number");

  _assertRequired(laneId, "laneId is required");
  _assertNumber(laneId, "laneId should be number");

  _assertRequired(minLateralOffset, "minLateralOffset is required");
  _assertNumber(minLateralOffset, "minLateralOffset should be number");

  _assertRequired(maxLateralOffset, "maxLateralOffset is required");
  _assertNumber(maxLateralOffset, "maxLateralOffset should be number");

  _assertRequired(minLongitudinalOffset, "minLongitudinalOffset is required");
  _assertNumber(
    minLongitudinalOffset,
    "minLongitudinalOffset should be number"
  );

  _assertRequired(maxLongitudinalOffset, "maxLongitudinalOffset is required");
  _assertNumber(
    maxLongitudinalOffset,
    "maxLongitudinalOffset should be number"
  );
};

const checkRoadPositionParams = (locationParams: ROAD_POSITION_PARAMS) => {
  const {
    roadId,
    minLateralOffset,
    maxLateralOffset,
    minLongitudinalOffset,
    maxLongitudinalOffset,
  } = locationParams;

  _assertRequired(roadId, "roadId is required");
  _assertNumber(roadId, "roadId should be number");

  _assertRequired(minLateralOffset, "minLateralOffset is required");
  _assertNumber(minLateralOffset, "minLateralOffset should be number");

  _assertRequired(maxLateralOffset, "maxLateralOffset is required");
  _assertNumber(maxLateralOffset, "maxLateralOffset should be number");

  _assertRequired(minLongitudinalOffset, "minLongitudinalOffset is required");
  _assertNumber(
    minLongitudinalOffset,
    "minLongitudinalOffset should be number"
  );

  _assertRequired(maxLongitudinalOffset, "maxLongitudinalOffset is required");
  _assertNumber(
    maxLongitudinalOffset,
    "maxLongitudinalOffset should be number"
  );
};

const checkRelatedPositionParams = (
  locationParams: RELATED_POSITION_PARAMS
) => {
  const {
    actorRef,
    minLateralOffset,
    maxLateralOffset,
    minLongitudinalOffset,
    maxLongitudinalOffset,
  } = locationParams;

  _assertRequired(actorRef, "actorRef is required");

  _assertRequired(minLateralOffset, "minLateralOffset is required");
  _assertNumber(minLateralOffset, "minLateralOffset should be number");

  _assertRequired(maxLateralOffset, "maxLateralOffset is required");
  _assertNumber(maxLateralOffset, "maxLateralOffset should be number");

  _assertRequired(minLongitudinalOffset, "minLongitudinalOffset is required");
  _assertNumber(
    minLongitudinalOffset,
    "minLongitudinalOffset should be number"
  );

  _assertRequired(maxLongitudinalOffset, "maxLongitudinalOffset is required");
  _assertNumber(
    maxLongitudinalOffset,
    "maxLongitudinalOffset should be number"
  );
};
