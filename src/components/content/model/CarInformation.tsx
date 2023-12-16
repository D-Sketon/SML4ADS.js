import { Card, Select, Button, InputNumber, Input, Cascader } from "antd";
import { ReactElement } from "react";
import { FILE_SUFFIX } from "../../../constants";
import { MModel, SIMULATOR_TYPES } from "../../../model/Model";
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
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import { UploadOutlined } from "@ant-design/icons";

interface CarInformationProps {
  model: MModel;
  setModel: (value: any) => void;
  index: number;
  path: string;
}

function CarInformation(props: CarInformationProps): ReactElement {
  const { model, setModel, index, path } = props;
  const car = model.cars[index];

  async function handleChooseFile(): Promise<void> {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.TREE]);
    if (res.filePaths.length) {
      const relativePath = await window.electronAPI.getRelativePath(
        path,
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
        <div className="form-item">
          <div className="form-label w-36">x:</div>
          <InputNumber
            className="w-16"
            value={(car.locationParams as GLOBAL_POSITION_PARAMS).x[0]}
            onChange={(e) => {
              simpleSetLocationParams("x", [
                e,
                (car.locationParams as GLOBAL_POSITION_PARAMS).x[1],
              ]);
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={(car.locationParams as GLOBAL_POSITION_PARAMS).x[1]}
            onChange={(e) => {
              simpleSetLocationParams("x", [
                (car.locationParams as GLOBAL_POSITION_PARAMS).x[0],
                e,
              ]);
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">y:</div>
          <InputNumber
            className="w-16"
            value={(car.locationParams as GLOBAL_POSITION_PARAMS).y[0]}
            onChange={(e) => {
              simpleSetLocationParams("y", [
                e,
                (car.locationParams as GLOBAL_POSITION_PARAMS).y[1],
              ]);
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={(car.locationParams as GLOBAL_POSITION_PARAMS).y[1]}
            onChange={(e) => {
              simpleSetLocationParams("y", [
                (car.locationParams as GLOBAL_POSITION_PARAMS).y[0],
                e,
              ]);
            }}
          />
        </div>
      </>
    );
  }

  function lanePosition(): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">roadId:</div>
          <InputNumber
            className="w-36"
            onChange={(e) => {
              simpleSetLocationParams("roadId", e);
            }}
            value={(car.locationParams as LANE_POSITION_PARAMS).roadId}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">laneId:</div>
          <InputNumber
            className="w-36"
            onChange={(e) => {
              simpleSetLocationParams("laneId", e);
            }}
            value={(car.locationParams as LANE_POSITION_PARAMS).laneId}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as LANE_POSITION_PARAMS).lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams("lateralOffset", [
                e,
                (car.locationParams as LANE_POSITION_PARAMS).lateralOffset[1],
              ]);
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as LANE_POSITION_PARAMS).lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams("lateralOffset", [
                (car.locationParams as LANE_POSITION_PARAMS).lateralOffset[0],
                e,
              ]);
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">longitudinalOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as LANE_POSITION_PARAMS).longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams("longitudinalOffset", [
                e,
                (car.locationParams as LANE_POSITION_PARAMS)
                  .longitudinalOffset[1],
              ]);
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as LANE_POSITION_PARAMS).longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams("longitudinalOffset", [
                (car.locationParams as LANE_POSITION_PARAMS)
                  .longitudinalOffset[0],
                e,
              ]);
            }}
          />
        </div>
      </>
    );
  }

  function roadPosition(): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">roadId:</div>
          <InputNumber
            className="w-36"
            onChange={(e) => {
              simpleSetLocationParams("roadId", e);
            }}
            value={(car.locationParams as ROAD_POSITION_PARAMS).roadId}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as ROAD_POSITION_PARAMS).lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams("lateralOffset", [
                e,
                (car.locationParams as ROAD_POSITION_PARAMS).lateralOffset[1],
              ]);
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as ROAD_POSITION_PARAMS).lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams("lateralOffset", [
                (car.locationParams as ROAD_POSITION_PARAMS).lateralOffset[0],
                e,
              ]);
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">longitudinalOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as ROAD_POSITION_PARAMS).longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams("longitudinalOffset", [
                e,
                (car.locationParams as ROAD_POSITION_PARAMS)
                  .longitudinalOffset[1],
              ]);
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as ROAD_POSITION_PARAMS).longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams("longitudinalOffset", [
                (car.locationParams as ROAD_POSITION_PARAMS)
                  .longitudinalOffset[0],
                e,
              ]);
            }}
          />
        </div>
      </>
    );
  }

  function relatedPosition(): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">actorRef:</div>
          <Input
            className="w-36"
            onChange={(e) => {
              simpleSetLocationParams("actorRef", e.target.value);
            }}
            value={(car.locationParams as RELATED_POSITION_PARAMS).actorRef}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as RELATED_POSITION_PARAMS).lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams("lateralOffset", [
                e,
                (car.locationParams as RELATED_POSITION_PARAMS)
                  .lateralOffset[1],
              ]);
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as RELATED_POSITION_PARAMS).lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams("lateralOffset", [
                (car.locationParams as RELATED_POSITION_PARAMS)
                  .lateralOffset[0],
                e,
              ]);
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">longitudinalOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as RELATED_POSITION_PARAMS)
                .longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams("longitudinalOffset", [
                e,
                (car.locationParams as RELATED_POSITION_PARAMS)
                  .longitudinalOffset[1],
              ]);
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (car.locationParams as RELATED_POSITION_PARAMS)
                .longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams("longitudinalOffset", [
                (car.locationParams as RELATED_POSITION_PARAMS)
                  .longitudinalOffset[0],
                e,
              ]);
            }}
          />
        </div>
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

  function simpleSetDistributionParams(
    primaryKey: "speedParams" | "accelerationParams",
    key: string,
    value: any
  ) {
    setModel({
      ...model,
      cars: model.cars.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            [primaryKey]: {
              ...c[primaryKey],
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

  function manualSpeed(
    key: "speedParams" | "accelerationParams"
  ): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">initialValue:</div>
          <InputNumber
            min={0}
            max={180}
            className="w-36"
            value={(car[key] as MANUAL_SPEED_PARAMS).initValue}
            onChange={(e) => {
              simpleSetDistributionParams(key, "initValue", e);
            }}
          />
        </div>
      </>
    );
  }

  function uniformDistributionSpeed(
    key: "speedParams" | "accelerationParams"
  ): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">min:</div>
          <InputNumber
            min={0}
            className="w-36"
            value={(car[key] as UNIFORM_DISTRIBUTION_SPEED_PARAMS).a}
            onChange={(e) => {
              simpleSetDistributionParams(key, "a", e);
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">max:</div>
          <InputNumber
            min={0}
            className="w-36"
            value={(car[key] as UNIFORM_DISTRIBUTION_SPEED_PARAMS).b}
            onChange={(e) => {
              simpleSetDistributionParams(key, "b", e);
            }}
          />
        </div>
      </>
    );
  }

  function normalDistributionSpeed(
    key: "speedParams" | "accelerationParams"
  ): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">mean:</div>
          <InputNumber
            min={0}
            className="w-36"
            value={(car[key] as NORMAL_DISTRIBUTION_SPEED_PARAMS).mean}
            onChange={(e) => {
              simpleSetDistributionParams(key, "mean", e);
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">std:</div>
          <InputNumber
            className="w-36"
            value={(car[key] as NORMAL_DISTRIBUTION_SPEED_PARAMS).std}
            onChange={(e) => {
              simpleSetDistributionParams(key, "std", e);
            }}
          />
        </div>
      </>
    );
  }

  function bernoulliDistributionSpeed(
    key: "speedParams" | "accelerationParams"
  ): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">p:</div>
          <InputNumber
            min={0}
            max={1}
            className="w-36"
            value={(car[key] as BERNOULLI_DISTRIBUTION_SPEED_PARAMS).p}
            onChange={(e) => {
              simpleSetDistributionParams(key, "p", e);
            }}
          />
        </div>
      </>
    );
  }

  function binomialDistributionSpeed(
    key: "speedParams" | "accelerationParams"
  ): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">n:</div>
          <InputNumber
            min={0}
            className="w-36"
            value={(car[key] as BINOMIAL_DISTRIBUTION_SPEED_PARAMS).n}
            onChange={(e) => {
              simpleSetDistributionParams(key, "n", e);
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-36">p:</div>
          <InputNumber
            min={0}
            max={1}
            className="w-36"
            value={(car[key] as BINOMIAL_DISTRIBUTION_SPEED_PARAMS).p}
            onChange={(e) => {
              simpleSetDistributionParams(key, "p", e);
            }}
          />
        </div>
      </>
    );
  }

  function poissonDistributionSpeed(
    key: "speedParams" | "accelerationParams"
  ): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">lambda:</div>
          <InputNumber
            min={0}
            className="w-36"
            value={(car[key] as POISSON_DISTRIBUTION_SPEED_PARAMS).lambda}
            onChange={(e) => {
              simpleSetDistributionParams(key, "lambda", e);
            }}
          />
        </div>
      </>
    );
  }

  function chiSquareDistributionSpeed(
    key: "speedParams" | "accelerationParams"
  ): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">k:</div>
          <InputNumber
            min={0}
            className="w-36"
            value={(car[key] as CHI_SQUARED_DISTRIBUTION_SPEED_PARAMS).k}
            onChange={(e) => {
              simpleSetDistributionParams(key, "k", e);
            }}
          />
        </div>
      </>
    );
  }

  function customizedDistributionSpeed(
    key: "speedParams" | "accelerationParams"
  ): ReactElement {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-36">formula:</div>
          <TextArea
            rows={2}
            value={(car[key] as CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS).formula}
            onChange={(e) => {
              simpleSetDistributionParams(key, "formula", e.target.value);
            }}
            spellCheck={false}
            className="font-mono"
          />
        </div>
        <TeX
          math={(car[key] as CUSTOMIZED_DISTRIBUTION_SPEED_PARAMS).formula}
          block
        />
      </>
    );
  }

  function getDistributionComponent(
    key: "speedParams" | "accelerationParams",
    type: "speedType" | "accelerationType"
  ): ReactElement {
    switch (car[type]) {
      case SPEED_TYPES.MANUAL:
        return manualSpeed(key);
      case SPEED_TYPES.UNIFORM_DISTRIBUTION:
        return uniformDistributionSpeed(key);
      case SPEED_TYPES.NORMAL_DISTRIBUTION:
        return normalDistributionSpeed(key);
      case SPEED_TYPES.BERNOULLI_DISTRIBUTION:
        return bernoulliDistributionSpeed(key);
      case SPEED_TYPES.BINOMIAL_DISTRIBUTION:
        return binomialDistributionSpeed(key);
      case SPEED_TYPES.POISSON_DISTRIBUTION:
        return poissonDistributionSpeed(key);
      case SPEED_TYPES.CHI_SQUARED_DISTRIBUTION:
        return chiSquareDistributionSpeed(key);
      case SPEED_TYPES.CUSTOMIZED_DISTRIBUTION:
        return customizedDistributionSpeed(key);
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
      className="box-border m-2 ml-0"
    >
      <div className="form-item">
        <div className="form-label w-28">name:</div>
        <Input
          value={car.name}
          onChange={(e) => {
            simpleSetCar("name", e.target.value);
          }}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">model:</div>
        <Select
          className="w-44"
          options={
            model.simulatorType === SIMULATOR_TYPES.CARLA
              ? Object.values(VEHICLE_TYPES_CARLA).map((i) => ({
                  label: i.startsWith("vehicle.")
                    ? i.split(".").slice(1).join(".")
                    : i,
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
      </div>
      <div className="form-item">
        <div className="form-label w-28">speedType:</div>
        <Cascader
          className="w-44"
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
                    speedParams: defaultSpeedParams(
                      e[e.length - 1] as SPEED_TYPES
                    ),
                  };
                }
                return c;
              }),
            });
          }}
        />
      </div>
      {getDistributionComponent("speedParams", "speedType")}
      <div className="form-item">
        <div className="form-label w-28">maxSpeed:</div>
        <InputNumber
          min={0}
          max={180}
          className="w-20"
          value={car.maxSpeed}
          onChange={(e) => {
            simpleSetCar("maxSpeed", e);
          }}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">minSpeed:</div>
        <InputNumber
          min={0}
          max={180}
          className="w-20"
          value={car.minSpeed}
          onChange={(e) => {
            simpleSetCar("minSpeed", e);
          }}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">accelerationType:</div>
        <Cascader
          className="w-44"
          allowClear={false}
          options={cascaderOptions}
          expandTrigger="hover"
          value={
            car.accelerationType === SPEED_TYPES.MANUAL
              ? [SPEED_TYPES.MANUAL]
              : [SPEED_TYPES.PROBABILISTIC, car.accelerationType]
          }
          displayRender={displayRender}
          onChange={(e) => {
            setModel({
              ...model,
              cars: model.cars.map((c, i) => {
                if (i === index) {
                  return {
                    ...c,
                    accelerationType: e[e.length - 1] as SPEED_TYPES,
                    accelerationParams: defaultSpeedParams(
                      e[e.length - 1] as SPEED_TYPES
                    ),
                  };
                }
                return c;
              }),
            });
          }}
        />
      </div>
      {getDistributionComponent("accelerationParams", "accelerationType")}
      <div className="form-item">
        <div className="form-label w-28">maxAcceleration:</div>
        <InputNumber
          className="w-20"
          value={car.maxAcceleration}
          onChange={(e) => {
            simpleSetCar("maxAcceleration", e);
          }}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">minAcceleration:</div>
        <InputNumber
          className="w-20"
          value={car.minAcceleration}
          onChange={(e) => {
            simpleSetCar("minAcceleration", e);
          }}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">location:</div>
        <Select
          className="w-44"
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
      </div>
      {getPositionComponent()}
      <div className="form-item">
        <div className="form-label w-28">heading:</div>
        <Select
          className="w-44"
          options={[
            { label: "same", value: "same" },
            { label: "opposite", value: "opposite" },
          ]}
          value={car.heading ? "same" : "opposite"}
          onChange={(e) => {
            simpleSetCar("heading", e === "same");
          }}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">roadDeviation:</div>
        <div>
          <InputNumber
            className="w-16"
            value={car.roadDeviation[0]}
            onChange={(e) => {
              simpleSetCar("roadDeviation", [e, car.roadDeviation[1]]);
            }}
          />
          <span className="ml-2 mr-2">-</span>
          <InputNumber
            className="w-16"
            value={car.roadDeviation[1]}
            onChange={(e) => {
              simpleSetCar("roadDeviation", [car.roadDeviation[0], e]);
            }}
          />
        </div>
      </div>
      <div className="form-item">
        <div className="form-label w-28">dynamic:</div>
        <div>
          <Input value={car.treePath} spellCheck={false} />
          <Button
            type="primary"
            onClick={handleChooseFile}
            className="mt-2"
            icon={<UploadOutlined />}
          >
            Tree File
          </Button>
        </div>
      </div>
    </Card>
  );
}
export default CarInformation;
