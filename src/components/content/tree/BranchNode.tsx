import { ReactElement, memo } from "react";
import { Handle, Position } from "reactflow";

function BehaviorNode({ data, isConnectable }: any): ReactElement {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
}
export default memo(BehaviorNode);
