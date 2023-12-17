import { ReactElement } from "react";
import ReactFlow, { ReactFlowProvider, Controls } from "reactflow";

interface AdsmlTreeProps {
  style?: React.CSSProperties;
  className?: string;
  nodes: any;
  edges: any;
  nodeTypes: any;
  edgeTypes: any;
}

export default function AdsmlTree({
  style,
  nodes,
  edges,
  nodeTypes,
  edgeTypes,
  className,
}: AdsmlTreeProps): ReactElement {
  return (
    <div style={style} className={className}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        >
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
