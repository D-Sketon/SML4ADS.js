import {
  BERNOULLI_DISTRIBUTION_WEIGHT_PARAMS,
  BINOMIAL_DISTRIBUTION_WEIGHT_PARAMS,
  CHI_SQUARED_DISTRIBUTION_WEIGHT_PARAMS,
  MANUAL_WEIGHT_PARAMS,
  NORMAL_DISTRIBUTION_WEIGHT_PARAMS,
  POISSON_DISTRIBUTION_WEIGHT_PARAMS,
  UNIFORM_DISTRIBUTION_WEIGHT_PARAMS,
  WEIGHT_TYPES,
} from "../../src/model/params/ParamWeight";
import { MTree } from "../../src/model/Tree";
import T from "./zip";

type BehaviorNode = {
  id: number;
  params: any;
  complexity: number;
  probability: number; // from parent
  children: BehaviorNode[];
};

export const evaluateTree = (_e: any, _tree: MTree) => {
  const tree = _buildProbability(_buildTree(_tree));
  return _evaluatePath(tree);
};

const _evaluateNode = (params: Record<string, any>) => {
  let paramSum = 0;
  let paramCount = 0;
  for (const key in params) {
    if (Array.isArray(params[key])) {
      paramCount++;
      if (params[key][0] != null && params[key][1] != null) {
        paramSum += T(params[key][1] - params[key][0]) + 1;
      } else {
        paramSum += 1;
      }
    }
  }
  if (paramCount > 0) return paramSum / paramCount;
  return 1;
};

const _buildTree = (tree: MTree) => {
  const root = tree.behaviors.find((behavior) => behavior.id === tree.rootId)!;
  const rootNode: BehaviorNode = {
    id: root.id,
    params: root.params,
    complexity: _evaluateNode(root.params),
    probability: 1,
    children: [],
  };
  const stack = [rootNode];
  while (stack.length > 0) {
    const node = stack.pop()!;
    const commonChildren = tree.commonTransitions.filter(
      (transition) => transition.sourceId === node.id
    );
    for (const child of commonChildren) {
      const behavior = tree.behaviors.find(
        (behavior) => behavior.id === child.targetId
      );
      if (behavior) {
        const behaviorNode: BehaviorNode = {
          id: behavior.id,
          params: behavior.params,
          complexity: _evaluateNode(behavior.params),
          probability: 1,
          children: [],
        };
        node.children.push(behaviorNode);
        stack.push(behaviorNode);
      }
      const branchPoint = tree.branchPoints.find(
        (branchPoint) => branchPoint.id === child.targetId
      );
      if (branchPoint) {
        const behaviorNode: BehaviorNode = {
          id: branchPoint.id,
          params: {},
          complexity: -1,
          probability: 1,
          children: [],
        };
        node.children.push(behaviorNode);
        stack.push(behaviorNode);
      }
    }
    const probabilityChildren = tree.probabilityTransitions.filter(
      (transition) => transition.sourceId === node.id
    );
    for (const child of probabilityChildren) {
      let probability = 1;
      const { weight } = child;
      if (weight.type === WEIGHT_TYPES.MANUAL) {
        probability = (weight.params as MANUAL_WEIGHT_PARAMS).weight;
      } else if (weight.type === WEIGHT_TYPES.UNIFORM_DISTRIBUTION) {
        const { a, b } = weight.params as UNIFORM_DISTRIBUTION_WEIGHT_PARAMS;
        probability = (a + b) / 2;
      } else if (weight.type === WEIGHT_TYPES.NORMAL_DISTRIBUTION) {
        const { mean } = weight.params as NORMAL_DISTRIBUTION_WEIGHT_PARAMS;
        probability = mean;
      } else if (weight.type === WEIGHT_TYPES.BERNOULLI_DISTRIBUTION) {
        const { p } = weight.params as BERNOULLI_DISTRIBUTION_WEIGHT_PARAMS;
        probability = p;
      } else if (weight.type === WEIGHT_TYPES.BINOMIAL_DISTRIBUTION) {
        const { n, p } = weight.params as BINOMIAL_DISTRIBUTION_WEIGHT_PARAMS;
        probability = n * p;
      } else if (weight.type === WEIGHT_TYPES.POISSON_DISTRIBUTION) {
        const { lambda } = weight.params as POISSON_DISTRIBUTION_WEIGHT_PARAMS;
        probability = lambda;
      } else if (weight.type === WEIGHT_TYPES.CHI_SQUARED_DISTRIBUTION) {
        const { k } = weight.params as CHI_SQUARED_DISTRIBUTION_WEIGHT_PARAMS;
        probability = k;
      }
      const behavior = tree.behaviors.find(
        (behavior) => behavior.id === child.targetId
      );
      if (behavior) {
        const behaviorNode: BehaviorNode = {
          id: behavior.id,
          params: behavior.params,
          complexity: _evaluateNode(behavior.params),
          probability,
          children: [],
        };
        node.children.push(behaviorNode);
        stack.push(behaviorNode);
      }
      const branchPoint = tree.branchPoints.find(
        (branchPoint) => branchPoint.id === child.targetId
      );
      if (branchPoint) {
        const behaviorNode: BehaviorNode = {
          id: branchPoint.id,
          params: {},
          complexity: -1,
          probability,
          children: [],
        };
        node.children.push(behaviorNode);
        stack.push(behaviorNode);
      }
    }
  }
  return rootNode;
};

const _buildProbability = (tree: BehaviorNode) => {
  const stack = [tree];
  while (stack.length > 0) {
    const node = stack.pop()!;
    let probability = 0;
    for (const child of node.children) {
      probability += child.probability;
    }
    for (const child of node.children) {
      child.probability /= probability;
      stack.push(child);
    }
    if (node.complexity === -1) {
      node.complexity = node.children.length - 1;
    }
  }
  return tree;
};

const _evaluatePath = (tree: BehaviorNode) => {
  let sum = 0;
  const stack = [tree];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (node.children.length === 0) {
      sum += node.complexity * node.probability;
    }
    for (const child of node.children) {
      // update probability
      child.probability *= node.probability;
      // update complexity
      child.complexity += node.complexity;
      stack.push(child);
    }
  }
  return sum.toFixed(2);
};
