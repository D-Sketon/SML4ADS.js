import { ReactElement } from "react";
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from "reactflow";

function CommonTransition({ id, sourceX, sourceY, targetX, targetY, label, markerEnd }: any): ReactElement {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd}/>
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            backgroundColor: 'white',
            padding: '1px',
            fontSize: '12px',
          }}
          className="nodrag nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default CommonTransition;