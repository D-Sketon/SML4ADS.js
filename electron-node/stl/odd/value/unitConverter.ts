import {
  ANGLE_UNIT,
  DISTANCE_UNIT,
  SPEED_UNIT,
  TEMPERATURE_UNIT,
  TIME_UNIT,
} from "./Unit";

/**
 * convert speed to m/s
 * @param speed
 * @param value
 */
export const speedUnitConverter = (speed: SPEED_UNIT, value: number) => {
  switch (speed) {
    case SPEED_UNIT.KMH:
      return value / 3.6;
    case SPEED_UNIT.MPH:
      return value / 2.237;
    case SPEED_UNIT.MPS:
      return value;
  }
};

/**
 * convert distance to m
 * @param distance
 * @param value
 */
export const distanceUnitConverter = (
  distance: DISTANCE_UNIT,
  value: number
) => {
  switch (distance) {
    case DISTANCE_UNIT.KM:
      return value * 1000;
    case DISTANCE_UNIT.M:
      return value;
    case DISTANCE_UNIT.CM:
      return value / 100;
    case DISTANCE_UNIT.MM:
      return value / 1000;
    case DISTANCE_UNIT.INCH:
      return value * 0.0254;
    case DISTANCE_UNIT.FT:
      return value * 0.3048;
    case DISTANCE_UNIT.YD:
      return value * 0.9144;
    case DISTANCE_UNIT.MILE:
      return value * 1609.344;
  }
};

/**
 * convert time to s
 * @param time
 * @param value
 */
export const timeUnitConverter = (time: TIME_UNIT, value: number) => {
  switch (time) {
    case TIME_UNIT.S:
      return value;
    case TIME_UNIT.MIN:
      return value * 60;
    case TIME_UNIT.H:
      return value * 3600;
  }
};

/**
 * convert temperature to C
 * @param temperature
 * @param value
 */
export const temperatureUnitConverter = (
  temperature: TEMPERATURE_UNIT,
  value: number
) => {
  switch (temperature) {
    case TEMPERATURE_UNIT.C:
      return value;
    case TEMPERATURE_UNIT.F:
      return ((value - 32) * 5) / 9;
  }
};

/**
 * convert angle to rad
 * @param angle
 * @param value
 */
export const angleUnitConverter = (angle: ANGLE_UNIT, value: number) => {
  switch (angle) {
    case ANGLE_UNIT.DEG:
      return (value * Math.PI) / 180;
    case ANGLE_UNIT.RAD:
      return value;
  }
};
