import { Card, Form, Select, Button, InputNumber, Input, Cascader } from "antd";
import { ReactElement, useContext } from "react";
import { FILE_SUFFIX } from "../../../constants";
import { MModel, SIMULATOR_TYPES } from "../../../model/Model";
import AppContext from "../../../store/context";
import {
  GLOBAL_POSITION_PARAMS,
  LANE_POSITION_PARAMS,
  LOCATION_TYPES,
  RELATED_POSITION_PARAMS,
  ROAD_POSITION_PARAMS,
  defaultGlobalPositionParams,
  defaultLanePositionParams,
  defaultRelatedPositionParams,
  defaultRoadPositionParams,
} from "../../../model/params/ParamLocation";
import { VEHICLE_TYPES_CARLA, VEHICLE_TYPES_LGSVL } from "../../../model/Car";
import {
  SPEED_TYPES,
  defaultManualSpeedParams,
  defaultUniformDistributionSpeedParams,
  defaultNormalDistributionSpeedParams,
  MANUAL_SPEED_PARAMS,
  UNIFORM_DISTRIBUTION_SPEED_PARAMS,
  NORMAL_DISTRIBUTION_SPEED_PARAMS,
} from "../../../model/params/ParamSpeed";

interface CarInformationProps {
  model: MModel;
  setModel: (value: any) => void;
  index: number;
}

function getDefaultLocationParams(type: LOCATION_TYPES) {
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

function getDefaultSpeedParams(type: SPEED_TYPES) {
  switch (type) {
    case SPEED_TYPES.MANUAL:
      return defaultManualSpeedParams();
    case SPEED_TYPES.UNIFORM_DISTRIBUTION:
      return defaultUniformDistributionSpeedParams();
    case SPEED_TYPES.NORMAL_DISTRIBUTION:
      return defaultNormalDistributionSpeedParams();
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

  function handleDelete() {
    setModel({
      ...model,
      cars: model.cars.filter((_, i) => i !== index),
    });
  }

  // location
  function globalPosition(): ReactElement {
    return (
      <>
        <Form.Item label="x" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetLocationParams("x", e);
            }}
            value={(car.locationParams as GLOBAL_POSITION_PARAMS).x}
          />
        </Form.Item>
        <Form.Item label="y" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetLocationParams("y", e);
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
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetLocationParams("roadId", e);
            }}
            value={(car.locationParams as LANE_POSITION_PARAMS).roadId}
          />
        </Form.Item>
        <Form.Item label="laneId" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetLocationParams("laneId", e);
            }}
            value={(car.locationParams as LANE_POSITION_PARAMS).laneId}
          />
        </Form.Item>
        <Form.Item label="minLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetLocationParams("minLateralOffset", e);
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
              simpleSetLocationParams("maxLateralOffset", e);
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
              simpleSetLocationParams("minLongitudinalOffset", e);
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
              simpleSetLocationParams("maxLongitudinalOffset", e);
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
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetLocationParams("roadId", e);
            }}
            value={(car.locationParams as ROAD_POSITION_PARAMS).roadId}
          />
        </Form.Item>
        <Form.Item label="minLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetLocationParams("minLateralOffset", e);
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
              simpleSetLocationParams("maxLateralOffset", e);
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
              simpleSetLocationParams("minLongitudinalOffset", e);
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
              simpleSetLocationParams("maxLongitudinalOffset", e);
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
              simpleSetLocationParams("actorRef", e.target.value);
            }}
            value={(car.locationParams as RELATED_POSITION_PARAMS).actorRef}
          />
        </Form.Item>
        <Form.Item label="minLateralOffset" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            onChange={(e) => {
              simpleSetLocationParams("minLateralOffset", e);
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
              simpleSetLocationParams("maxLateralOffset", e);
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
              simpleSetLocationParams("minLongitudinalOffset", e);
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
              simpleSetLocationParams("maxLongitudinalOffset", e);
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

  function simpleSetLocationParams(key: string, value: any) {
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

  function simpleSetSpeedParams(key: string, value: any) {
    setModel({
      ...model,
      cars: model.cars.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            speedParams: {
              ...c.speedParams,
              [key]: value,
            },
          };
        }
        return c;
      }),
    });
  }

  // speed
  const cascaderOptions = [
    {
      label: SPEED_TYPES.MANUAL,
      value: SPEED_TYPES.MANUAL,
    },
    {
      label: SPEED_TYPES.PROBABILISTIC,
      value: SPEED_TYPES.PROBABILISTIC,
      children: [
        {
          label: SPEED_TYPES.UNIFORM_DISTRIBUTION,
          value: SPEED_TYPES.UNIFORM_DISTRIBUTION,
        },
        {
          label: SPEED_TYPES.NORMAL_DISTRIBUTION,
          value: SPEED_TYPES.NORMAL_DISTRIBUTION,
        },
      ],
    },
  ];

  // Just show the latest item.
  const displayRender = (labels: string[]) => labels[labels.length - 1];

  function manualSpeed(): ReactElement {
    return (
      <>
        <Form.Item label="maxSpeed" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            max={180}
            style={{ width: 150 }}
            value={(car.speedParams as MANUAL_SPEED_PARAMS).maxSpeed}
            onChange={(e) => {
              simpleSetSpeedParams("maxSpeed", e);
            }}
          />
        </Form.Item>
        <Form.Item label="initialSpeed" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            max={180}
            style={{ width: 150 }}
            value={(car.speedParams as MANUAL_SPEED_PARAMS).initSpeed}
            onChange={(e) => {
              simpleSetSpeedParams("initSpeed", e);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function uniformDistributionSpeed(): ReactElement {
    return (
      <>
        <Form.Item label="a" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(car.speedParams as UNIFORM_DISTRIBUTION_SPEED_PARAMS).a}
            onChange={(e) => {
              simpleSetSpeedParams("a", e);
            }}
          />
        </Form.Item>
        <Form.Item label="b" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(car.speedParams as UNIFORM_DISTRIBUTION_SPEED_PARAMS).b}
            onChange={(e) => {
              simpleSetSpeedParams("b", e);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function normalDistributionSpeed(): ReactElement {
    return (
      <>
        <Form.Item label="mean" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(car.speedParams as NORMAL_DISTRIBUTION_SPEED_PARAMS).mean}
            onChange={(e) => {
              simpleSetSpeedParams("mean", e);
            }}
          />
        </Form.Item>
        <Form.Item label="std" labelCol={{ span: 6 }}>
          <InputNumber
            style={{ width: 150 }}
            value={(car.speedParams as NORMAL_DISTRIBUTION_SPEED_PARAMS).std}
            onChange={(e) => {
              simpleSetSpeedParams("std", e);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function getSpeedComponent(): ReactElement {
    switch (car.speedType) {
      case SPEED_TYPES.MANUAL:
        return manualSpeed();
      case SPEED_TYPES.UNIFORM_DISTRIBUTION:
        return uniformDistributionSpeed();
      case SPEED_TYPES.NORMAL_DISTRIBUTION:
        return normalDistributionSpeed();
      default:
        return <></>;
    }
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
        <Form.Item label="name">
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
        <Form.Item label="speedType(alpha)">
          <Cascader
            style={{ width: 180 }}
            allowClear={false}
            options={cascaderOptions}
            expandTrigger="hover"
            value={
              car.speedType === SPEED_TYPES.MANUAL
                ? [SPEED_TYPES.MANUAL]
                : [SPEED_TYPES.PROBABILISTIC, car.speedType]
            }
            displayRender={displayRender}
            onChange={(e) => {
              setModel({
                ...model,
                cars: model.cars.map((c, i) => {
                  if (i === index) {
                    return {
                      ...c,
                      speedType: e[e.length - 1],
                      speedParams: getDefaultSpeedParams(
                        e[e.length - 1] as any
                      ),
                    };
                  }
                  return c;
                }),
              });
            }}
          />
        </Form.Item>
        {getSpeedComponent()}
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
                      locationParams: getDefaultLocationParams(e),
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
        <Form.Item label="roadDeviation">
          <InputNumber
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
