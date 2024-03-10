import { VEHICLE_TYPES } from "../../../../../model/Car";
import {
  Environment,
  defaultEnvironment,
} from "../../../../../model/Environment";
import { MModel } from "../../../../../model/Model";
import {
  MPedestrian,
  PEDESTRIAN_SPEED_TYPES,
} from "../../../../../model/Pedestrian";
import { MRider } from "../../../../../model/Rider";
import {
  GLOBAL_POSITION_PARAMS,
  LOCATION_TYPES,
} from "../../../../../model/params/ParamLocation";
import {
  SPEED_TYPES,
  defaultManualSpeedParams,
} from "../../../../../model/params/ParamSpeed";

const oldEnvironmentAdapter = (environment: Environment) => {
  // change to array
  if (
    environment.atmospherePressure !== void 0 &&
    !Array.isArray(environment.atmospherePressure)
  ) {
    environment.atmospherePressure = [
      environment.atmospherePressure,
      environment.atmospherePressure,
    ];
  }
  if (
    environment.temperature !== void 0 &&
    !Array.isArray(environment.temperature)
  ) {
    environment.temperature = [
      environment.temperature,
      environment.temperature,
    ];
  }
  if (
    environment.visibility !== void 0 &&
    !Array.isArray(environment.visibility)
  ) {
    environment.visibility = [environment.visibility, environment.visibility];
  }
  if (environment.sunProperty !== void 0) {
    if (
      environment.sunProperty.sunAzimuth !== void 0 &&
      !Array.isArray(environment.sunProperty.sunAzimuth)
    ) {
      environment.sunProperty.sunAzimuth = [
        environment.sunProperty.sunAzimuth,
        environment.sunProperty.sunAzimuth,
      ];
    }
    if (
      environment.sunProperty.sunElevation !== void 0 &&
      !Array.isArray(environment.sunProperty.sunElevation)
    ) {
      environment.sunProperty.sunElevation = [
        environment.sunProperty.sunElevation,
        environment.sunProperty.sunElevation,
      ];
    }
  }
  if (environment.particulates !== void 0) {
    if (
      environment.particulates.type !== void 0 &&
      !Array.isArray(environment.particulates.type)
    ) {
      environment.particulates.type = [environment.particulates.type];
    }
  }
  if (environment.illumination !== void 0) {
    if (
      environment.illumination.type !== void 0 &&
      !Array.isArray(environment.illumination.type)
    ) {
      environment.illumination.type = [environment.illumination.type];
    }
    if (
      environment.illumination.lightingIntensity !== void 0 &&
      !Array.isArray(environment.illumination.lightingIntensity)
    ) {
      environment.illumination.lightingIntensity = [
        environment.illumination.lightingIntensity,
        environment.illumination.lightingIntensity,
      ];
    }
  }
  if (environment.weather !== void 0) {
    if (environment.weather.cloud !== void 0) {
      if (
        environment.weather.cloud.type !== void 0 &&
        !Array.isArray(environment.weather.cloud.type)
      ) {
        environment.weather.cloud.type = [environment.weather.cloud.type];
      }
      if (
        environment.weather.cloud.cloudinessLevel !== void 0 &&
        !Array.isArray(environment.weather.cloud.cloudinessLevel)
      ) {
        environment.weather.cloud.cloudinessLevel = [
          environment.weather.cloud.cloudinessLevel,
          environment.weather.cloud.cloudinessLevel,
        ];
      }
    }
    if (environment.weather.snowfall !== void 0) {
      if (
        environment.weather.snowfall.type !== void 0 &&
        !Array.isArray(environment.weather.snowfall.type)
      ) {
        environment.weather.snowfall.type = [environment.weather.snowfall.type];
      }
      if (
        environment.weather.snowfall.snowfallIntensity !== void 0 &&
        !Array.isArray(environment.weather.snowfall.snowfallIntensity)
      ) {
        environment.weather.snowfall.snowfallIntensity = [
          environment.weather.snowfall.snowfallIntensity,
          environment.weather.snowfall.snowfallIntensity,
        ];
      }
    }
    if (environment.weather.rainfall !== void 0) {
      if (
        environment.weather.rainfall.type !== void 0 &&
        !Array.isArray(environment.weather.rainfall.type)
      ) {
        environment.weather.rainfall.type = [environment.weather.rainfall.type];
      }
      if (
        environment.weather.rainfall.precipitationIntensity !== void 0 &&
        !Array.isArray(environment.weather.rainfall.precipitationIntensity)
      ) {
        environment.weather.rainfall.precipitationIntensity = [
          environment.weather.rainfall.precipitationIntensity,
          environment.weather.rainfall.precipitationIntensity,
        ];
      }
    }
    if (environment.weather.wind !== void 0) {
      if (
        environment.weather.wind.type !== void 0 &&
        !Array.isArray(environment.weather.wind.type)
      ) {
        environment.weather.wind.type = [environment.weather.wind.type];
      }
      if (
        environment.weather.wind.windSpeed !== void 0 &&
        !Array.isArray(environment.weather.wind.windSpeed)
      ) {
        environment.weather.wind.windSpeed = [
          environment.weather.wind.windSpeed,
          environment.weather.wind.windSpeed,
        ];
      }
    }
  }
};

const oldPedestrianAdapter = (pedestrian: MPedestrian) => {
  pedestrian.location.forEach((location) => {
    if (location.speedType === PEDESTRIAN_SPEED_TYPES.MANUAL) {
      if (!Array.isArray(location.speedParams!.speed)) {
        const speed = location.speedParams!.speed! as unknown as number;
        location.speedParams!.speed = [speed, speed];
      }
    }
  });
};

const oldRiderAdapter = (rider: MRider) => {
  rider.location.forEach((location) => {
    if (!Array.isArray(location.speed)) {
      const speed = location.speed as unknown as number;
      location.speed = [speed, speed];
    }
  });
};

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
  // version 0.4.0+
  // Add environment
  if (!newModel.environment) {
    newModel.environment = defaultEnvironment();
  }
  if (newModel.environment) {
    oldEnvironmentAdapter(newModel.environment);
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
  newModel.pedestrians.forEach((pedestrian) => {
    oldPedestrianAdapter(pedestrian);
  });
  // version 0.4.0+
  // Add riders
  if (newModel.riders === void 0) {
    newModel.riders = [];
  }
  newModel.riders.forEach((rider) => {
    oldRiderAdapter(rider);
  });
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
    // version 0.4.0+
    // Add vehicle type
    if (car.type === void 0) {
      car.type = VEHICLE_TYPES.PRIVATE;
    }
  });
  return newModel;
}

export default oldModelAdapter;
