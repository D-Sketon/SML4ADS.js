import { generateAlphanumeric } from "../utils";
import {
  preprocessForComposition,
  preprocessForConditional,
} from "./preprocess";
import composition from "./statements/composition";
import conditional from "./statements/conditional";

export enum ODD_QUALIFIER {
  INCLUDE = "INCLUDE",
  EXCLUDE = "EXCLUDE",
  CONDITIONAL = "CONDITIONAL",
  COMMENT = "COMMENT",
}

export const _odd2Stl = (
  compositionLines: string[],
  conditionalLines: string[],
  extendLines: string[]
): [string[], string[]] => {
  const map = new Map<
    string,
    {
      composition: [ODD_QUALIFIER, string, string];
      conditionals: [ODD_QUALIFIER, string, string, string, string][];
    }
  >();
  const _extends = extendLines.map((e) =>
    preprocessForConditional(e).slice(0, 5)
  ) as [ODD_QUALIFIER, string, string, string, string][];
  const _compositions = compositionLines
    .map((c) => {
      if (c.trim().startsWith("#")) return [ODD_QUALIFIER.COMMENT, c, "", ""];
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
    conditionalStls.push(conditional(v.composition, v.conditionals, _extends));
  }
  return [compositionStls, conditionalStls];
};

const getNextAlphanumeric = generateAlphanumeric();

export const odd2Stl = (odd: string): [string[], string[]] => {
  if (odd.trim() === "") return [[], []];
  const lines = odd
    .split("\n")
    .join("\n")
    .split(/\n\s*\n/);
  const compositionLines: string[] = [];
  const conditionalLines: string[] = [];
  const extendLines: string[] = [];
  for (const line of lines) {
    if (line.trim().startsWith("#")) {
      compositionLines.push(line.trim());
      continue;
    }
    if (line.trim().startsWith("__Extend__")) {
      extendLines.push(line.trim());
      continue;
    }
    if (line.trim().startsWith(ODD_QUALIFIER.CONDITIONAL)) {
      const flag = getNextAlphanumeric();
      line
        .split("\n")
        .map((v) => v.trim())
        .filter((v) => v)
        .forEach((l, index) => {
          if (index === 0) {
            compositionLines.push(`Cond_${flag} ${l.trim()}`);
          } else {
            conditionalLines.push(`Cond_${flag} ${l.trim()}`);
          }
        });
    } else {
      compositionLines.push(line.trim());
    }
  }
  return _odd2Stl(compositionLines, conditionalLines, extendLines);
};
