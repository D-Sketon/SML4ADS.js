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

function AdsmlTree(props: AdsmlTreeProps): ReactElement {
  const { style, nodes, edges, nodeTypes, edgeTypes, className } = props;
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

export default AdsmlTree;
