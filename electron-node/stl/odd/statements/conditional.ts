import { ODD_QUALIFIER } from "..";
import { space2_ } from "../../utils";
import valueConverter from "../value/valueConverter";
import valueMatch from "./valueMatch";

/**
 * support [include, exclude] speed of [ITEMS] for [POSITION] is [VALUE]
 * support [include, exclude] location of [ITEMS] is [VALUE]
 * support [include, exclude]
 * @param baseOdd base compositional statements
 * @param conditionalOdd conditional statements[]
 * only support speed, location, radius
 */
const conditional = (
  baseOdd: [ODD_QUALIFIER, string, string],
  conditionalOdd: [ODD_QUALIFIER, string, string, string, string][]
): string => {
  const baseAttribute = space2_(baseOdd[1]);
  const basePostConvert = valueConverter(baseOdd[2]);
  const attributeValues: string[] = [];
  attributeValues.push(valueMatch(basePostConvert, baseAttribute));
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
      const influencingAttributeArray = c[2].split(",").map((c) => space2_(c.trim()));
      if (c[1].includes("speed")) {
        // 某个位置的速度
        influencingAttributeArray.forEach((influencingAttribute) => {
          const attribute = `${space2_(influencingAttribute)}_${space2_(c[1])}`;
          const attributeValue = valueMatch(valuePostConvert, attribute);
          const conditionAttribute = `${space2_(influencingAttribute)}_location`;
          const conditionPostConvert = valueConverter(c[3]);
          const conditionAttributeValue = valueMatch(
            conditionPostConvert,
            conditionAttribute
          );
          let implies = `(${conditionAttributeValue}) implies (${attributeValue})`;
          if (c[0] === ODD_QUALIFIER.EXCLUDE) {
            implies = `not(${implies})`;
          }
          attributeValues.push(implies);
        });
      }
    }
  });

  return `always[t_i:t_e] (${
    attributeValues.length > 1
      ? attributeValues.map((a) => `(${a})`).join(" and ")
      : attributeValues[0]
  })`;
};

export default conditional;
