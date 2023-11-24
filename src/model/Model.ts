import { Car, MCar } from "./Car";

export enum SIMULATOR_TYPES {
  CARLA = "carla",
  LGSVL = "lgsvl",
}

export enum MAP_TYPES {
  CUSTOM = "custom",
  DEFAULT = "default",
}

export enum DEFAULT_MAP_TYPES {
  TOWN_01 = "Town01.xodr",
  TOWN_02 = "Town02.xodr",
  TOWN_03 = "Town03.xodr",
  TOWN_04 = "Town04.xodr",
  TOWN_05 = "Town05.xodr",
  TOWN_06 = "Town06.xodr",
  TOWN_07 = "Town07.xodr",
  TOWN_10 = "Town10HD.xodr",
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

type BaseModel = {
  simulatorType: SIMULATOR_TYPES;
  mapType: MAP_TYPES;
  map: string;
  weather: WEATHER_TYPES_CARLA | WEATHER_TYPES_LGSVL;
  timeStep: number;
  simulationTime: number;
  scenarioEndTrigger: string;
  requirements: string[];
  parametricStls: string[];
  parameters: string[];
}

export type MModel = BaseModel & {
  cars: MCar[];
}

export type Model = BaseModel & {
  cars: Car[];
}

export const defaultModel: () => MModel = () => ({
  simulatorType: SIMULATOR_TYPES.CARLA,
  mapType: MAP_TYPES.DEFAULT,
  map: DEFAULT_MAP_TYPES.TOWN_01,
  weather: WEATHER_TYPES_CARLA.CLEAR_NOON,
  timeStep: 0.1,
  simulationTime: 40,
  scenarioEndTrigger: "",
  cars: [],
  requirements: [],
  parametricStls: [],
  parameters: [],
});