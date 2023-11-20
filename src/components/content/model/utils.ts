import { GLOBAL_POSITION_PARAMS, LANE_POSITION_PARAMS, LOCATION_TYPES, MCar, RELATED_POSITION_PARAMS, ROAD_POSITION_PARAMS } from "../../../model/Car";
import { MAP_TYPES, MModel } from "../../../model/Model";

export const checkModel = (model: MModel) => {
  const { mapType, map, timeStep, simulationTime, cars } = model;
  if (mapType === MAP_TYPES.CUSTOM && (map === null || map === void 0 || map === '')) {
    throw new Error("Map path is required");
  }

  _assertRequired(timeStep, "TimeStep is required");
  _assertNumberGE(timeStep, 0.1, "TimeStep should be >=0.1");
  _assertNumberLE(timeStep, 10, "TimeStep should be <=10");

  _assertRequired(simulationTime, "SimulationTime is required");
  _assertNumberGE(simulationTime, 0, "SimulationTime should be >=0");
  _assertNumberLE(simulationTime, 40, "SimulationTime should be <=40");
  // simulationTime should be a multiple of timeStep
  if (Number(simulationTime) / Number(timeStep) !==
    Math.floor(Number(simulationTime) / Number(timeStep))) {
    throw new Error("SimulationTime should be a multiple of timeStep");
  }

  checkCars(cars);
}

export const checkCars = (cars: MCar[]) => {
  for (const car of cars) {
    const { name, maxSpeed, initSpeed, roadDeviation, treePath } = car;
    _assertRequired(name, "Car name is required");

    _assertRequired(maxSpeed, "Car maxSpeed is required");
    _assertNumberGE(maxSpeed, 0, "Car maxSpeed should >= 0");

    _assertRequired(initSpeed, "Car initSpeed is required");
    _assertNumber(initSpeed, "Car initSpeed should be number");
    _assertNumberGE(initSpeed, 0, "Car initSpeed should >= 0");
    // initSpeed should <= maxSpeed
    if (Number(initSpeed) > Number(maxSpeed)) {
      throw new Error("Car initSpeed should <= maxSpeed");
    }

    _assertRequired(roadDeviation, "Car roadDeviation is required");
    _assertNumber(roadDeviation, "Car roadDeviation should be number");

    checkLocationParams(car.locationType, car.locationParams);

    _assertRequired(treePath, "Car treePath is required");
  }
}

export const checkLocationParams = (locationType: LOCATION_TYPES, locationParams:
  | GLOBAL_POSITION_PARAMS
  | LANE_POSITION_PARAMS
  | ROAD_POSITION_PARAMS
  | RELATED_POSITION_PARAMS) => {
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
}

const checkGlobalPositionParams = (locationParams: GLOBAL_POSITION_PARAMS) => {
  const { x, y } = locationParams;

  _assertRequired(x, "x is required");
  _assertNumber(x, "x should be number");

  _assertRequired(y, "y is required");
  _assertNumber(y, "y should be number");
}

const checkLanePositionParams = (locationParams: LANE_POSITION_PARAMS) => {
  const { roadId, laneId, minLateralOffset, maxLateralOffset, minLongitudinalOffset, maxLongitudinalOffset } = locationParams;

  _assertRequired(roadId, "roadId is required");

  _assertRequired(laneId, "laneId is required");

  _assertRequired(minLateralOffset, "minLateralOffset is required");
  _assertNumber(minLateralOffset, "minLateralOffset should be number");

  _assertRequired(maxLateralOffset, "maxLateralOffset is required");
  _assertNumber(maxLateralOffset, "maxLateralOffset should be number");

  _assertRequired(minLongitudinalOffset, "minLongitudinalOffset is required");
  _assertNumber(minLongitudinalOffset, "minLongitudinalOffset should be number");

  _assertRequired(maxLongitudinalOffset, "maxLongitudinalOffset is required");
  _assertNumber(maxLongitudinalOffset, "maxLongitudinalOffset should be number");
}

const checkRoadPositionParams = (locationParams: ROAD_POSITION_PARAMS) => {
  const { roadId, minLateralOffset, maxLateralOffset, minLongitudinalOffset, maxLongitudinalOffset } = locationParams;

  _assertRequired(roadId, "roadId is required");

  _assertRequired(minLateralOffset, "minLateralOffset is required");
  _assertNumber(minLateralOffset, "minLateralOffset should be number");

  _assertRequired(maxLateralOffset, "maxLateralOffset is required");
  _assertNumber(maxLateralOffset, "maxLateralOffset should be number");

  _assertRequired(minLongitudinalOffset, "minLongitudinalOffset is required");
  _assertNumber(minLongitudinalOffset, "minLongitudinalOffset should be number");

  _assertRequired(maxLongitudinalOffset, "maxLongitudinalOffset is required");
  _assertNumber(maxLongitudinalOffset, "maxLongitudinalOffset should be number");
}

const checkRelatedPositionParams = (locationParams: RELATED_POSITION_PARAMS) => {
  const { actorRef, minLateralOffset, maxLateralOffset, minLongitudinalOffset, maxLongitudinalOffset } = locationParams;

  _assertRequired(actorRef, "actorRef is required");

  _assertRequired(minLateralOffset, "minLateralOffset is required");
  _assertNumber(minLateralOffset, "minLateralOffset should be number");

  _assertRequired(maxLateralOffset, "maxLateralOffset is required");
  _assertNumber(maxLateralOffset, "maxLateralOffset should be number");

  _assertRequired(minLongitudinalOffset, "minLongitudinalOffset is required");
  _assertNumber(minLongitudinalOffset, "minLongitudinalOffset should be number");

  _assertRequired(maxLongitudinalOffset, "maxLongitudinalOffset is required");
  _assertNumber(maxLongitudinalOffset, "maxLongitudinalOffset should be number");
}


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

const _assertNumberLE = (value: any, max: number, errMsg: string) => {
  _assertNumber(value, errMsg);
  if (Number(value) > max) {
    throw new Error(errMsg);
  }
}