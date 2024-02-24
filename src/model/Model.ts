import { Car, MCar } from "./Car";
import { Environment, defaultEnvironment } from "./Environment";
import { MPedestrian } from "./Pedestrian";
import { MRider } from "./Rider";

export enum SIMULATOR_TYPES {
  CARLA = "carla",
  LGSVL = "lgsvl",
}

export enum MAP_TYPES {
  CUSTOM = "custom",
  DEFAULT = "default",
}

export enum DEFAULT_MAP_TYPES {
  TOWN_01 = "Town01",
  TOWN_02 = "Town02",
  TOWN_03 = "Town03",
  TOWN_04 = "Town04",
  TOWN_05 = "Town05",
  TOWN_06 = "Town06",
  TOWN_07 = "Town07",
  TOWN_10 = "Town10HD",
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

export enum TRAFFIC_CONDITIONS {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CUSTOM = "custom",
}

export enum ROAD_TYPES {
  HIGHWAY = "highway",
  URBAN = "urban",
  RURAL = "rural",
  MIXED = "mixed",
  PARKING_LOT = "parkingLot",
  INTERSECTION = "intersection",
  JUNCTION = "junction",
  ROUNDABOUT = "roundabout",
  CUSTOM = "custom",
}

type BaseModel = {
  simulatorType: SIMULATOR_TYPES;
  mapType: MAP_TYPES;
  map: string;
  timeStep: number;
  simulationTime: number;
  scenarioEndTrigger: string;
  requirements: string[];
  // pstl need?
  parametricStls: string[];
  parameters: string[];
  // v0.4.0+
  trafficCondition?: TRAFFIC_CONDITIONS;
  roadType?: ROAD_TYPES;
  stlPath?: string;
  stl?: string[]; // only in adsml
};

export type MModel = BaseModel & {
  weather: WEATHER_TYPES_CARLA[] | WEATHER_TYPES_LGSVL[];
  cars: MCar[];
  pedestrians: MPedestrian[];
  riders: MRider[];
  environment: Environment;
};

export type Model = BaseModel & {
  weather:
    | WEATHER_TYPES_CARLA[] // support MModel
    | WEATHER_TYPES_LGSVL[] // support MModel
    | WEATHER_TYPES_CARLA
    | WEATHER_TYPES_LGSVL;
  cars: Car[];
};

export const defaultModel: () => MModel = () => ({
  simulatorType: SIMULATOR_TYPES.CARLA,
  mapType: MAP_TYPES.DEFAULT,
  map: DEFAULT_MAP_TYPES.TOWN_01,
  weather: [WEATHER_TYPES_CARLA.CLEAR_NOON],
  timeStep: 0.1,
  simulationTime: 40,
  scenarioEndTrigger: "",
  cars: [],
  pedestrians: [],
  riders: [],
  requirements: [],
  parametricStls: [],
  parameters: [],
  environment: defaultEnvironment(),
});
