import React, { ReactElement, useCallback } from "react";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import BehaviorNode from "./BehaviorNode";

import "./index.less";

const nodeTypes = {
  BehaviorNode,
};

const initialNodes = [
  {
    id: "1",
    data: { label: "Node 1" },
    position: { x: 150, y: 0 },
  },
  {
    id: "2",
    type: 'BehaviorNode',
    data: { label: "Node 2" },
    position: { x: 0, y: 150 },
  },
  {
    id: "3",
    data: { label: "Node 3" },
    position: { x: 300, y: 150 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];

function Tree(): ReactElement {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ overflow: "auto", height: "100%", backgroundColor: "#fff" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
      </ReactFlow>
    </div>
  );
}

export default Tree;
