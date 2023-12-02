import { MModel } from "../../../../../model/Model";
import { SPEED_TYPES } from "../../../../../model/params/ParamSpeed";

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
        initSpeed: car.initSpeed,
      };
      car.initSpeed = void 0;
    }
    // version 0.2.0
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
     *  initSpeed: number
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
        initSpeed: (car.speedParams as any).initSpeed,
      };
    }
    /**
     * from
     * roadDeviation: number
     * to
     * roadDeviation: [number, number]
     */
    if (car.roadDeviation !== void 0 && !Array.isArray(car.roadDeviation)) {
      car.roadDeviation = [car.roadDeviation, car.roadDeviation];
    }
  });
  return newModel;
}

export default oldModelAdapter;