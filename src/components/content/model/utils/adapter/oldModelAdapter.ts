import { MModel } from "../../../../../model/Model";
import {
  GLOBAL_POSITION_PARAMS,
  LOCATION_TYPES,
} from "../../../../../model/params/ParamLocation";
import {
  SPEED_TYPES,
  defaultManualSpeedParams,
} from "../../../../../model/params/ParamSpeed";

/**
 * support old version
 * @param model Old model
 * @returns New model
 */
function oldModelAdapter(model: MModel): MModel {
  const newModel = { ...model };
  if (!newModel.parametricStls) {
    newModel.parametricStls = [];
  }
  if (!newModel.parameters) {
    newModel.parameters = [];
  }
  /**
   * from
   * weather: WEATHER_TYPES_CARLA | WEATHER_TYPES_LGSVL;
   * to
   * weather: WEATHER_TYPES_CARLA[] | WEATHER_TYPES_LGSVL[];
   */
  if (newModel.weather !== void 0 && !Array.isArray(newModel.weather)) {
    newModel.weather = [newModel.weather];
  }
  // version 0.3.0+
  // Add pedestrians
  if (newModel.pedestrians === void 0) {
    newModel.pedestrians = [];
  }
  newModel.cars.forEach((car) => {
    // version 0.1.0
    /**
     * from
     *
     * maxSpeed: number
     * initSpeed: number
     *
     * to
     *
     * speedType: SPEED_TYPES.MANUAL
     * speedParams: {
     *  initSpeed: number
     * }
     * maxSpeed: number
     */
    if (
      car.initSpeed !== void 0 &&
      car.speedParams === void 0 &&
      car.speedType === void 0
    ) {
      // old version
      car.speedType = SPEED_TYPES.MANUAL;
      car.speedParams = {
        initValue: car.initSpeed,
      };
      car.initSpeed = void 0;
    }
    // version 0.2.0+
    /**
     * from
     *
     * speedType: SPEED_TYPES.MANUAL
     * speedParams: {
     *  initSpeed: number
     *  maxSpeed: number
     * }
     *
     * to
     *
     * speedType: SPEED_TYPES.MANUAL
     * speedParams: {
     *  initValue: number
     * }
     * maxSpeed: number
     */
    if (
      car.speedParams !== void 0 &&
      car.speedType === SPEED_TYPES.MANUAL &&
      (car.speedParams as any).maxSpeed !== void 0 &&
      (car.speedParams as any).initSpeed !== void 0
    ) {
      car.maxSpeed = (car.speedParams as any).maxSpeed;
      car.speedParams = {
        initValue: (car.speedParams as any).initSpeed,
      };
    }
    if (
      (car.speedParams as any).initSpeed !== void 0 &&
      car.speedType === SPEED_TYPES.MANUAL &&
      (car.speedParams as any).initValue === void 0
    ) {
      car.speedParams = {
        initValue: (car.speedParams as any).initSpeed,
      };
    }
    /**
     * from
     * number
     * to
     * [number, number]
     */
    if (car.roadDeviation !== void 0 && !Array.isArray(car.roadDeviation)) {
      car.roadDeviation = [car.roadDeviation, car.roadDeviation];
    }
    if (car.locationType === LOCATION_TYPES.GLOBAL_POSITION) {
      const params = car.locationParams as GLOBAL_POSITION_PARAMS;
      if (params.x !== void 0 && !Array.isArray(params.x)) {
        params.x = [params.x, params.x];
      }
      if (params.y !== void 0 && !Array.isArray(params.y)) {
        params.y = [params.y, params.y];
      }
    } else {
      const params = car.locationParams as any;
      if (
        params.minLateralOffset !== void 0 &&
        params.maxLateralOffset !== void 0 &&
        params.minLongitudinalOffset !== void 0 &&
        params.maxLongitudinalOffset !== void 0
      ) {
        params.lateralOffset = [
          params.minLateralOffset,
          params.maxLateralOffset,
        ];
        params.longitudinalOffset = [
          params.minLongitudinalOffset,
          params.maxLongitudinalOffset,
        ];
        params.minLateralOffset = void 0;
        params.maxLateralOffset = void 0;
        params.minLongitudinalOffset = void 0;
        params.maxLongitudinalOffset = void 0;
      }
    }
    // add accelerationType and accelerationParams
    if (car.accelerationType === void 0) {
      car.accelerationType = SPEED_TYPES.MANUAL;
      car.accelerationParams = defaultManualSpeedParams();
    }
    if (car.maxAcceleration === void 0) {
      car.minAcceleration = car.maxAcceleration = 0;
    }
  });
  return newModel;
}

export default oldModelAdapter;
