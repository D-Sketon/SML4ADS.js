import RangeValue from "../value/RangeValue";
import EnumValue from "../value/enumValue";
import { mergeIntervals } from "./utils";

export default class Rainfall {
  // mm/h, precipitation rate
  static "no_rain" = [0, [0, 0]];
  static "light_rain" = [1, [0, 2.5]];
  static "moderate_rain" = [2, [2.5, 7.6]];
  static "heavy_rain" = [3, [7.6, 50]];
  static "violent_rain" = [4, [50, 100]];
  static "cloudburst" = [5, [100, Infinity]];

  static rainfallInvertedArray = [
    Rainfall.no_rain,
    Rainfall.light_rain,
    Rainfall.moderate_rain,
    Rainfall.heavy_rain,
    Rainfall.violent_rain,
    Rainfall.cloudburst,
  ];

  static instantiate(value: EnumValue | RangeValue): RangeValue[] {
    if (value instanceof RangeValue) {
      return [value];
    } else {
      // 取得对应下标并排序
      const indexArray = value.value
        .map((v) => Rainfall[v][0])
        .sort((a, b) => a - b);
      // 合并区间
      // e.g. 0,1,2,5,6,7,9 => [0,2],[5,6,7],[9]
      const result = mergeIntervals(indexArray);

      return result.map((res) => {
        const lowerBound: number = Rainfall.rainfallInvertedArray[res[0]][1][0];
        const upperBound: number =
          Rainfall.rainfallInvertedArray[res[res.length - 1]][1][1];
        return new RangeValue(
          lowerBound,
          upperBound,
          lowerBound,
          upperBound,
          "mm/h"
        );
      });
    }
  }
}
