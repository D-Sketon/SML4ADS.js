import RangeValue from "../value/RangeValue";
import EnumValue from "../value/enumValue";
import { mergeIntervals } from "./utils";

export default class Cloudiness {
  // oktas
  static "clear" = [0, [0, 1]];
  static "partly_cloudy" = [1, [1, 8]];
  static "overcast" = [2, [8, Infinity]];

  static cloudinessInvertedArray = [
    Cloudiness.clear,
    Cloudiness.partly_cloudy,
    Cloudiness.overcast,
  ];

  static instantiate(value: EnumValue | RangeValue): RangeValue[] {
    if (value instanceof RangeValue) {
      return [value];
    } else {
      // 取得对应下标并排序
      const indexArray = value.value
        .map((v) => Cloudiness[v][0])
        .sort((a, b) => a - b);
      // 合并区间
      // e.g. 0,1,2,5,6,7,9 => [0,2],[5,6,7],[9]
      const result = mergeIntervals(indexArray);

      return result.map((res) => {
        const lowerBound: number =
          Cloudiness.cloudinessInvertedArray[res[0]][1][0];
        const upperBound: number =
          Cloudiness.cloudinessInvertedArray[res[res.length - 1]][1][1];
        return new RangeValue(
          lowerBound,
          upperBound,
          lowerBound,
          upperBound,
          "oktas"
        );
      });
    }
  }
}
