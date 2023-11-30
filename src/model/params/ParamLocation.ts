export enum LOCATION_TYPES {
  GLOBAL_POSITION = "Global Position",
  LANE_POSITION = "Lane Position",
  ROAD_POSITION = "Road Position",
  RELATED_POSITION = "Related Position",
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

export type LOCATION_PARAMS =
  | GLOBAL_POSITION_PARAMS
  | LANE_POSITION_PARAMS
  | ROAD_POSITION_PARAMS
  | RELATED_POSITION_PARAMS;

export const defaultLocationParams: (type: LOCATION_TYPES) => LOCATION_PARAMS = (type) => {
  switch (type) {
    case LOCATION_TYPES.GLOBAL_POSITION:
      return defaultGlobalPositionParams();
    case LOCATION_TYPES.LANE_POSITION:
      return defaultLanePositionParams();
    case LOCATION_TYPES.ROAD_POSITION:
      return defaultRoadPositionParams();
    case LOCATION_TYPES.RELATED_POSITION:
      return defaultRelatedPositionParams();
  }
}
