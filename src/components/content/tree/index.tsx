import React, { ReactElement, useCallback, useState } from "react";
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
import { BehaviorType } from "./constant";
import { Col, Drawer, InputNumber, Row } from "antd";
import TextArea from "antd/es/input/TextArea";

const nodeTypes = {
  BehaviorNode,
  BranchNode,
};

const edgeTypes = {
  CommonTransition,
  ProbabilityTransition,
};

const initialNodes = [
  {
    id: "1",
    type: "BehaviorNode",
    data: {
      label: "BehaviorNode-1",
      initialValues: {
        behavior: BehaviorType.KEEP,
      },
    },
    position: { x: 150, y: 0 },
  },
  {
    id: "2",
    type: "BehaviorNode",
    data: {
      label: "BehaviorNode-2",
      initialValues: {
        behavior: BehaviorType.KEEP,
      },
    },
    position: { x: 0, y: 150 },
  },
  {
    id: "3",
    type: "BehaviorNode",
    data: {
      label: "BehaviorNode-3",
      initialValues: {
        behavior: BehaviorType.KEEP,
      },
    },
    position: { x: 300, y: 150 },
  },
  {
    id: "4",
    type: "BehaviorNode",
    data: {
      label: "BehaviorNode-4",
      initialValues: {
        behavior: BehaviorType.KEEP,
      },
    },
    position: { x: 0, y: 300 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "CommonTransition",
    label: "111",
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    label: "40",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    label: "111",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

let id = 5;

const getId = () => `${id++}`;

interface TreeProps {
  path: string;
}

function Tree(props: TreeProps): ReactElement {
  const { path } = props;
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");

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
      if (type === "BranchNode") {
        setEdges((eds) =>
          addEdge(
            {
              ...connection,
              type: "ProbabilityTransition",
              label: 0,
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
              markerEnd: { type: MarkerType.ArrowClosed },
            },
            eds
          )
        );
      }
    },
    [setEdges, nodes]
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
      const newNode = {
        id,
        type,
        position,
        data: {
          label: `${type}-${id}`,
          initialValues: {
            behavior: BehaviorType.KEEP,
          },
        },
      };

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
                    defaultValue={selectedEdge?.label?.toString() ?? ""}
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
                    defaultValue={
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
