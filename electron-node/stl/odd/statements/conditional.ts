import { ODD_QUALIFIER } from "..";
import { normalizeAttribute, space2_ } from "../../utils";
import EnumValue from "../value/enumValue";
import valueConverter from "../value/valueConverter";
import valueMatch from "./valueMatch";

/**
 * support [include, exclude] speed of [ITEMS] for [POSITION] is [VALUE]
 * support [include, exclude]
 * @param baseOdd base compositional statements
 * @param conditionalOdd conditional statements[]
 * only support speed, location, radius
 */
const conditional = (
  baseOdd: [ODD_QUALIFIER, string, string],
  conditionalOdd: [ODD_QUALIFIER, string, string, string, string][],
  extendLines: [ODD_QUALIFIER, string, string, string, string][]
): string => {
  const baseAttribute = space2_(normalizeAttribute(baseOdd[1]));
  const basePostConvert = valueConverter(baseOdd[2]);
  const attributeValues: string[] = [];
  attributeValues.push(valueMatch(basePostConvert, baseAttribute));
  if (basePostConvert instanceof EnumValue) {
    extendLines.forEach((e) => {
      // 含有该属性，且没被重写
      if (
        basePostConvert.value.includes(space2_(e[3])) &&
        !conditionalOdd.some((c) => {
          const converter = valueConverter(c[3]);
          if (converter instanceof EnumValue) {
            return (
              converter.value.includes(space2_(e[3])) && c[1] === e[1] && c[2] === e[2]
            );
          } else {
            return false;
          }
        })
      ) {
        conditionalOdd.push(e);
      }
    });
  }
  conditionalOdd.forEach((c) => {
    if (c[3] === "") {
      const valuePostConvert = valueConverter(c[4]);
      const influencingAttributeArray = c[2]
        .split(",")
        .map((c) => space2_(c.trim()));
      influencingAttributeArray.forEach((influencingAttribute) => {
        const attribute = `${space2_(influencingAttribute)}_${space2_(c[1])}`;
        const attributeValue = valueMatch(valuePostConvert, attribute);
        if (c[0] === ODD_QUALIFIER.EXCLUDE) {
          attributeValues.push(`not(${attributeValue})`);
        } else {
          attributeValues.push(attributeValue);
        }
      });
    } else {
      const valuePostConvert = valueConverter(c[4]);
      const influencingAttributeArray = c[2]
        .split(",")
        .map((c) => space2_(c.trim()));
      if (c[1].includes("speed")) {
        // 某个位置的速度
        influencingAttributeArray.forEach((influencingAttribute) => {
          const attribute = `${space2_(c[1])}_${space2_(influencingAttribute)}`;
          const attributeValue = valueMatch(valuePostConvert, attribute);
          const conditionAttribute = `location_${space2_(
            influencingAttribute
          )}`;
          const conditionPostConvert = valueConverter(c[3]);
          const conditionAttributeValue = valueMatch(
            conditionPostConvert,
            conditionAttribute
          );
          let implies = `(${conditionAttributeValue}) -> (${attributeValue})`;
          if (c[0] === ODD_QUALIFIER.EXCLUDE) {
            implies = `not(${implies})`;
          }
          attributeValues.push(implies);
        });
      }
    }
  });

  return `always[0:inf] (${
    attributeValues.length > 1
      ? attributeValues.map((a) => `(${a})`).join(" and ")
      : attributeValues[0]
  })`;
};

export default conditional;
