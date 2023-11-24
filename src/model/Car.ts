import { MTree, Tree } from "./Tree";

export enum LOCATION_TYPES {
  GLOBAL_POSITION = "Global Position",
  LANE_POSITION = "Lane Position",
  ROAD_POSITION = "Road Position",
  RELATED_POSITION = "Related Position",
}

export enum VEHICLE_TYPES_CARLA {
  RANDOM = "random",
  AUDI_A2 = "vehicle.audi.a2",
  AUDI_ETRON = "vehicle.audi.etron",
  AUDI_TT = "vehicle.audi.tt",
  BMW_GRANDTOURER = "vehicle.bmw.grandtourer",
  CARLAMOTORS_CARLACOLA = "vehicle.carlamotors.carlacola",
  CARLAMOTORS_FIRETRUCK = "vehicle.carlamotors.firetruck",
  CHEVROLET_IMPALA = "vehicle.chevrolet.impala",
  CITROEN_C3 = "vehicle.citroen.c3",
  DODGE_CHARGER_2020 = "vehicle.dodge.charger_2020",
  DODGE_CHARGER_POLICE = "vehicle.dodge.charger_police",
  DODGE_CHARGER_POLICE_2020 = "vehicle.dodge.charger_police_2020",
  FORD_AMBULANCE = "vehicle.ford.ambulance",
  FORD_CROWN = "vehicle.ford.crown",
  FORD_MUSTANG = "vehicle.ford.mustang",
  JEEP_WRANGLER_RUBICON = "vehicle.jeep.wrangler_rubicon",
  KAWASAKI_NINJA = "vehicle.kawasaki.ninja",
  LINCOLN_MKZ_2017 = "vehicle.lincoln.mkz_2017",
  LINCOLN_MKZ_2020 = "vehicle.lincoln.mkz_2020",
  MERCEDES_COUPE = "vehicle.mercedes.coupe",
  MERCEDES_COUPE_2020 = "vehicle.mercedes.coupe_2020",
  MERCEDES_SPRINTER = "vehicle.mercedes.sprinter",
  MICRO_MICROLINO = "vehicle.micro.microlino",
  MINI_COOPER_S = "vehicle.mini.cooper_s",
  MINI_COOPER_S_2021 = "vehicle.mini.cooper_s_2021",
  NISSAN_MICRA = "vehicle.nissan.micra",
  NISSAN_PATROL = "vehicle.nissan.patrol",
  NISSAN_PATROL_2021 = "vehicle.nissan.patrol_2021",
  SEAT_LEON = "vehicle.seat.leon",
  TESLA_CYBERTRUCK = "vehicle.tesla.cybertruck",
  TESLA_MODEL3 = "vehicle.tesla.model3",
  TOYOTA_PRIUS = "vehicle.toyota.prius",
  VOLKSWAGEN_T2 = "vehicle.volkswagen.t2",
  VOLKSWAGEN_T2_2021 = "vehicle.volkswagen.t2_2021",
}

export enum VEHICLE_TYPES_LGSVL {
  RANDOM = "random",
}

export type GLOBAL_POSITION_PARAMS = {
  x: number;
  y: number;
};

export const defaultGlobalPositionParams: () => GLOBAL_POSITION_PARAMS =
  () => ({
    x: 0,
    y: 0,
  });

export type LANE_POSITION_PARAMS = {
  roadId: number;
  laneId: number;
  minLateralOffset: number;
  maxLateralOffset: number;
  minLongitudinalOffset: number;
  maxLongitudinalOffset: number;
};

export const defaultLanePositionParams: () => LANE_POSITION_PARAMS = () => ({
  roadId: 0,
  laneId: 0,
  minLateralOffset: 0,
  maxLateralOffset: 0,
  minLongitudinalOffset: 0,
  maxLongitudinalOffset: 0,
});

export type ROAD_POSITION_PARAMS = {
  roadId: number;
  minLateralOffset: number;
  maxLateralOffset: number;
  minLongitudinalOffset: number;
  maxLongitudinalOffset: number;
};

export const defaultRoadPositionParams: () => ROAD_POSITION_PARAMS = () => ({
  roadId: 0,
  minLateralOffset: 0,
  maxLateralOffset: 0,
  minLongitudinalOffset: 0,
  maxLongitudinalOffset: 0,
});

export type RELATED_POSITION_PARAMS = {
  actorRef: string;
  minLateralOffset: number;
  maxLateralOffset: number;
  minLongitudinalOffset: number;
  maxLongitudinalOffset: number;
};

export const defaultRelatedPositionParams: () => RELATED_POSITION_PARAMS =
  () => ({
    actorRef: "",
    minLateralOffset: 0,
    maxLateralOffset: 0,
    minLongitudinalOffset: 0,
    maxLongitudinalOffset: 0,
  });

export enum SPEED_TYPES {
  MANUAL = "Manual",
  PROBABILISTIC = "Probabilistic",
  UNIFORM_DISTRIBUTION = "Uniform Distribution",
  NORMAL_DISTRIBUTION = "Normal Distribution",
}

export type MANUAL_SPEED_PARAMS = {
  maxSpeed: number;
  initSpeed: number;
};

export const defaultManualSpeedParams: () => MANUAL_SPEED_PARAMS = () => ({
  maxSpeed: 0,
  initSpeed: 0,
});

export type UNIFORM_DISTRIBUTION_SPEED_PARAMS = {
  a: number;
  b: number;
};

export const defaultUniformDistributionSpeedParams: () => UNIFORM_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    a: 0,
    b: 0,
  });

export type NORMAL_DISTRIBUTION_SPEED_PARAMS = {
  mean: number;
  std: number;
};

export const defaultNormalDistributionSpeedParams: () => NORMAL_DISTRIBUTION_SPEED_PARAMS =
  () => ({
    mean: 0,
    std: 0,
  });

type BaseCar = {
  name: string;
  model: VEHICLE_TYPES_CARLA | VEHICLE_TYPES_LGSVL;
  speedType: SPEED_TYPES;
  speedParams:
    | MANUAL_SPEED_PARAMS
    | UNIFORM_DISTRIBUTION_SPEED_PARAMS
    | NORMAL_DISTRIBUTION_SPEED_PARAMS;
  locationType: LOCATION_TYPES;
  initSpeed?: number;  // support old version
  maxSpeed?: number;  // support old version
  locationParams:
    | GLOBAL_POSITION_PARAMS
    | LANE_POSITION_PARAMS
    | ROAD_POSITION_PARAMS
    | RELATED_POSITION_PARAMS;
  heading: boolean;
  roadDeviation: number;
  treePath: string;
};

export type MCar = BaseCar & {
  mTree?: MTree;
};

export type Car = BaseCar & {
  mTree: Tree;
} & {
  roadId: number;
  laneId: number;
  minOffset: number;
  maxOffset: number;
  minLateralOffset: number;
  maxLateralOffset: number;
  x: number;
  y: number;

  actorRef: string;

  laneSingleId: number;
  offset: number;
  laneSectionId: number;
  laneIndex: number;
  laneSectionIndex: number;
  roadIndex: number;
  width: number;
  length: number;
};

export const defaultCar: () => MCar = () => ({
  name: "",
  model: VEHICLE_TYPES_CARLA.RANDOM,
  speedType: SPEED_TYPES.MANUAL,
  speedParams: defaultManualSpeedParams(),
  locationType: LOCATION_TYPES.GLOBAL_POSITION,
  locationParams: defaultGlobalPositionParams(),
  heading: false,
  roadDeviation: 0,
  treePath: "",
});
