import RangeValue from "../value/RangeValue";
import EnumValue from "../value/enumValue";
import { mergeIntervals } from "./utils";

export default class Wind {
  static "no_wind" = [0, [0, 0]];
  static "calm" = [1, [0, 0.2]];
  static "light_air" = [2, [0.3, 1.5]];
  static "light_breeze" = [3, [1.6, 3.3]];
  static "gentle_breeze" = [4, [3.4, 5.4]];
  static "moderate_breeze" = [5, [5.5, 7.9]];
  static "fresh_breeze" = [6, [8, 10.7]];
  static "strong_breeze" = [7, [10.8, 13.8]];
  static "near_gale" = [8, [13.9, 17.1]];
  static "gale" = [9, [17.2, 20.7]];
  static "strong_gale" = [10, [20.8, 24.4]];
  static "storm" = [11, [24.5, 28.4]];
  static "violent_storm" = [12, [28.5, 32.6]];
  static "hurricane_force" = [13, [32.7, Infinity]];

  static windInvertedArray = [
    Wind.no_wind,
    Wind.calm,
    Wind.light_air,
    Wind.light_breeze,
    Wind.gentle_breeze,
    Wind.moderate_breeze,
    Wind.fresh_breeze,
    Wind.strong_breeze,
    Wind.near_gale,
    Wind.gale,
    Wind.strong_gale,
    Wind.storm,
    Wind.violent_storm,
    Wind.hurricane_force,
  ];

  static instantiate(value: EnumValue | RangeValue): RangeValue[] {
    if (value instanceof RangeValue) {
      return [value];
    } else {
      // 取得对应下标并排序
      const indexArray = value.value
        .map((v) => Wind[v][0])
        .sort((a, b) => a - b);
      // 合并区间
      // e.g. 0,1,2,5,6,7,9 => [0,2],[5,6,7],[9]
      const result = mergeIntervals(indexArray);

      return result.map((res) => {
        const lowerBound: number = Wind.windInvertedArray[res[0]][1][0];
        const upperBound: number =
          Wind.windInvertedArray[res[res.length - 1]][1][1];
        return new RangeValue(
          lowerBound,
          upperBound,
          lowerBound,
          upperBound,
          "m/s"
        );
      });
    }
  }
}
