import { Card, Form, Select, Button, InputNumber, Input } from "antd";
import { ReactElement, useContext } from "react";
import { FILE_SUFFIX } from "../../../constants";
import { MModel, SIMULATOR_TYPES } from "../../../model/Model";
import {
  GLOBAL_POSITION_PARAMS,
  LANE_POSITION_PARAMS,
  LOCATION_TYPES,
  RELATED_POSITION_PARAMS,
  ROAD_POSITION_PARAMS,
  VEHICLE_TYPES_CARLA,
  VEHICLE_TYPES_LGSVL,
  defaultGlobalPositionParams,
  defaultLanePositionParams,
  defaultRelatedPositionParams,
  defaultRoadPositionParams,
} from "../../../model/Car";
import AppContext from "../../../store/context";

interface CarInformationProps {
  model: MModel;
  setModel: (value: any) => void;
  index: number;
}

function getDefaultCarParams(type: LOCATION_TYPES) {
  switch (type) {
    case LOCATION_TYPES.GLOBAL_POSITION:
      return defaultGlobalPositionParams();
    case LOCATION_TYPES.LANE_POSITION:
      return defaultLanePositionParams();
    case LOCATION_TYPES.ROAD_POSITION:
      return defaultRoadPositionParams();
    case LOCATION_TYPES.RELATED_POSITION:
      return defaultRelatedPositionParams();
    default:
  }
}

function CarInformation(props: CarInformationProps): ReactElement {
  const { model, setModel, index } = props;
  const { state } = useContext(AppContext);
  const car = model.cars[index];

  async function handleChooseFile(): Promise<void> {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.TREE]);
    if (res.filePaths.length) {
      const relativePath = await window.electronAPI.getRelativePath(
        state.workspacePath,
        res.filePaths[0]
      );
      simpleSetCar("treePath", relativePath);
    }
  }

  function globalPosition(): ReactElement {
    return (
      <>
        <Form.Item label="x" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("x", e);
            }}
            value={(car.locationParams as GLOBAL_POSITION_PARAMS).x}
          />
        </Form.Item>
        <Form.Item label="y" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("y", e);
            }}
            value={(car.locationParams as GLOBAL_POSITION_PARAMS).y}
          />
        </Form.Item>
      </>
    );
  }

  function lanePosition(): ReactElement {
    return (
      <>
        <Form.Item label="roadId" labelCol={{ span: 6 }}>
          <Input
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("roadId", e.target.value);
            }}
            value={(car.locationParams as LANE_POSITION_PARAMS).roadId}
          />
        </Form.Item>
        <Form.Item label="laneId" labelCol={{ span: 6 }}>
          <Input
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("laneId", e.target.value);
            }}
            value={(car.locationParams as LANE_POSITION_PARAMS).laneId}
          />
        </Form.Item>
        <Form.Item label="minLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("minLateralOffset", e);
            }}
            value={
              (car.locationParams as LANE_POSITION_PARAMS).minLateralOffset
            }
          />
        </Form.Item>
        <Form.Item label="maxLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("maxLateralOffset", e);
            }}
            value={
              (car.locationParams as LANE_POSITION_PARAMS).maxLateralOffset
            }
          />
        </Form.Item>
        <Form.Item label="minLongitudinalOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("minLongitudinalOffset", e);
            }}
            value={
              (car.locationParams as LANE_POSITION_PARAMS).minLongitudinalOffset
            }
          />
        </Form.Item>
        <Form.Item label="maxLongitudinalOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("maxLongitudinalOffset", e);
            }}
            value={
              (car.locationParams as LANE_POSITION_PARAMS).maxLongitudinalOffset
            }
          />
        </Form.Item>
      </>
    );
  }

  function roadPosition(): ReactElement {
    return (
      <>
        <Form.Item label="roadId" labelCol={{ span: 6 }}>
          <Input
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("roadId", e.target.value);
            }}
            value={(car.locationParams as ROAD_POSITION_PARAMS).roadId}
          />
        </Form.Item>
        <Form.Item label="minLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("minLateralOffset", e);
            }}
            value={
              (car.locationParams as ROAD_POSITION_PARAMS).minLateralOffset
            }
          />
        </Form.Item>
        <Form.Item label="maxLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("maxLateralOffset", e);
            }}
            value={
              (car.locationParams as ROAD_POSITION_PARAMS).maxLateralOffset
            }
          />
        </Form.Item>
        <Form.Item label="minLongitudinalOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("minLongitudinalOffset", e);
            }}
            value={
              (car.locationParams as ROAD_POSITION_PARAMS).minLongitudinalOffset
            }
          />
        </Form.Item>
        <Form.Item label="maxLongitudinalOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("maxLongitudinalOffset", e);
            }}
            value={
              (car.locationParams as ROAD_POSITION_PARAMS).maxLongitudinalOffset
            }
          />
        </Form.Item>
      </>
    );
  }

  function relatedPosition(): ReactElement {
    return (
      <>
        <Form.Item label="actorRef" labelCol={{ span: 6 }}>
          <Input
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("actorRef", e.target.value);
            }}
            value={(car.locationParams as RELATED_POSITION_PARAMS).actorRef}
          />
        </Form.Item>
        <Form.Item label="minLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("minLateralOffset", e);
            }}
            value={
              (car.locationParams as RELATED_POSITION_PARAMS).minLateralOffset
            }
          />
        </Form.Item>
        <Form.Item label="maxLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("maxLateralOffset", e);
            }}
            value={
              (car.locationParams as RELATED_POSITION_PARAMS).maxLateralOffset
            }
          />
        </Form.Item>
        <Form.Item label="minLongitudinalOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("minLongitudinalOffset", e);
            }}
            value={
              (car.locationParams as RELATED_POSITION_PARAMS)
                .minLongitudinalOffset
            }
          />
        </Form.Item>
        <Form.Item label="maxLongitudinalOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetCarParams("maxLongitudinalOffset", e);
            }}
            value={
              (car.locationParams as RELATED_POSITION_PARAMS)
                .maxLongitudinalOffset
            }
          />
        </Form.Item>
      </>
    );
  }

  function getPositionComponent(): ReactElement {
    switch (car.locationType) {
      case LOCATION_TYPES.GLOBAL_POSITION:
        return globalPosition();
      case LOCATION_TYPES.LANE_POSITION:
        return lanePosition();
      case LOCATION_TYPES.ROAD_POSITION:
        return roadPosition();
      case LOCATION_TYPES.RELATED_POSITION:
        return relatedPosition();
      default:
        return <></>;
    }
  }

  function simpleSetCar(key: string, value: any) {
    setModel({
      ...model,
      cars: model.cars.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            [key]: value,
          };
        }
        return c;
      }),
    });
  }

  function simpleSetCarParams(key: string, value: any) {
    setModel({
      ...model,
      cars: model.cars.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            locationParams: {
              ...c.locationParams,
              [key]: value,
            },
          };
        }
        return c;
      }),
    });
  }

  function handleDelete() {
    setModel({
      ...model,
      cars: model.cars.filter((_, i) => i !== index),
    });
  }

  return (
    <Card
      hoverable
      title="Car"
      extra={
        <Button type="primary" onClick={handleDelete}>
          Delete
        </Button>
      }
      style={{ margin: "10px 10px 10px 0", boxSizing: "border-box" }}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} autoComplete="off">
        <Form.Item
          label="name"
          rules={[{ required: true, message: "car.name is required" }]}
        >
          <Input
            value={car.name}
            onChange={(e) => {
              simpleSetCar("name", e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="model">
          <Select
            style={{ width: 150 }}
            options={
              model.simulatorType === SIMULATOR_TYPES.CARLA
                ? Object.values(VEHICLE_TYPES_CARLA).map((i) => ({
                    label: i,
                    value: i,
                  }))
                : Object.values(VEHICLE_TYPES_LGSVL).map(
                    (i) => ({ label: i, value: i } as any)
                  )
            }
            value={car.model}
            onChange={(e) => {
              simpleSetCar("model", e);
            }}
          />
        </Form.Item>
        <Form.Item
          label="maxSpeed"
          rules={[{ required: true, message: "car.maxSpeed is required" }]}
        >
          <InputNumber
            min={0}
            max={180}
            style={{ width: 150 }}
            value={car.maxSpeed}
            onChange={(e) => {
              simpleSetCar("maxSpeed", e);
            }}
          />
        </Form.Item>
        <Form.Item
          label="initialSpeed"
          rules={[{ required: true, message: "car.initialSpeed is required" }]}
        >
          <InputNumber
            min={0}
            max={180}
            style={{ width: 150 }}
            value={car.initSpeed}
            onChange={(e) => {
              simpleSetCar("initSpeed", e);
            }}
          />
        </Form.Item>
        <Form.Item label="location">
          <Select
            style={{ width: 150 }}
            options={Object.values(LOCATION_TYPES).map((i) => ({
              label: i,
              value: i,
            }))}
            value={car.locationType}
            onChange={(e) => {
              setModel({
                ...model,
                cars: model.cars.map((c, i) => {
                  if (i === index) {
                    return {
                      ...c,
                      locationType: e,
                      locationParams: getDefaultCarParams(e),
                    };
                  }
                  return c;
                }),
              });
            }}
          />
        </Form.Item>
        {getPositionComponent()}
        <Form.Item label="heading">
          <Select
            style={{ width: 150 }}
            options={[
              { label: "same", value: "same" },
              { label: "opposite", value: "opposite" },
            ]}
            value={car.heading ? "same" : "opposite"}
            onChange={(e) => {
              simpleSetCar("heading", e === "same");
            }}
          />
        </Form.Item>
        <Form.Item
          label="roadDeviation"
          rules={[{ required: true, message: "car.roadDeviation is required" }]}
        >
          <InputNumber
            min={0}
            max={360}
            style={{ width: 150 }}
            value={car.roadDeviation}
            onChange={(e) => {
              simpleSetCar("roadDeviation", e);
            }}
          />
        </Form.Item>
        <Form.Item label="dynamic">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="primary"
              onClick={handleChooseFile}
              style={{ marginRight: "10px" }}
            >
              Select File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {car.treePath}
            </span>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default CarInformation;
