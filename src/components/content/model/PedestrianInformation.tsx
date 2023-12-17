import { Button, Card, Input, InputNumber, Select } from "antd";
import { ReactElement } from "react";
import { MModel, SIMULATOR_TYPES } from "../../../model/Model";
import {
  PEDESTRIAN_SPEED_PARAMS,
  PEDESTRIAN_SPEED_TYPES,
  PEDESTRIAN_TYPES_CARLA,
  defaultPedestrianSpeedParams,
} from "../../../model/Pedestrian";
import {
  GLOBAL_POSITION_PARAMS,
  LANE_POSITION_PARAMS,
  LOCATION_TYPES,
  RELATED_POSITION_PARAMS,
  ROAD_POSITION_PARAMS,
  defaultGlobalPositionParams,
  defaultLocationParams,
} from "../../../model/params/ParamLocation";

interface PedestrianInformationProps {
  model: MModel;
  setModel: (value: any) => void;
  index: number;
  path: string;
}

export default function PedestrianInformation({
  model,
  setModel,
  index,
  path,
}: PedestrianInformationProps): ReactElement {
  const pedestrian = model.pedestrians[index];

  const handleDelete = (): void => {
    setModel({
      ...model,
      pedestrians: model.pedestrians.filter((_, i) => i !== index),
    });
  };

  const handleDeleteLocation = (_index: number): void => {
    setModel({
      ...model,
      pedestrians: model.pedestrians.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            location: c.location.filter((_, i) => i !== _index),
          };
        }
        return c;
      }),
    });
  };

  const handleAddLocationPoint = (): void => {
    setModel({
      ...model,
      pedestrians: model.pedestrians.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            location: [
              ...c.location,
              {
                locationType: LOCATION_TYPES.GLOBAL_POSITION,
                locationParams: defaultGlobalPositionParams(),
                speedType: PEDESTRIAN_SPEED_TYPES.WALK,
                speedParams: {},
              },
            ],
          };
        }
        return c;
      }),
    });
  };

  const simpleSetPedestrian = (key: string, value: any): void => {
    setModel({
      ...model,
      pedestrians: model.pedestrians.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            [key]: value,
          };
        }
        return c;
      }),
    });
  };

  const simpleSetPedestrianLocation = (
    key: string,
    value: any,
    _index: number
  ): void => {
    setModel((model: MModel) => ({
      ...model,
      pedestrians: model.pedestrians.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            location: c.location.map((l, j) => {
              if (j === _index) {
                return {
                  ...l,
                  [key]: value,
                };
              }
              return l;
            }),
          };
        }
        return c;
      }),
    }));
  };

  // location
  const globalPosition = (_index: number): ReactElement => {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-28">x:</div>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as GLOBAL_POSITION_PARAMS
              ).x[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "x",
                [
                  e,
                  (
                    pedestrian.location[_index]
                      .locationParams as GLOBAL_POSITION_PARAMS
                  ).x[1],
                ],
                _index
              );
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as GLOBAL_POSITION_PARAMS
              ).x[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "x",
                [
                  (
                    pedestrian.location[_index]
                      .locationParams as GLOBAL_POSITION_PARAMS
                  ).x[0],
                  e,
                ],
                _index
              );
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">y:</div>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as GLOBAL_POSITION_PARAMS
              ).y[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "y",
                [
                  e,
                  (
                    pedestrian.location[_index]
                      .locationParams as GLOBAL_POSITION_PARAMS
                  ).y[1],
                ],
                _index
              );
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as GLOBAL_POSITION_PARAMS
              ).y[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "y",
                [
                  (
                    pedestrian.location[_index]
                      .locationParams as GLOBAL_POSITION_PARAMS
                  ).y[0],
                  e,
                ],
                _index
              );
            }}
          />
        </div>
      </>
    );
  };

  const lanePosition = (_index: number): ReactElement => {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-28">roadId:</div>
          <InputNumber
            className="w-36"
            onChange={(e) => {
              simpleSetLocationParams("roadId", e, _index);
            }}
            value={
              (
                pedestrian.location[_index]
                  .locationParams as LANE_POSITION_PARAMS
              ).roadId
            }
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">laneId:</div>
          <InputNumber
            className="w-36"
            onChange={(e) => {
              simpleSetLocationParams("laneId", e, _index);
            }}
            value={
              (
                pedestrian.location[_index]
                  .locationParams as LANE_POSITION_PARAMS
              ).laneId
            }
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as LANE_POSITION_PARAMS
              ).lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  e,
                  (
                    pedestrian.location[_index]
                      .locationParams as LANE_POSITION_PARAMS
                  ).lateralOffset[1],
                ],
                _index
              );
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as LANE_POSITION_PARAMS
              ).lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  (
                    pedestrian.location[_index]
                      .locationParams as LANE_POSITION_PARAMS
                  ).lateralOffset[0],
                  e,
                ],
                _index
              );
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">longitudinalOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as LANE_POSITION_PARAMS
              ).longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  e,
                  (
                    pedestrian.location[_index]
                      .locationParams as LANE_POSITION_PARAMS
                  ).longitudinalOffset[1],
                ],
                _index
              );
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as LANE_POSITION_PARAMS
              ).longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  (
                    pedestrian.location[_index]
                      .locationParams as LANE_POSITION_PARAMS
                  ).longitudinalOffset[0],
                  e,
                ],
                _index
              );
            }}
          />
        </div>
      </>
    );
  };

  const roadPosition = (_index: number): ReactElement => {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-28">roadId:</div>
          <InputNumber
            className="w-36"
            onChange={(e) => {
              simpleSetLocationParams("roadId", e, _index);
            }}
            value={
              (
                pedestrian.location[_index]
                  .locationParams as ROAD_POSITION_PARAMS
              ).roadId
            }
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as ROAD_POSITION_PARAMS
              ).lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  e,
                  (
                    pedestrian.location[_index]
                      .locationParams as ROAD_POSITION_PARAMS
                  ).lateralOffset[1],
                ],
                _index
              );
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as ROAD_POSITION_PARAMS
              ).lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  (
                    pedestrian.location[_index]
                      .locationParams as ROAD_POSITION_PARAMS
                  ).lateralOffset[0],
                  e,
                ],
                _index
              );
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">longitudinalOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as ROAD_POSITION_PARAMS
              ).longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  e,
                  (
                    pedestrian.location[_index]
                      .locationParams as ROAD_POSITION_PARAMS
                  ).longitudinalOffset[1],
                ],
                _index
              );
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as ROAD_POSITION_PARAMS
              ).longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  (
                    pedestrian.location[_index]
                      .locationParams as ROAD_POSITION_PARAMS
                  ).longitudinalOffset[0],
                  e,
                ],
                _index
              );
            }}
          />
        </div>
      </>
    );
  };

  const relatedPosition = (_index: number): ReactElement => {
    return (
      <>
        <div className="form-item">
          <div className="form-label w-28">actorRef:</div>
          <Input
            className="w-36"
            onChange={(e) => {
              simpleSetLocationParams("actorRef", e.target.value, _index);
            }}
            value={
              (
                pedestrian.location[_index]
                  .locationParams as RELATED_POSITION_PARAMS
              ).actorRef
            }
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as RELATED_POSITION_PARAMS
              ).lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  e,
                  (
                    pedestrian.location[_index]
                      .locationParams as RELATED_POSITION_PARAMS
                  ).lateralOffset[1],
                ],
                _index
              );
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as RELATED_POSITION_PARAMS
              ).lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  (
                    pedestrian.location[_index]
                      .locationParams as RELATED_POSITION_PARAMS
                  ).lateralOffset[0],
                  e,
                ],
                _index
              );
            }}
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">longitudinalOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as RELATED_POSITION_PARAMS
              ).longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  e,
                  (
                    pedestrian.location[_index]
                      .locationParams as RELATED_POSITION_PARAMS
                  ).longitudinalOffset[1],
                ],
                _index
              );
            }}
          />
          <span style={{ margin: "0 5px" }}>-</span>
          <InputNumber
            className="w-16"
            value={
              (
                pedestrian.location[_index]
                  .locationParams as RELATED_POSITION_PARAMS
              ).longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  (
                    pedestrian.location[_index]
                      .locationParams as RELATED_POSITION_PARAMS
                  ).longitudinalOffset[0],
                  e,
                ],
                _index
              );
            }}
          />
        </div>
      </>
    );
  };

  const simpleSetLocationParams = (
    key: string,
    value: any,
    _index: number
  ): void => {
    setModel((model: MModel) => ({
      ...model,
      pedestrians: model.pedestrians.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            location: c.location.map((l, j) => {
              if (j === _index) {
                return {
                  ...l,
                  locationParams: {
                    ...l.locationParams,
                    [key]: value,
                  },
                };
              }
              return l;
            }),
          };
        }
        return c;
      }),
    }));
  };

  const simpleSetSpeedParams = (
    key: string,
    value: any,
    _index: number
  ): void => {
    setModel((model: MModel) => ({
      ...model,
      pedestrians: model.pedestrians.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            location: c.location.map((l, j) => {
              if (j === _index) {
                return {
                  ...l,
                  speedParams: {
                    ...l.speedParams,
                    [key]: value,
                  },
                };
              }
              return l;
            }),
          };
        }
        return c;
      }),
    }));
  };

  const getPositionComponent = (_index: number): ReactElement => {
    switch (pedestrian.location[_index].locationType) {
      case LOCATION_TYPES.GLOBAL_POSITION:
        return globalPosition(_index);
      case LOCATION_TYPES.LANE_POSITION:
        return lanePosition(_index);
      case LOCATION_TYPES.ROAD_POSITION:
        return roadPosition(_index);
      case LOCATION_TYPES.RELATED_POSITION:
        return relatedPosition(_index);
      default:
        return <></>;
    }
  };

  const getPedestrianSpeedComponent = (_index: number): ReactElement => {
    switch (pedestrian.location[_index].speedType) {
      case PEDESTRIAN_SPEED_TYPES.MANUAL:
        return (
          <div className="form-item">
            <div className="form-label w-28">speed:</div>
            <InputNumber
              className="w-36"
              onChange={(e) => {
                simpleSetSpeedParams("speed", e, _index);
              }}
              value={
                (
                  pedestrian.location[_index]
                    .speedParams as PEDESTRIAN_SPEED_PARAMS
                ).speed!
              }
            />
          </div>
        );
      default:
        return <></>;
    }
  };

  return (
    <Card
      hoverable
      title="Pedestrian"
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
          value={pedestrian.name}
          onChange={(e) => {
            simpleSetPedestrian("name", e.target.value);
          }}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">model:</div>
        <Select
          className="w-44"
          options={
            model.simulatorType === SIMULATOR_TYPES.CARLA
              ? Object.values(PEDESTRIAN_TYPES_CARLA).map((i) => ({
                  label: i.startsWith("walker.")
                    ? i.split(".").slice(1).join(".")
                    : i,
                  value: i,
                }))
              : []
          }
          value={pedestrian.model}
          onChange={(e) => {
            simpleSetPedestrian("model", e);
          }}
        />
      </div>
      {pedestrian.location.map((_, index) => (
        <Card
          hoverable
          title="Location Point"
          extra={
            <Button type="primary" onClick={() => handleDeleteLocation(index)}>
              Delete
            </Button>
          }
          className="box-border mt-2 mb-2"
          key={index}
        >
          <div className="form-item">
            <div className="form-label w-20">locationType:</div>
            <Select
              className="w-44"
              options={Object.values(LOCATION_TYPES).map((i) => ({
                label: i,
                value: i,
              }))}
              value={pedestrian.location[index].locationType}
              onChange={(e) => {
                simpleSetPedestrianLocation("locationType", e, index);
                simpleSetPedestrianLocation(
                  "locationParams",
                  defaultLocationParams(e),
                  index
                );
              }}
            />
          </div>
          {getPositionComponent(index)}
          <div className="form-item">
            <div className="form-label w-20">speedType:</div>
            <Select
              className="w-44"
              options={Object.values(PEDESTRIAN_SPEED_TYPES).map((i) => ({
                label: i,
                value: i,
              }))}
              value={pedestrian.location[index].speedType}
              onChange={(e) => {
                simpleSetPedestrianLocation("speedType", e, index);
                simpleSetPedestrianLocation(
                  "speedParams",
                  defaultPedestrianSpeedParams(e),
                  index
                );
              }}
            />
          </div>
          {getPedestrianSpeedComponent(index)}
        </Card>
      ))}
      <div className="box-border pr-2 pb-2 mt-2">
        <Button type="primary" block onClick={handleAddLocationPoint}>
          + Add Location Point
        </Button>
      </div>
    </Card>
  );
}
