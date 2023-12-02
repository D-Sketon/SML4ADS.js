import { MTree, defaultEmptyTree } from "../../../../../model/Tree";
import { CustomEdge, CustomNode } from "./types";

const _preprocessParams = (_params: any) => {
  const params = {
    ..._params,
  };
  for (let key in params) {
    if (params[key] === null) {
      params[key] = "";
    }
  }
  return params;
};

const nodeTreeAdapter = (nodes: CustomNode[], edges: CustomEdge[]): MTree => {
  const newTree = defaultEmptyTree();
  nodes.forEach((node) => {
    if (node.type === "BehaviorNode") {
      const behavior = {
        id: parseInt(node.id),
        name: node.data.label,
        params: _preprocessParams(node.data.params),
        position: node.position,
      };
      newTree.behaviors.push(behavior);
    } else if (node.type === "BranchNode") {
      const branchPoint = {
        id: parseInt(node.id),
        position: node.position,
      };
      newTree.branchPoints.push(branchPoint);
    }
  });
  // also find the root node
  const hasTargetRootId = new Set<number>();
  edges.forEach((edge) => {
    if (edge.type === "CommonTransition") {
      const commonTransition = {
        id: parseInt(edge.id),
        sourceId: parseInt(edge.source),
        targetId: parseInt(edge.target),
        guard: edge.label,
      };
      hasTargetRootId.add(parseInt(edge.target));
      newTree.commonTransitions.push(commonTransition);
    } else if (edge.type === "ProbabilityTransition") {
      const probabilityTransition = {
        id: parseInt(edge.id),
        sourceId: parseInt(edge.source),
        targetId: parseInt(edge.target),
        weight: JSON.parse(edge.label),
      };
      hasTargetRootId.add(parseInt(edge.target));
      newTree.probabilityTransitions.push(probabilityTransition);
    }
  });
  // find the root node
  const rootIds: number[] = [];
  nodes.forEach((node) => {
    if (!hasTargetRootId.has(parseInt(node.id))) {
      rootIds.push(parseInt(node.id));
    }
  });
  if (rootIds.length === 1) {
    newTree.rootId = rootIds[0];
  } else {
    // illegal tree
    throw new Error("The tree must have only one root node!");
  }
  return newTree;
};

export default nodeTreeAdapter;
