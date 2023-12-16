import { ReactElement, memo } from "react";
import { Handle, Position } from "reactflow";

function BehaviorNode({ data, isConnectable }: any): ReactElement {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="bg-gray-700"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-gray-700"
        isConnectable={isConnectable}
      />
    </>
  );
}
export default memo(BehaviorNode);
