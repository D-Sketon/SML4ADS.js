import {
  preprocessForComposition,
  preprocessForConditional,
} from "./preprocess";
import composition from "./statements/composition";
import conditional from "./statements/conditional";

export enum ODD_QUALIFIER {
  INCLUDE = "Include",
  EXCLUDE = "Exclude",
  CONDITIONAL = "Conditional",
}

const Odd2Stl = (
  compositionLines: string[],
  conditionalLines: string[]
): [string[], string[]] => {
  const map = new Map<
    string,
    {
      composition: [ODD_QUALIFIER, string, string];
      conditionals: [ODD_QUALIFIER, string, string, string, string][];
    }
  >();
  const _compositions = compositionLines
    .map((c) => {
      const v = preprocessForComposition(c);
      if (v[3] !== "") {
        map.set(v[3], {
          composition: [v[0], v[1], v[2]],
          conditionals: [],
        });
      }
      if (v[0] === ODD_QUALIFIER.CONDITIONAL) {
        // conditional qualifier 放在之后处理
        return undefined;
      }
      return [v[0], v[1], v[2]];
    })
    .filter((v) => v !== undefined) as [ODD_QUALIFIER, string, string][];
  const compositionStls = _compositions.map(composition);
  conditionalLines.forEach((c) => {
    const v = preprocessForConditional(c);
    if (map.has(v[5])) {
      map.get(v[5])!.conditionals.push([v[0], v[1], v[2], v[3], v[4]]);
    } else {
      throw new Error("invalid input");
    }
  });
  const conditionalStls: string[] = [];
  for (const v of map.values()) {
    conditionalStls.push(conditional(v.composition, v.conditionals));
  }
  return [compositionStls, conditionalStls];
};

export default Odd2Stl;
