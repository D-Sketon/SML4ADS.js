import { MarkerType } from "reactflow";
import { MTree } from "../../../../../model/Tree";
import { CustomEdge, CustomNode } from "./types";

const treeNodeAdapter = (
  tree: MTree,
  setNodes: any,
  nodeType = "BehaviorNode"
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
      type: nodeType,
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

export default treeNodeAdapter;
