import React, { ReactElement, memo } from "react";
import { Handle, Position } from "reactflow";
import { BEHAVIOR_PARAMS, BEHAVIOR_TYPES } from "../../../model/Behavior";
import { Descriptions } from "antd";

function ImmutableBehaviorNode({ data, isConnectable }: any): ReactElement {
  const {
    params,
    label: behavior,
  }: {
    id: string;
    params: BEHAVIOR_PARAMS;
    label: BEHAVIOR_TYPES;
  } = data;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
      <Descriptions
        column={1}
        items={[
          {
            key: "type",
            label: "type",
            children: behavior,
          },
          ...Object.keys(params).map((k) => {
            return {
              key: k,
              label: k,
              children:
                params[k as keyof BEHAVIOR_PARAMS] === ""
                  ? "N/A"
                  : params[k as keyof BEHAVIOR_PARAMS],
            };
          }),
        ]}
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

export default memo(ImmutableBehaviorNode);
