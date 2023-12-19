import {
  LOCATION_PARAMS,
  LOCATION_TYPES,
  defaultGlobalPositionParams,
} from "./params/ParamLocation";

export enum PEDESTRIAN_TYPES_CARLA {
  RANDOM = "random",
  PEDESTRIAN_001 = "walker.pedestrian.0001",
  PEDESTRIAN_002 = "walker.pedestrian.0002",
  PEDESTRIAN_003 = "walker.pedestrian.0003",
  PEDESTRIAN_004 = "walker.pedestrian.0004",
  PEDESTRIAN_005 = "walker.pedestrian.0005",
  PEDESTRIAN_006 = "walker.pedestrian.0006",
  PEDESTRIAN_007 = "walker.pedestrian.0007",
  PEDESTRIAN_008 = "walker.pedestrian.0008",
  PEDESTRIAN_009 = "walker.pedestrian.0009",
  PEDESTRIAN_010 = "walker.pedestrian.0010",
  PEDESTRIAN_011 = "walker.pedestrian.0011",
  PEDESTRIAN_012 = "walker.pedestrian.0012",
  PEDESTRIAN_013 = "walker.pedestrian.0013",
  PEDESTRIAN_014 = "walker.pedestrian.0014",
  PEDESTRIAN_015 = "walker.pedestrian.0015",
  PEDESTRIAN_016 = "walker.pedestrian.0016",
  PEDESTRIAN_017 = "walker.pedestrian.0017",
  PEDESTRIAN_018 = "walker.pedestrian.0018",
  PEDESTRIAN_019 = "walker.pedestrian.0019",
  PEDESTRIAN_020 = "walker.pedestrian.0020",
  PEDESTRIAN_021 = "walker.pedestrian.0021",
  PEDESTRIAN_022 = "walker.pedestrian.0022",
  PEDESTRIAN_023 = "walker.pedestrian.0023",
  PEDESTRIAN_024 = "walker.pedestrian.0024",
  PEDESTRIAN_025 = "walker.pedestrian.0025",
  PEDESTRIAN_026 = "walker.pedestrian.0026",
  PEDESTRIAN_027 = "walker.pedestrian.0027",
  PEDESTRIAN_028 = "walker.pedestrian.0028",
  PEDESTRIAN_029 = "walker.pedestrian.0029",
  PEDESTRIAN_030 = "walker.pedestrian.0030",
  PEDESTRIAN_031 = "walker.pedestrian.0031",
  PEDESTRIAN_032 = "walker.pedestrian.0032",
  PEDESTRIAN_033 = "walker.pedestrian.0033",
  PEDESTRIAN_034 = "walker.pedestrian.0034",
  PEDESTRIAN_035 = "walker.pedestrian.0035",
  PEDESTRIAN_036 = "walker.pedestrian.0036",
  PEDESTRIAN_037 = "walker.pedestrian.0037",
  PEDESTRIAN_038 = "walker.pedestrian.0038",
  PEDESTRIAN_039 = "walker.pedestrian.0039",
  PEDESTRIAN_040 = "walker.pedestrian.0040",
  PEDESTRIAN_041 = "walker.pedestrian.0041",
  PEDESTRIAN_042 = "walker.pedestrian.0042",
  PEDESTRIAN_043 = "walker.pedestrian.0043",
  PEDESTRIAN_044 = "walker.pedestrian.0044",
  PEDESTRIAN_045 = "walker.pedestrian.0045",
  PEDESTRIAN_046 = "walker.pedestrian.0046",
  PEDESTRIAN_047 = "walker.pedestrian.0047",
  PEDESTRIAN_048 = "walker.pedestrian.0048",
}

export enum PEDESTRIAN_SPEED_TYPES {
  WALK = "Walk",
  RUN = "Run",
  MANUAL = "Manual",
}

export type PEDESTRIAN_SPEED_PARAMS = {
  speed?: number;
};

export const defaultPedestrianSpeedParams: (
  type: PEDESTRIAN_SPEED_TYPES
) => PEDESTRIAN_SPEED_PARAMS = (type) => {
  if (type === PEDESTRIAN_SPEED_TYPES.MANUAL) {
    return {
      speed: 0,
    };
  }
  return {};
};

export type PedestrianLocation = {
  locationType: LOCATION_TYPES;
  locationParams: LOCATION_PARAMS;
  speedType: PEDESTRIAN_SPEED_TYPES;
  speedParams: PEDESTRIAN_SPEED_PARAMS;
};

export type MPedestrian = {
  name: string;
  model: PEDESTRIAN_TYPES_CARLA;
  location: PedestrianLocation[];
};

export const defaultPedestrian: () => MPedestrian = () => ({
  name: "",
  model: PEDESTRIAN_TYPES_CARLA.RANDOM,
  location: [
    {
      locationType: LOCATION_TYPES.GLOBAL_POSITION,
      locationParams: defaultGlobalPositionParams(),
      speedType: PEDESTRIAN_SPEED_TYPES.WALK,
      speedParams: {},
    },
  ],
});
