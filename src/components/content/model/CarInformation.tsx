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
  defaultLocationParams,
} from "../../../model/params/ParamLocation";
import { VEHICLE_TYPES_CARLA, VEHICLE_TYPES_LGSVL } from "../../../model/Car";
import {
  BERNOULLI_DISTRIBUTION_SPEED_PARAMS,
  BINOMIAL_DISTRIBUTION_SPEED_PARAMS,
  CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS,
  CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS,
  MANUAL_SPEED_PARAMS,
  NORMAL_DISTRIBUTION_SPEED_PARAMS,
  POISSON_DISTRIBUTION_SPEED_PARAMS,
  SPEED_TYPES,
  UNIFORM_DISTRIBUTION_SPEED_PARAMS,
  defaultSpeedParams,
} from "../../../model/params/ParamSpeed";
import TextArea from "antd/es/input/TextArea";

interface CarInformationProps {
  model: MModel;
  setModel: (value: any) => void;
  index: number;
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
        {
          label: SPEED_TYPES.BERNOULLI_DISTRIBUTION,
          value: SPEED_TYPES.BERNOULLI_DISTRIBUTION,
        },
        {
          label: SPEED_TYPES.BINOMIAL_DISTRIBUTION,
          value: SPEED_TYPES.BINOMIAL_DISTRIBUTION,
        },
        {
          label: SPEED_TYPES.POISSON_DISTRIBUTION,
          value: SPEED_TYPES.POISSON_DISTRIBUTION,
        },
        {
          label: SPEED_TYPES.CHI_SQUARED_DISTRIBUTION,
          value: SPEED_TYPES.CHI_SQUARED_DISTRIBUTION,
        },
        {
          label: SPEED_TYPES.CUSTOMIZED_DISTRIBUTION,
          value: SPEED_TYPES.CUSTOMIZED_DISTRIBUTION,
        },
      ],
    },
  ];

  // Just show the latest item.
  const displayRender = (labels: string[]) => labels[labels.length - 1];

  function manualSpeed(): ReactElement {
    return (
      <>
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
        <Form.Item label="min" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(car.speedParams as UNIFORM_DISTRIBUTION_SPEED_PARAMS).a}
            onChange={(e) => {
              simpleSetSpeedParams("a", e);
            }}
          />
        </Form.Item>
        <Form.Item label="max" labelCol={{ span: 6 }}>
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

  function bernoulliDistributionSpeed(): ReactElement {
    return (
      <>
        <Form.Item label="p" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            max={1}
            style={{ width: 150 }}
            value={(car.speedParams as BERNOULLI_DISTRIBUTION_SPEED_PARAMS).p}
            onChange={(e) => {
              simpleSetSpeedParams("p", e);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function binomialDistributionSpeed(): ReactElement {
    return (
      <>
        <Form.Item label="n" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(car.speedParams as BINOMIAL_DISTRIBUTION_SPEED_PARAMS).n}
            onChange={(e) => {
              simpleSetSpeedParams("n", e);
            }}
          />
        </Form.Item>
        <Form.Item label="p" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            max={1}
            style={{ width: 150 }}
            value={(car.speedParams as BINOMIAL_DISTRIBUTION_SPEED_PARAMS).p}
            onChange={(e) => {
              simpleSetSpeedParams("p", e);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function poissonDistributionSpeed(): ReactElement {
    return (
      <>
        <Form.Item label="lambda" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={
              (car.speedParams as POISSON_DISTRIBUTION_SPEED_PARAMS).lambda
            }
            onChange={(e) => {
              simpleSetSpeedParams("lambda", e);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function chiSquareDistributionSpeed(): ReactElement {
    return (
      <>
        <Form.Item label="k" labelCol={{ span: 6 }}>
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={(car.speedParams as CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS).k}
            onChange={(e) => {
              simpleSetSpeedParams("k", e);
            }}
          />
        </Form.Item>
      </>
    );
  }

  function customizedDistributionSpeed(): ReactElement {
    return (
      <>
        <Form.Item label="formula" labelCol={{ span: 6 }}>
          <TextArea
            rows={2}
            value={
              (car.speedParams as CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS).formula
            }
            onChange={(e) => {
              simpleSetSpeedParams("formula", e);
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
      case SPEED_TYPES.BERNOULLI_DISTRIBUTION:
        return bernoulliDistributionSpeed();
      case SPEED_TYPES.BINOMIAL_DISTRIBUTION:
        return binomialDistributionSpeed();
      case SPEED_TYPES.POISSON_DISTRIBUTION:
        return poissonDistributionSpeed();
      case SPEED_TYPES.CHI_SQUARED_DISTRIBUTION:
        return chiSquareDistributionSpeed();
      case SPEED_TYPES.CUSTOMIZED_DISTRIBUTION:
        return customizedDistributionSpeed();
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
            style={{ width: 180 }}
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
        <Form.Item label="speedType">
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
                      speedType: e[e.length - 1] as SPEED_TYPES,
                      speedParams: defaultSpeedParams(e[e.length - 1] as SPEED_TYPES),
                    };
                  }
                  return c;
                }),
              });
            }}
          />
        </Form.Item>
        {getSpeedComponent()}
        <Form.Item label="maxSpeed">
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
        <Form.Item label="minSpeed">
          <InputNumber
            min={0}
            max={180}
            style={{ width: 150 }}
            value={car.minSpeed}
            onChange={(e) => {
              simpleSetCar("minSpeed", e);
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
                      locationParams: defaultLocationParams(e),
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
