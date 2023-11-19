import { MCar } from "./Car";

export enum SIMULATOR_TYPES {
  CARLA = "carla",
  LGSVL = "lgsvl",
}

export enum MAP_TYPES {
  CUSTOM = "custom",
  DEFAULT = "default",
}

export enum WEATHER_TYPES_CARLA {
  CLEAR_NOON = "ClearNoon",
  CLOUDY_NOON = "CloudyNoon",
  WET_NOON = "WetNoon",
  WET_CLOUDY_NOON = "WetCloudyNoon",
  SOFT_RAIN_NOON = "SoftRainNoon",
  MID_RAINY_NOON = "MidRainyNoon",
  HARD_RAIN_NOON = "HardRainNoon",
  CLEAR_SUNSET = "ClearSunset",
  CLOUDY_SUNSET = "CloudySunset",
  WET_SUNSET = "WetSunset",
  WET_CLOUDY_SUNSET = "WetCloudySunset",
  SOFT_RAIN_SUNSET = "SoftRainSunset",
  MID_RAIN_SUNSET = "MidRainSunset",
  HARD_RAIN_SUNSET = "HardRainSunset",
}

export enum WEATHER_TYPES_LGSVL {
  CLEAR = "clear",
  RAINY = "rainy",
}

export type MModel = {
  simulatorType: SIMULATOR_TYPES;
  mapType: MAP_TYPES;
  map: string;
  weather: string;
  timeStep: number;
  simulationTime: number;
  scenarioEndTrigger: string;
  cars: MCar[];
  requirements: string[];
  parametricStls: string[];
  parametrics: string[];
}

export const defaultModel: () => MModel = () => ({
  simulatorType: SIMULATOR_TYPES.CARLA,
  mapType: MAP_TYPES.DEFAULT,
  map: "",
  weather: WEATHER_TYPES_CARLA.CLEAR_NOON,
  timeStep: 0.1,
  simulationTime: 40,
  scenarioEndTrigger: "",
  cars: [],
  requirements: [],
  parametricStls: [],
  parametrics: [],
});