import RangeValue from "../value/RangeValue";
import EnumValue from "../value/enumValue";
import { mergeIntervals } from "./utils";

export default class Snowfall {
  // km, visibility
  static "no_snow" = [0, [Infinity, Infinity]];
  static "light_snow" = [1, [1, Infinity]];
  static "moderate_snow" = [2, [0.5, 1]];
  static "heavy_snow" = [3, [0, 0.5]];

  static snowfallInvertedArray = [
    Snowfall.no_snow,
    Snowfall.light_snow,
    Snowfall.moderate_snow,
    Snowfall.heavy_snow,
  ];

  static instantiate(value: EnumValue | RangeValue): RangeValue[] {
    if (value instanceof RangeValue) {
      return [value];
    } else {
      // 取得对应下标并排序
      const indexArray = value.value
        .map((v) => Snowfall[v][0])
        .sort((a, b) => b - a);
      // 合并区间
      // e.g. 0,1,2,5,6,7,9 => [0,2],[5,6,7],[9]
      const result = mergeIntervals(indexArray);

      return result.map((res) => {
        const lowerBound: number = Snowfall.snowfallInvertedArray[res[0]][1][0];
        const upperBound: number =
          Snowfall.snowfallInvertedArray[res[res.length - 1]][1][1];
        return new RangeValue(
          lowerBound,
          upperBound,
          lowerBound,
          upperBound,
          "km"
        );
      });
    }
  }
}
