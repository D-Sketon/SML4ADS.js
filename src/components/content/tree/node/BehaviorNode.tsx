import { Form, InputNumber, Select } from "antd";
import { ReactElement, memo } from "react";
import { Handle, Position } from "reactflow";
import {
  ACCELERATE_BEHAVIOR_PARAMS,
  BEHAVIOR_PARAMS,
  BEHAVIOR_TYPES,
  CHANGE_BEHAVIOR_PARAMS,
  KEEP_BEHAVIOR_PARAMS,
  LANE_OFFSET_BEHAVIOR_PARAMS,
  TURN_BEHAVIOR_PARAMS,
  defaultBehaviorParams,
} from "../../../../model/Behavior";

function BehaviorNode({ data, isConnectable }: any): ReactElement {
  const {
    id,
    params,
    label: behavior,
    setNodes,
  }: {
    id: string;
    params: BEHAVIOR_PARAMS;
    label: BEHAVIOR_TYPES;
    setNodes: (...args: any[]) => void;
  } = data;

  function getBehaviorComponent(): ReactElement {
    switch (behavior) {
      case BEHAVIOR_TYPES.KEEP:
      case BEHAVIOR_TYPES.IDLE:
        return keepBehavior();
      case BEHAVIOR_TYPES.ACCELERATE:
      case BEHAVIOR_TYPES.DECELERATE:
        return accelerateBehavior();
      case BEHAVIOR_TYPES.CHANGE_LEFT:
      case BEHAVIOR_TYPES.CHANGE_RIGHT:
        return changeBehavior();
      case BEHAVIOR_TYPES.TURN_LEFT:
      case BEHAVIOR_TYPES.TURN_RIGHT:
        return turnBehavior();
      case BEHAVIOR_TYPES.LANE_OFFSET:
        return laneOffsetBehavior();
      default:
        return <></>;
    }
  }

  function handleBehaviorChange(value: BEHAVIOR_TYPES) {
    setNodes((prev: any) => {
      const newNodes = [...prev];
      const index = newNodes.findIndex((item) => item.id === id);
      newNodes[index].data = {
        ...newNodes[index].data,
        params: defaultBehaviorParams(value),
        label: value,
      };
      return newNodes;
    });
  }

  function keepBehavior(): ReactElement {
    return (
      <Form.Item label="duration">
        <InputNumber
          min={0}
          style={{ width: 62 }}
          value={(params as KEEP_BEHAVIOR_PARAMS).duration[0]}
          onChange={(e) => {
            handleParamsChange("duration", [
              e,
              (params as KEEP_BEHAVIOR_PARAMS).duration[1],
            ]);
          }}
        />
        <span style={{ margin: "0 10px" }}>-</span>
        <InputNumber
          min={0}
          style={{ width: 62 }}
          value={(params as KEEP_BEHAVIOR_PARAMS).duration[1]}
          onChange={(e) => {
            handleParamsChange("duration", [
              (params as KEEP_BEHAVIOR_PARAMS).duration[0],
              e,
            ]);
          }}
        />
      </Form.Item>
    );
  }

  function accelerateBehavior(): ReactElement {
    return (
      <>
        <Form.Item label="*acceleration" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as ACCELERATE_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).acceleration[1]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                (params as ACCELERATE_BEHAVIOR_PARAMS).acceleration[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="*target speed" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as ACCELERATE_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).targetSpeed[1]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                (params as ACCELERATE_BEHAVIOR_PARAMS).targetSpeed[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="duration">
        <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).duration[0]}
            onChange={(e) => {
              handleParamsChange("duration", [
                e,
                (params as ACCELERATE_BEHAVIOR_PARAMS).duration[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).duration[1]}
            onChange={(e) => {
              handleParamsChange("duration", [
                (params as ACCELERATE_BEHAVIOR_PARAMS).duration[0],
                e,
              ]);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function changeBehavior(): ReactElement {
    return (
      <>
        <Form.Item label="acceleration">
          <InputNumber
            style={{ width: 62 }}
            value={(params as CHANGE_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as CHANGE_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            style={{ width: 62 }}
            value={(params as CHANGE_BEHAVIOR_PARAMS).acceleration[1]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                (params as CHANGE_BEHAVIOR_PARAMS).acceleration[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="target speed">
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as CHANGE_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as CHANGE_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as CHANGE_BEHAVIOR_PARAMS).targetSpeed[1]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                (params as CHANGE_BEHAVIOR_PARAMS).targetSpeed[0],
                e,
              ]);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function turnBehavior(): ReactElement {
    return (
      <>
        <Form.Item label="*acceleration" rules={[{ required: true }]}>
          <InputNumber
            style={{ width: 62 }}
            value={(params as TURN_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as TURN_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            style={{ width: 62 }}
            value={(params as TURN_BEHAVIOR_PARAMS).acceleration[1]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                (params as TURN_BEHAVIOR_PARAMS).acceleration[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="*target speed" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as TURN_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as TURN_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as TURN_BEHAVIOR_PARAMS).targetSpeed[1]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                (params as TURN_BEHAVIOR_PARAMS).targetSpeed[0],
                e,
              ]);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function laneOffsetBehavior(): ReactElement {
    return (
      <>
        <Form.Item label="*offset" rules={[{ required: true }]}>
          <InputNumber
            style={{ width: 62 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).offset[0]}
            onChange={(e) => {
              handleParamsChange("offset", [
                e,
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).offset[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            style={{ width: 62 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).offset[1]}
            onChange={(e) => {
              handleParamsChange("offset", [
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).offset[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="acceleration">
          <InputNumber
            style={{ width: 62 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            style={{ width: 62 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).acceleration[1]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).acceleration[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="target speed">
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).targetSpeed[1]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).targetSpeed[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="duration">
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).duration[0]}
            onChange={(e) => {
              handleParamsChange("duration", [
                e,
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).duration[1],
              ]);
            }}
          />
          <span style={{ margin: "0 10px" }}>-</span>
          <InputNumber
            min={0}
            style={{ width: 62 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).duration[1]}
            onChange={(e) => {
              handleParamsChange("duration", [
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).duration[0],
                e,
              ]);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function handleParamsChange(key: string, value: any) {
    setNodes((prev: any) => {
      const newNodes = [...prev];
      const index = newNodes.findIndex((item) => item.id === id);
      newNodes[index].data = {
        ...newNodes[index].data,
        params: {
          ...newNodes[index].data.params,
          [key]: value,
        },
      };
      return newNodes;
    });
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
      <Form
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        initialValues={data.initialValues}
        autoComplete="off"
      >
        <Form.Item label="behavior">
          <Select
            options={Object.values(BEHAVIOR_TYPES).map((item) => ({
              label: item,
              value: item,
            }))}
            className="nodrag nopan"
            style={{ width: 150 }}
            value={behavior}
            onChange={handleBehaviorChange}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </Form.Item>
        {getBehaviorComponent()}
      </Form>
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
