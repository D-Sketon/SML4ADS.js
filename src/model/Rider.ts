import {
  LOCATION_PARAMS,
  LOCATION_TYPES,
  defaultGlobalPositionParams,
} from "./params/ParamLocation";

export type RiderLocation = {
  locationType: LOCATION_TYPES;
  locationParams: LOCATION_PARAMS;
  speed: [number, number];
};

export type MRider = {
  name: string;
  location: RiderLocation[];
};

export const defaultRider: () => MRider = () => ({
  name: "",
  location: [
    {
      locationType: LOCATION_TYPES.GLOBAL_POSITION,
      locationParams: defaultGlobalPositionParams(),
      speed: [0, 0],
    },
  ],
});
