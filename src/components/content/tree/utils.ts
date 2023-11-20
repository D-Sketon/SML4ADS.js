import { MarkerType } from "reactflow";
import { MTree, defaultTree } from "../../../model/Tree";
import {
  BEHAVIOR_TYPES,
  ACCELERATE_BEHAVIOR_PARAMS,
  TURN_BEHAVIOR_PARAMS,
  LANE_OFFSET_BEHAVIOR_PARAMS,
  KEEP_BEHAVIOR_PARAMS,
  CHANGE_BEHAVIOR_PARAMS
} from "../../../model/Behavior";

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
      label: probabilityTransition.weight,
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
  const newTree = defaultTree();
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
        weight: edge.label,
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

export const checkTree = (tree: MTree) => {
  for (const behavior of tree.behaviors) {
    if (behavior.params === null) {
      throw new Error(`Behavior ${behavior.name} has null params!`);
    }
    switch (behavior.name) {
      case BEHAVIOR_TYPES.KEEP:
      case BEHAVIOR_TYPES.IDLE: {
        const params = behavior.params as KEEP_BEHAVIOR_PARAMS;
        const { duration } = params;
        if (duration !== null && duration !== void 0 && (duration as any) !== '') {
          _assertNumberGE(duration, 0, `Behavior ${behavior.name} has negative duration!`);
        }
        break;
      }
      case BEHAVIOR_TYPES.ACCELERATE:
      case BEHAVIOR_TYPES.DECELERATE: {
        const params = behavior.params as ACCELERATE_BEHAVIOR_PARAMS;
        const { acceleration, targetSpeed, duration } = params;
        _assertRequired(acceleration, `Behavior ${behavior.name} has null acceleration!`);
        _assertNumberGE(acceleration, 0, `Behavior ${behavior.name} has negative acceleration!`);

        _assertRequired(targetSpeed, `Behavior ${behavior.name} has null targetSpeed!`);
        _assertNumberGE(targetSpeed, 0, `Behavior ${behavior.name} has negative targetSpeed!`);

        if (duration !== null && duration !== void 0 && (duration as any) !== '') {
          _assertNumberGE(duration, 0, `Behavior ${behavior.name} has negative duration!`);
        }
        break;
      }
      case BEHAVIOR_TYPES.TURN_LEFT:
      case BEHAVIOR_TYPES.TURN_RIGHT: {
        const params = behavior.params as TURN_BEHAVIOR_PARAMS;
        const { acceleration, targetSpeed } = params;
        _assertRequired(acceleration, `Behavior ${behavior.name} has null acceleration!`);
        _assertNumber(acceleration, `Behavior ${behavior.name} has illegal acceleration!`);

        _assertRequired(targetSpeed, `Behavior ${behavior.name} has null targetSpeed!`);
        _assertNumberGE(targetSpeed, 0, `Behavior ${behavior.name} has negative targetSpeed!`);
        break;
      }
      case BEHAVIOR_TYPES.CHANGE_LEFT:
      case BEHAVIOR_TYPES.CHANGE_RIGHT: {
        const params = behavior.params as CHANGE_BEHAVIOR_PARAMS;
        const { acceleration, targetSpeed } = params;
        if (acceleration !== null && acceleration !== void 0 && (acceleration as any) !== '') {
          _assertNumber(acceleration, `Behavior ${behavior.name} has illegal acceleration!`);
        }
        if (targetSpeed !== null && targetSpeed !== void 0 && (targetSpeed as any) !== '') {
          _assertNumberGE(targetSpeed, 0, `Behavior ${behavior.name} has negative targetSpeed!`);
        }
        break;
      }
      case BEHAVIOR_TYPES.LANE_OFFSET: {
        const params = behavior.params as LANE_OFFSET_BEHAVIOR_PARAMS;
        const { offset, acceleration, targetSpeed, duration } = params;
        _assertRequired(offset, `Behavior ${behavior.name} has null offset!`);
        _assertNumber(offset, `Behavior ${behavior.name} has illegal offset!`);

        if (acceleration !== null && acceleration !== void 0 && (acceleration as any) !== '') {
          _assertNumber(acceleration, `Behavior ${behavior.name} has illegal acceleration!`);
        }
        if (targetSpeed !== null && targetSpeed !== void 0 && (targetSpeed as any) !== '') {
          _assertNumberGE(targetSpeed, 0, `Behavior ${behavior.name} has negative targetSpeed!`);
        }
        if (duration !== null && duration !== void 0 && (duration as any) !== '') {
          _assertNumberGE(duration, 0, `Behavior ${behavior.name} has negative duration!`);
        }
        break;
      }
      default:
    }
  }
};

const _assertRequired = (value: any, errMsg: string) => {
  if (value === null || value === void 0 || (value as any) === '') {
    throw new Error(errMsg);
  }
}

const _assertNumber = (value: any, errMsg: string) => {
  if (isNaN(Number(value))) {
    throw new Error(errMsg);
  }
}

const _assertNumberGE = (value: any, min: number, errMsg: string) => {
  _assertNumber(value, errMsg);
  if (Number(value) < min) {
    throw new Error(errMsg);
  }
}