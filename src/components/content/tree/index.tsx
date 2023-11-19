import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  EdgeSelectionChange,
  MarkerType,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import BehaviorNode from "./BehaviorNode";
import BranchNode from "./BranchNode";
import CommonTransition from "./CommonTransition";
import ProbabilityTransition from "./ProbabilityTransition";

import "./index.less";
import ElementProvider from "./ElementProvider";
import { Col, Drawer, InputNumber, Row, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { MTree, defaultTree } from "../../../model/Tree";
import { BEHAVIOR_TYPES, defaultKeepBehaviorParams } from "../../../model/Behavior";

const nodeTypes = {
  BehaviorNode,
  BranchNode,
};

const edgeTypes = {
  CommonTransition,
  ProbabilityTransition,
};

type CustomNode = {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
};

type CustomEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
  label: string;
  markerEnd: { type: MarkerType };
};

const tree2Node = (
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

const node2Tree = (nodes: CustomNode[], edges: CustomEdge[]): MTree => {
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

interface TreeProps {
  path: string;
}

function Tree(props: TreeProps): ReactElement {
  const { path } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const maxIdRef = useRef(0);

  const getId = useCallback(() => {
    return `${maxIdRef.current++}`;
  }, []);

  const saveHook = useCallback(async (isManual = false) => {
    try {
      const newTree = node2Tree(nodes as any, edges as any);
      // TODO CHECK
      await window.electronAPI.writeJson(path, newTree);
    } catch (error: any) {
      isManual && notification.error({
        message: "Error",
        description: error.message,
      });
      return;
    }
  }, [nodes, edges, path]);

  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      if (content) {
        const tree: MTree = JSON.parse(content);
        const { maxId, nodes, edges } = tree2Node(tree, setNodes);
        setNodes(nodes);
        setEdges(edges);
        maxIdRef.current = maxId;
      }
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    return () => {
      const asyncFn = async () => {
        await saveHook();
      };
      asyncFn();
    };
  }, [saveHook]);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      await saveHook(true);
      event.preventDefault();
    }
  };

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      let selectedId: string = "";
      for (let i = 0; i < changes.length; i++) {
        if (
          (changes[i] as EdgeSelectionChange).type === "select" &&
          (changes[i] as EdgeSelectionChange).selected === true
        ) {
          selectedId = (changes[i] as EdgeSelectionChange).id;
          break;
        }
      }
      if (selectedId) {
        const selectedEdge = edges.find((edge) => edge.id === selectedId);
        if (selectedEdge) {
          setSelectedEdge(selectedEdge);
          setDrawerTitle(selectedEdge.type!);
        }
        // open drawer
        setDrawerVisible(true);
      } else {
        setSelectedEdge(null);
        setDrawerVisible(false);
      }
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      const type = nodes.find((node) => node.id === connection.source)!.type;
      const id = getId();
      if (type === "BranchNode") {
        setEdges((eds) =>
          addEdge(
            {
              ...connection,
              type: "ProbabilityTransition",
              label: 0,
              id,
              markerEnd: { type: MarkerType.ArrowClosed },
            },
            eds
          )
        );
      } else {
        setEdges((eds) =>
          addEdge(
            {
              ...connection,
              type: "CommonTransition",
              label: '',
              id,
              markerEnd: { type: MarkerType.ArrowClosed },
            },
            eds
          )
        );
      }
    },
    [nodes, getId, setEdges]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = (reactFlowInstance as any).screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const id = getId();
      const newNode = type === "BehaviorNode" ? ({
        id,
        type,
        position,
        data: {
          label: BEHAVIOR_TYPES.KEEP,
          params: defaultKeepBehaviorParams(),
          setNodes: setNodes,
          id,
        },
      }) : ({
        id,
        type,
        position,
        data: {
          setNodes: setNodes,
          id,
        },
      });

      setNodes((nds) => nds.concat(newNode));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reactFlowInstance]
  );

  function handleWeightChange(value: number | null) {
    if (selectedEdge) {
      selectedEdge.label = value;
      setEdges((eds) => {
        return eds
          .filter((edge) => edge.id !== selectedEdge.id)
          .concat(selectedEdge);
      });
    }
  }

  function handleGuardChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (selectedEdge) {
      selectedEdge.label = event.target.value;
      setEdges((eds) => {
        return eds
          .filter((edge) => edge.id !== selectedEdge.id)
          .concat(selectedEdge);
      });
    }
  }

  return (
    <div
      style={{
        overflow: "hidden",
        height: "100%",
        backgroundColor: "#fff",
        position: "relative",
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <ReactFlowProvider>
        <ElementProvider />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          // @ts-ignore
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Background />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
        <Drawer
          title={drawerTitle}
          placement="right"
          open={drawerVisible}
          getContainer={false}
          mask={false}
          onClose={() => setDrawerVisible(false)}
        >
          {drawerTitle === "CommonTransition" ? (
            <>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col span={4}>guard:</Col>
                <Col span={20}>
                  <TextArea
                    rows={3}
                    maxLength={1024}
                    value={selectedEdge?.label?.toString() ?? ""}
                    onChange={handleGuardChange}
                  />
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row style={{ display: "flex", alignItems: "center" }}>
                <Col span={6}>weight:</Col>
                <Col span={18}>
                  <InputNumber
                    min={0}
                    max={100}
                    value={
                      selectedEdge?.label?.toString()
                        ? parseInt(selectedEdge?.label?.toString())
                        : 0
                    }
                    onChange={handleWeightChange}
                  />
                </Col>
              </Row>
            </>
          )}
        </Drawer>
      </ReactFlowProvider>
    </div>
  );
}

export default Tree;
