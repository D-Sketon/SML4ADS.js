import RangeValue from "./RangeValue";
import EnumValue from "./enumValue";
import {
  SPEED_UNIT,
  DISTANCE_UNIT,
  TIME_UNIT,
  ACCELERATION_UNIT,
  TEMPERATURE_UNIT,
  ANGLE_UNIT,
} from "./Unit";
import {
  angleUnitConverter,
  distanceUnitConverter,
  speedUnitConverter,
  temperatureUnitConverter,
  timeUnitConverter,
} from "./unitConverter";
import { space2_ } from "../../utils";

const UNITS: [object, Function][] = [
  [SPEED_UNIT, speedUnitConverter],
  [DISTANCE_UNIT, distanceUnitConverter],
  [TIME_UNIT, timeUnitConverter],
  [TEMPERATURE_UNIT, temperatureUnitConverter],
  [ANGLE_UNIT, angleUnitConverter],
  [ACCELERATION_UNIT, (v: number) => v],
];

const valueConverter = (value: string): RangeValue | EnumValue => {
  const valueArray = value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v);
  if (valueArray.length === 0) {
    throw new Error("value is empty");
  }
  if (valueArray.length === 1) return new EnumValue([space2_(valueArray[0])]);
  if (valueArray.length > 2) return new EnumValue(valueArray.map(space2_));
  // valueArray.length === 2
  // preprocess change ∞ -> Inf
  for (let i = 0; i < valueArray.length; i++) {
    valueArray[i] = valueArray[i].replace(/∞/g, "Infinity");
  }
  // Range
  if (valueArray[0].includes('min') || valueArray[0].includes('max')) {
    return new RangeValue(space2_(valueArray[0]), space2_(valueArray[1]));
  }

  const valueArrayMapNumber: any[] = valueArray.map(Number);
  // [a, Inf [unit]] 必定是Range，无需考虑单位
  if (valueArray[1].includes("Infinity") && isNaN(valueArrayMapNumber[0])) {
    return new RangeValue(space2_(valueArray[0]), Infinity);
  }
  // 1. [1,2] if valueArrayMapNumber has no NaN

  if (!isNaN(valueArrayMapNumber[0]) && !isNaN(valueArrayMapNumber[1])) {
    return new RangeValue(valueArrayMapNumber[0], valueArrayMapNumber[1]);
  }
  // check unit
  // 2. [1,2 m/s]
  if (!isNaN(valueArrayMapNumber[0]) && isNaN(valueArrayMapNumber[1])) {
    for (const [unit, converter] of UNITS) {
      for (const u of Object.values(unit)) {
        if (valueArray[1].endsWith(u)) {
          valueArray[1] = valueArray[1].replace(u, "").trim();
          valueArrayMapNumber[1] = Number(valueArray[1]);
          const valuePostUnitConvert = valueArrayMapNumber.map((v) =>
            converter(u, v)
          );
          return new RangeValue(
            valuePostUnitConvert[0],
            isNaN(valuePostUnitConvert[1])
              ? space2_(valueArray[1])
              : valuePostUnitConvert[1],
            valueArrayMapNumber[0],
            isNaN(valueArrayMapNumber[1])
              ? space2_(valueArray[1])
              : valueArrayMapNumber[1],
            u
          );
        }
      }
    }
    throw new Error("unit is not supported");
  }
  return new EnumValue(valueArray.map(space2_));
};

export default valueConverter;
