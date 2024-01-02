import { ODD_QUALIFIER } from ".";

/**
 *
 * @param line like Include lane marking is [2, 5]
 * @returns [ODD_QUALIFIER, attribute, value, condition_name]
 */
export const preprocessForComposition = (
  line: string
): [ODD_QUALIFIER, string, string, string] => {
  const res: [ODD_QUALIFIER, string, string, string] = [
    ODD_QUALIFIER.INCLUDE,
    "",
    "",
    "",
  ];
  line = line.replace(/\s+/g, " ");
  const regex = new RegExp(
    `^(${ODD_QUALIFIER.INCLUDE}|${ODD_QUALIFIER.EXCLUDE}|([^ ]+?) ${ODD_QUALIFIER.CONDITIONAL}) (.+)$`
  );
  const fistMatchResult = line.match(regex);

  if (fistMatchResult !== null) {
    const qualifier = fistMatchResult[1];
    const condition = fistMatchResult[2];
    const core = fistMatchResult[3];
    if (qualifier === ODD_QUALIFIER.INCLUDE) {
      res[0] = ODD_QUALIFIER.INCLUDE;
    } else if (qualifier === ODD_QUALIFIER.EXCLUDE) {
      res[0] = ODD_QUALIFIER.EXCLUDE;
    } else if (qualifier.split(" ").pop() === ODD_QUALIFIER.CONDITIONAL) {
      res[0] = ODD_QUALIFIER.CONDITIONAL;
      res[3] = condition;
    }
    line = core;
  } else {
    throw new Error("invalid input");
  }

  const matchResult = line.match(/([^]+?) (is|are) \[([^]+)\]/);
  if (matchResult !== null) {
    res[1] = matchResult[1].trim();
    res[2] = matchResult[3];
  } else {
    throw new Error("invalid input");
  }
  return res;
};

/**
 *
 * @param line like Cond_1 Include speed of subject vehicle for [minor roads] is [0, 15 km/h]
 * @returns [ODD_QUALIFIER, metrics, influencing attribute, influenced attribute, value, condition_name]
 */
export const preprocessForConditional = (
  line: string
): [ODD_QUALIFIER, string, string, string, string, string] => {
  const res: [ODD_QUALIFIER, string, string, string, string, string] = [
    ODD_QUALIFIER.INCLUDE,
    "",
    "",
    "",
    "",
    "",
  ];
  line = line.replace(/\s+/g, " ");
  const regex = new RegExp(
    `^([^ ]+?) (${ODD_QUALIFIER.INCLUDE}|${ODD_QUALIFIER.EXCLUDE}) (.+)$`
  );
  const fistMatchResult = line.match(regex);

  if (fistMatchResult !== null) {
    const condition = fistMatchResult[1];
    const qualifier = fistMatchResult[2];
    const core = fistMatchResult[3];
    if (qualifier === ODD_QUALIFIER.INCLUDE) {
      res[0] = ODD_QUALIFIER.INCLUDE;
    } else if (qualifier === ODD_QUALIFIER.EXCLUDE) {
      res[0] = ODD_QUALIFIER.EXCLUDE;
    }
    res[5] = condition;
    line = core;
  } else {
    throw new Error("invalid input");
  }
  const matchResult = line.match(
    /(\w+) of \[?([^\]]+?)\]?(?: for \[?([^\]]*)\]?)? (is|are) \[([^]+)\]/
  );

  if (matchResult !== null) {
    res[1] = matchResult[1];
    res[2] = matchResult[2];
    res[3] = matchResult[3] || "";
    res[4] = matchResult[5];
  } else {
    throw new Error("invalid input");
  }
  return res;
};
