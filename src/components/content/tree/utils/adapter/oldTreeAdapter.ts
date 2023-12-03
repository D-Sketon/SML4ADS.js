import { MTree } from "../../../../../model/Tree";
import { WEIGHT_TYPES } from "../../../../../model/params/ParamWeight";

/**
 * support old version
 * @param tree Old tree
 * @returns New tree
 */
function oldTreeAdapter(tree: MTree): MTree {
  const newTree = { ...tree };
  newTree.probabilityTransitions.forEach((edge) => {
    if (typeof edge.weight === "number" || typeof edge.weight === "string") {
      // old version
      edge.weight = {
        type: WEIGHT_TYPES.MANUAL,
        params: {
          weight: parseInt(edge.weight),
        },
      };
    }
  });
  newTree.behaviors.forEach((behavior) => {
    for (const [key, value] of Object.entries(behavior.params)) {
      if (!Array.isArray(value)) {
        // @ts-ignore
        behavior.params[key] = [value, value];
      }
      // @ts-ignore
      behavior.params[key] = behavior.params[key].map((v) =>
        v === "" ? null : v
      );
    }
  });
  return newTree;
}

export default oldTreeAdapter;
