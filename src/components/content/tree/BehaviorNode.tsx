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
  defaultAccelerateBehaviorParams,
  defaultChangeBehaviorParams,
  defaultKeepBehaviorParams,
  defaultLaneOffsetBehaviorParams,
  defaultTurnBehaviorParams,
} from "../../../model/Behavior";

function getDefaultBehaviorParams(type: BEHAVIOR_TYPES) {
  switch (type) {
    case BEHAVIOR_TYPES.KEEP:
    case BEHAVIOR_TYPES.IDLE:
      return defaultKeepBehaviorParams();
    case BEHAVIOR_TYPES.ACCELERATE:
    case BEHAVIOR_TYPES.DECELERATE:
      return defaultAccelerateBehaviorParams();
    case BEHAVIOR_TYPES.CHANGE_LEFT:
    case BEHAVIOR_TYPES.CHANGE_RIGHT:
      return defaultChangeBehaviorParams();
    case BEHAVIOR_TYPES.TURN_LEFT:
    case BEHAVIOR_TYPES.TURN_RIGHT:
      return defaultTurnBehaviorParams();
    case BEHAVIOR_TYPES.LANE_OFFSET:
      return defaultLaneOffsetBehaviorParams();
    default:
  }
}

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
        params: getDefaultBehaviorParams(value),
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
          style={{ width: 150 }}
          value={(params as KEEP_BEHAVIOR_PARAMS).duration ?? ""}
          onChange={(e) => {
            handleParamsChange("duration", e);
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
            style={{ width: 150 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).acceleration}
            onChange={(e) => {
              handleParamsChange("acceleration", e);
            }}
          />
        </Form.Item>
        <Form.Item label="*target speed" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).targetSpeed}
            onChange={(e) => {
              handleParamsChange("targetSpeed", e);
            }}
          />
        </Form.Item>
        <Form.Item label="duration">
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).duration ?? ""}
            onChange={(e) => {
              handleParamsChange("duration", e);
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
            style={{ width: 150 }}
            value={(params as CHANGE_BEHAVIOR_PARAMS).acceleration ?? ""}
            onChange={(e) => {
              handleParamsChange("acceleration", e);
            }}
          />
        </Form.Item>
        <Form.Item label="target speed">
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(params as CHANGE_BEHAVIOR_PARAMS).targetSpeed ?? ""}
            onChange={(e) => {
              handleParamsChange("targetSpeed", e);
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
            style={{ width: 150 }}
            value={(params as TURN_BEHAVIOR_PARAMS).acceleration}
            onChange={(e) => {
              handleParamsChange("acceleration", e);
            }}
          />
        </Form.Item>
        <Form.Item label="*target speed" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(params as TURN_BEHAVIOR_PARAMS).targetSpeed}
            onChange={(e) => {
              handleParamsChange("targetSpeed", e);
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
            min={0}
            style={{ width: 150 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).offset}
            onChange={(e) => {
              handleParamsChange("offset", e);
            }}
          />
        </Form.Item>
        <Form.Item label="acceleration">
          <InputNumber
            style={{ width: 150 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).acceleration ?? ""}
            onChange={(e) => {
              handleParamsChange("acceleration", e);
            }}
          />
        </Form.Item>
        <Form.Item label="target speed">
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).targetSpeed ?? ""}
            onChange={(e) => {
              handleParamsChange("targetSpeed", e);
            }}
          />
        </Form.Item>
        <Form.Item label="duration">
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).duration ?? ""}
            onChange={(e) => {
              handleParamsChange("duration", e);
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
