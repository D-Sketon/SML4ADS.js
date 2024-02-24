import { Form, Input, InputNumber, Select } from "antd";
import { ReactElement, memo } from "react";
import { Handle, Position } from "reactflow";
import {
  ACCELERATE_BEHAVIOR_PARAMS,
  BEHAVIOR_PARAMS,
  BEHAVIOR_TYPES,
  CHANGE_BEHAVIOR_PARAMS,
  KEEP_BEHAVIOR_PARAMS,
  LANE_OFFSET_BEHAVIOR_PARAMS,
  STOP_BEHAVIOR_PARAMS,
  TURN_BEHAVIOR_PARAMS,
  CROSS_BEHAVIOR_PARAMS,
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

  const getBehaviorComponent = (): ReactElement => {
    switch (behavior) {
      case BEHAVIOR_TYPES.KEEP:
      case BEHAVIOR_TYPES.IDLE:
      case BEHAVIOR_TYPES.FOLLOW_ROAD_USER:
        return keepBehavior();
      case BEHAVIOR_TYPES.ACCELERATE:
      case BEHAVIOR_TYPES.DECELERATE:
        return accelerateBehavior();
      case BEHAVIOR_TYPES.CHANGE_LEFT:
      case BEHAVIOR_TYPES.CHANGE_RIGHT:
      case BEHAVIOR_TYPES.CUT_IN:
      case BEHAVIOR_TYPES.CUT_OUT:
        return changeBehavior();
      case BEHAVIOR_TYPES.TURN_LEFT:
      case BEHAVIOR_TYPES.TURN_RIGHT:
      case BEHAVIOR_TYPES.MOVE_BACKWARD:
        return turnBehavior();
      case BEHAVIOR_TYPES.LANE_OFFSET:
        return laneOffsetBehavior();
      case BEHAVIOR_TYPES.STOP:
        return stopBehavior();
      case BEHAVIOR_TYPES.OVERTAKE:
      case BEHAVIOR_TYPES.CLOSE_UP:
      case BEHAVIOR_TYPES.MOVE_AWAY:
      case BEHAVIOR_TYPES.CROSS:
      case BEHAVIOR_TYPES.PASS:
        return crossBehavior();
      default:
        return <></>;
    }
  };

  const handleBehaviorChange = (value: BEHAVIOR_TYPES): void => {
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
  };

  const crossBehavior = (): ReactElement => {
    return (
      <>
        <Form.Item label="*acceleration" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            className="w-16"
            value={(params as CROSS_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as CROSS_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
            value={(params as CROSS_BEHAVIOR_PARAMS).acceleration[1]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                (params as CROSS_BEHAVIOR_PARAMS).acceleration[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="*target speed" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            className="w-16"
            value={(params as CROSS_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as CROSS_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
            value={(params as CROSS_BEHAVIOR_PARAMS).targetSpeed[1]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                (params as CROSS_BEHAVIOR_PARAMS).targetSpeed[0],
                e,
              ]);
            }}
          />
        </Form.Item>
        <Form.Item label="actor ref">
          <Input
            className="w-16"
            value={(params as CROSS_BEHAVIOR_PARAMS).actorRef}
            onChange={(e) => {
              handleParamsChange("actorRef", e.target.value);
            }}
          />
        </Form.Item>
      </>
    );
  }

  const stopBehavior = (): ReactElement => {
    return (
      <>
        <Form.Item label="*acceleration" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            className="w-16"
            value={(params as STOP_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as STOP_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
            value={(params as STOP_BEHAVIOR_PARAMS).acceleration[1]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                (params as STOP_BEHAVIOR_PARAMS).acceleration[0],
                e,
              ]);
            }}
          />
        </Form.Item>
      </>
    );
  }

  const keepBehavior = (): ReactElement => {
    return (
      <Form.Item label="duration">
        <InputNumber
          min={0}
          className="w-16"
          value={(params as KEEP_BEHAVIOR_PARAMS).duration[0]}
          onChange={(e) => {
            handleParamsChange("duration", [
              e,
              (params as KEEP_BEHAVIOR_PARAMS).duration[1],
            ]);
          }}
        />
        <span className="ml-2 mr-2">-</span>
        <InputNumber
          min={0}
          className="w-16"
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
  };

  const accelerateBehavior = (): ReactElement => {
    return (
      <>
        <Form.Item label="*acceleration" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            className="w-16"
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as ACCELERATE_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
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
            className="w-16"
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as ACCELERATE_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
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
            className="w-16"
            value={(params as ACCELERATE_BEHAVIOR_PARAMS).duration[0]}
            onChange={(e) => {
              handleParamsChange("duration", [
                e,
                (params as ACCELERATE_BEHAVIOR_PARAMS).duration[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
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
  };

  const changeBehavior = (): ReactElement => {
    return (
      <>
        <Form.Item label="acceleration">
          <InputNumber
            className="w-16"
            value={(params as CHANGE_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as CHANGE_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            className="w-16"
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
            className="w-16"
            value={(params as CHANGE_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as CHANGE_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
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
  };

  const turnBehavior = (): ReactElement => {
    return (
      <>
        <Form.Item label="*acceleration" rules={[{ required: true }]}>
          <InputNumber
            className="w-16"
            value={(params as TURN_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as TURN_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            className="w-16"
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
            className="w-16"
            value={(params as TURN_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as TURN_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
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
  };

  const laneOffsetBehavior = (): ReactElement => {
    return (
      <>
        <Form.Item label="*offset" rules={[{ required: true }]}>
          <InputNumber
            className="w-16"
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).offset[0]}
            onChange={(e) => {
              handleParamsChange("offset", [
                e,
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).offset[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            className="w-16"
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
            className="w-16"
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).acceleration[0]}
            onChange={(e) => {
              handleParamsChange("acceleration", [
                e,
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).acceleration[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            className="w-16"
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
            className="w-16"
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).targetSpeed[0]}
            onChange={(e) => {
              handleParamsChange("targetSpeed", [
                e,
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).targetSpeed[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
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
            className="w-16"
            value={(params as LANE_OFFSET_BEHAVIOR_PARAMS).duration[0]}
            onChange={(e) => {
              handleParamsChange("duration", [
                e,
                (params as LANE_OFFSET_BEHAVIOR_PARAMS).duration[1],
              ]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            min={0}
            className="w-16"
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
  };

  const handleParamsChange = (key: string, value: any) => {
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
  };

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="bg-gray-700"
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
            listHeight={700}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
          />
        </Form.Item>
        {getBehaviorComponent()}
      </Form>
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
