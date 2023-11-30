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
import BehaviorNode from "./node/BehaviorNode";
import BranchNode from "./node/BranchNode";
import CommonTransition from "./transition/CommonTransition";
import ProbabilityTransition from "./transition/ProbabilityTransition";

import "./index.less";
import ElementProvider from "./ElementProvider";
import { notification, Drawer } from "antd";
import { MTree } from "../../../model/Tree";
import {
  BEHAVIOR_TYPES,
  defaultKeepBehaviorParams,
} from "../../../model/Behavior";
import { checkTree } from "./utils/check";
import { node2Tree, tree2Node } from "./utils/convert";
import GuardDrawer from "./drawer/GuardDrawer";
import WeightDrawer from "./drawer/WeightDrawer";
import { WEIGHT_TYPES } from "../../../model/params/ParamWeight";

const nodeTypes = {
  BehaviorNode,
  BranchNode,
};

const edgeTypes = {
  CommonTransition,
  ProbabilityTransition,
};

interface TreeProps {
  path: string;
}

/**
 * support old version
 * @param tree Old tree
 * @returns New tree
 */
function compatibleOldTree(tree: MTree): MTree {
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
  return newTree;
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

  const saveHook = useCallback(
    async (isManual = false) => {
      try {
        const newTree = node2Tree(nodes as any, edges as any);
        checkTree(newTree);
        await window.electronAPI.writeJson(path, newTree);
      } catch (error: any) {
        console.error(error);
        isManual &&
          notification.error({
            message: "Error",
            description: error.message,
          });
      }
    },
    [nodes, edges, path]
  );

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      if (!content) return;
      const tree: MTree = compatibleOldTree(JSON.parse(content));
      // check tree
      try {
        checkTree(tree);
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.message,
        });
        return;
      }
      const { maxId, nodes, edges } = tree2Node(tree, setNodes);
      setNodes(nodes);
      setEdges(edges);
      maxIdRef.current = maxId + 1;
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  // onUnmounted
  // has bug, so ignore
  // useEffect(() => {
  //   return () => {
  //     const asyncFn = async () => {
  //       await saveHook();
  //     };
  //     asyncFn();
  //   };
  // }, [saveHook]);

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
              label: "",
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
      const newNode =
        type === "BehaviorNode"
          ? {
              id,
              type,
              position,
              data: {
                label: BEHAVIOR_TYPES.KEEP,
                params: defaultKeepBehaviorParams(),
                setNodes: setNodes,
                id,
              },
            }
          : {
              id,
              type,
              position,
              data: {
                setNodes: setNodes,
                id,
              },
            };

      setNodes((nds) => nds.concat(newNode));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reactFlowInstance]
  );

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
            <GuardDrawer selectedEdge={selectedEdge} setEdges={setEdges} />
          ) : (
            <WeightDrawer selectedEdge={selectedEdge} setEdges={setEdges} />
          )}
        </Drawer>
      </ReactFlowProvider>
    </div>
  );
}

export default Tree;
