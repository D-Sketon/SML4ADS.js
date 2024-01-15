import { ODD_QUALIFIER } from "..";
import RangeValue from "../value/RangeValue";
import valueConverter from "../value/valueConverter";
import { normalizeAttribute, space2_ } from "../../utils";
import Wind from "../environment/Wind";
import Rainfall from "../environment/Rainfall";
import Snowfall from "../environment/Snowfall";
import Cloudiness from "../environment/Cloudiness";
import valueMatch from "./valueMatch";

/**
 *
 * @param odd composition statements
 */
const composition = (odd: [ODD_QUALIFIER, string, string]): string => {
  const attribute = space2_(normalizeAttribute(odd[1]));
  const valuePostConvert = valueConverter(odd[2]);
  let attributeValue: string;
  let instantiateValue: RangeValue[] | undefined;
  // 可以实例化的attribute进行特殊处理
  if (attribute === "wind") {
    instantiateValue = Wind.instantiate(valuePostConvert);
  } else if (attribute === "rainfall") {
    instantiateValue = Rainfall.instantiate(valuePostConvert);
  } else if (attribute === "snowfall") {
    instantiateValue = Snowfall.instantiate(valuePostConvert);
  } else if (attribute === "cloudiness") {
    instantiateValue = Cloudiness.instantiate(valuePostConvert);
  }
  if (instantiateValue !== undefined) {
    attributeValue = instantiateValue
      .map((v) => {
        if (v.min === v.max) {
          // min === max 退化为等于
          return `${attribute}==${v.min}`;
        } else {
          let returnValue: string;
          if (v.max === Infinity) {
            returnValue = `${attribute}>=${v.min}`;
          } else if (v.min === -Infinity) {
            returnValue = `${attribute}<=${v.max}`;
          } else {
            returnValue = `${attribute}>=${v.min} and ${attribute}<=${v.max}`;
          }
          if (instantiateValue!.length > 1 && returnValue.includes("and")) {
            return `(${returnValue})`;
          }
          return returnValue;
        }
      })
      .join(" or ");
  } else {
    attributeValue = valueMatch(valuePostConvert, attribute);
  }

  switch (odd[0]) {
    case ODD_QUALIFIER.INCLUDE:
      return `always[0:inf] (${attributeValue})`;
    case ODD_QUALIFIER.EXCLUDE:
      return `always[0:inf] (not(${attributeValue}))`;
    default:
      throw new Error("unsupported ODD_QUALIFIER");
  }
};

export default composition;
