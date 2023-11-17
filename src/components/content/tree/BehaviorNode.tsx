import { Form, InputNumber, Select } from "antd";
import { ReactElement, memo, useState } from "react";
import { Handle, Position } from "reactflow";
import { BehaviorType } from "./constant";

type BehaviorFieldType = {
  behavior?: BehaviorType;
  duration?: number;
  acceleration?: number;
  targetSpeed?: number;
  offset?: number;
};

function keepBehavior(): ReactElement {
  return (
    <Form.Item<BehaviorFieldType>
      label="duration"
      name="duration"
    >
      <InputNumber min={0} style= {{ width: 150 }}/>
    </Form.Item>
  );
}

function accelerateBehavior(): ReactElement {
  return (
    <>
      <Form.Item<BehaviorFieldType>
        label="acceleration"
        name="acceleration"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
      <Form.Item<BehaviorFieldType>
        label="target speed"
        name="targetSpeed"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
      <Form.Item<BehaviorFieldType>
        label="duration"
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
    </>
  );
}

function changeBehavior(): ReactElement {
  return (
    <>
      <Form.Item<BehaviorFieldType>
        label="acceleration"
        name="acceleration"
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
      <Form.Item<BehaviorFieldType>
        label="target speed"
        name="targetSpeed"
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
    </>
  );
}

function turnBehavior(): ReactElement {
  return (
    <>
      <Form.Item<BehaviorFieldType>
        label="acceleration"
        name="acceleration"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
      <Form.Item<BehaviorFieldType>
        label="target speed"
        name="targetSpeed"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
    </>
  );
}

function laneOffsetBehavior(): ReactElement {
  return (
    <>
    <Form.Item<BehaviorFieldType>
        label="offset"
        name="offset"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
      <Form.Item<BehaviorFieldType>
        label="acceleration"
        name="acceleration"
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
      <Form.Item<BehaviorFieldType>
        label="target speed"
        name="targetSpeed"
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
      <Form.Item<BehaviorFieldType>
        label="duration"
        
      >
        <InputNumber min={0} style= {{ width: 150 }}/>
      </Form.Item>
    </>
  );
}

function BehaviorNode({ data, isConnectable }: any): ReactElement {
  const [form] = Form.useForm();
  // for rerender
  const [behavior, setBehavior] = useState<BehaviorType>(BehaviorType.KEEP);

  function getBehaviorComponent(): ReactElement {
    switch (behavior) {
      case BehaviorType.KEEP:
      case BehaviorType.IDLE:
        return keepBehavior();
      case BehaviorType.ACCELERATE:
      case BehaviorType.DECELERATE:
        return accelerateBehavior();
      case BehaviorType.CHANGE_LEFT:
      case BehaviorType.CHANGE_RIGHT:
        return changeBehavior();
      case BehaviorType.TURN_LEFT:
      case BehaviorType.TURN_RIGHT:
        return turnBehavior();
      case BehaviorType.LANE_OFFSET:
        return laneOffsetBehavior();
      default:
        return <></>;
    }
  }

  function handleBehaviorChange(value: BehaviorType) {
    setBehavior(value);
  }

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
      <Form<BehaviorFieldType>
        name="behavior"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        initialValues={data.initialValues}
        autoComplete="off"
        form={form}
      >
        <Form.Item<BehaviorFieldType> label="behavior" name="behavior">
          <Select
            options={Object.values(BehaviorType).map((item) => ({
              label: item,
              value: item,
            }))}
            className="nodrag nopan"
            style= {{ width: 150 }}
            onChange={handleBehaviorChange}
            getPopupContainer={triggerNode => triggerNode.parentElement}
          />
        </Form.Item>
        {getBehaviorComponent()}
      </Form>
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
}
export default memo(BehaviorNode);
