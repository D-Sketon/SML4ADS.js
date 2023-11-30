import { MarkerType } from "reactflow";
import { MTree, defaultEmptyTree } from "../../../../model/Tree";

export type CustomNode = {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
};

export type CustomEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  label: string;
  markerEnd: { type: MarkerType };
};

export const tree2Node = (
  tree: MTree,
  setNodes: any
): {
  maxId: number;
  nodes: CustomNode[];
  edges: CustomEdge[];
} => {
  const nodes: CustomNode[] = [];
  const edges: CustomEdge[] = [];
  let maxId = 0;
  tree.behaviors.forEach((behavior) => {
    const newNode = {
      id: String(behavior.id),
      type: "BehaviorNode",
      data: {
        label: behavior.name,
        params: behavior.params,
        setNodes: setNodes,
        id: String(behavior.id),
      },
      position: { x: behavior.position.x, y: behavior.position.y },
    };
    maxId = Math.max(maxId, behavior.id);
    nodes.push(newNode);
  });
  tree.branchPoints.forEach((branchPoint) => {
    const newNode = {
      id: String(branchPoint.id),
      type: "BranchNode",
      data: {
        setNodes: setNodes,
        id: String(branchPoint.id),
      },
      position: { x: branchPoint.position.x, y: branchPoint.position.y },
    };
    maxId = Math.max(maxId, branchPoint.id);
    nodes.push(newNode);
  });
  tree.commonTransitions.forEach((commonTransition) => {
    const newEdge = {
      id: String(commonTransition.id),
      source: String(commonTransition.sourceId),
      target: String(commonTransition.targetId),
      type: "CommonTransition",
      label: commonTransition.guard,
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    maxId = Math.max(maxId, commonTransition.id);
    edges.push(newEdge);
  });
  tree.probabilityTransitions.forEach((probabilityTransition) => {
    const newEdge = {
      id: String(probabilityTransition.id),
      source: String(probabilityTransition.sourceId),
      target: String(probabilityTransition.targetId),
      type: "ProbabilityTransition",
      label: JSON.stringify(probabilityTransition.weight),
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    maxId = Math.max(maxId, probabilityTransition.id);
    edges.push(newEdge);
  });
  return { maxId, nodes, edges };
};

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

export const node2Tree = (nodes: CustomNode[], edges: CustomEdge[]): MTree => {
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
