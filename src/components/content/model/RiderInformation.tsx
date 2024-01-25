import { ReactElement } from "react";
import { MModel } from "../../../model/Model";
import {
  GLOBAL_POSITION_PARAMS,
  LANE_POSITION_PARAMS,
  LOCATION_TYPES,
  RELATED_POSITION_PARAMS,
  ROAD_POSITION_PARAMS,
  defaultGlobalPositionParams,
  defaultLocationParams,
} from "../../../model/params/ParamLocation";
import { Button, Card, Input, InputNumber, Select } from "antd";

interface RiderInformationProps {
  model: MModel;
  setModel: (value: any) => void;
  index: number;
  path: string;
}

export default function RiderInformation({
  model,
  setModel,
  index,
  path,
}: RiderInformationProps): ReactElement {
  const rider = model.riders[index];

  const handleDelete = (): void => {
    setModel({
      ...model,
      riders: model.riders.filter((_, i) => i !== index),
    });
  };

  const handleDeleteLocation = (_index: number): void => {
    setModel({
      ...model,
      riders: model.riders.map((c, i) => {
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
      riders: model.riders.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            location: [
              ...c.location,
              {
                locationType: LOCATION_TYPES.GLOBAL_POSITION,
                locationParams: defaultGlobalPositionParams(),
                speed: 0,
              },
            ],
          };
        }
        return c;
      }),
    });
  };

  const simpleSetRider = (key: string, value: any): void => {
    setModel({
      ...model,
      riders: model.riders.map((c, i) => {
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

  const simpleSetRiderLocation = (
    key: string,
    value: any,
    _index: number
  ): void => {
    setModel((model: MModel) => ({
      ...model,
      riders: model.riders.map((c, i) => {
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
              (rider.location[_index].locationParams as GLOBAL_POSITION_PARAMS)
                .x[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "x",
                [
                  e,
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as GLOBAL_POSITION_PARAMS)
                .x[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "x",
                [
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as GLOBAL_POSITION_PARAMS)
                .y[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "y",
                [
                  e,
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as GLOBAL_POSITION_PARAMS)
                .y[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "y",
                [
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as LANE_POSITION_PARAMS)
                .roadId
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
              (rider.location[_index].locationParams as LANE_POSITION_PARAMS)
                .laneId
            }
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (rider.location[_index].locationParams as LANE_POSITION_PARAMS)
                .lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  e,
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as LANE_POSITION_PARAMS)
                .lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as LANE_POSITION_PARAMS)
                .longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  e,
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as LANE_POSITION_PARAMS)
                .longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as ROAD_POSITION_PARAMS)
                .roadId
            }
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (rider.location[_index].locationParams as ROAD_POSITION_PARAMS)
                .lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  e,
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as ROAD_POSITION_PARAMS)
                .lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as ROAD_POSITION_PARAMS)
                .longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  e,
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as ROAD_POSITION_PARAMS)
                .longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as RELATED_POSITION_PARAMS)
                .actorRef
            }
          />
        </div>
        <div className="form-item">
          <div className="form-label w-28">lateralOffset:</div>
          <InputNumber
            className="w-16"
            value={
              (rider.location[_index].locationParams as RELATED_POSITION_PARAMS)
                .lateralOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  e,
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as RELATED_POSITION_PARAMS)
                .lateralOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "lateralOffset",
                [
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as RELATED_POSITION_PARAMS)
                .longitudinalOffset[0]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  e,
                  (
                    rider.location[_index]
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
              (rider.location[_index].locationParams as RELATED_POSITION_PARAMS)
                .longitudinalOffset[1]
            }
            onChange={(e) => {
              simpleSetLocationParams(
                "longitudinalOffset",
                [
                  (
                    rider.location[_index]
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
      riders: model.riders.map((c, i) => {
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
    value: any,
    _index: number
  ): void => {
    setModel((model: MModel) => ({
      ...model,
      riders: model.riders.map((c, i) => {
        if (i === index) {
          return {
            ...c,
            location: c.location.map((l, j) => {
              if (j === _index) {
                return {
                  ...l,
                  speed: value
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
    switch (rider.location[_index].locationType) {
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

  return (
    <Card
      hoverable
      title="Rider"
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
          value={rider.name}
          onChange={(e) => {
            simpleSetRider("name", e.target.value);
          }}
        />
      </div>
      {rider.location.map((_, index) => (
        <Card
          hoverable
          title="Location Point"
          extra={
            index === 0 ? (
              <></>
            ) : (
              <Button
                type="primary"
                onClick={() => handleDeleteLocation(index)}
              >
                Delete
              </Button>
            )
          }
          className="box-border mt-2 mb-2 inner-card"
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
              value={rider.location[index].locationType}
              onChange={(e) => {
                simpleSetRiderLocation("locationType", e, index);
                simpleSetRiderLocation(
                  "locationParams",
                  defaultLocationParams(e),
                  index
                );
              }}
            />
          </div>
          {getPositionComponent(index)}
          {index === 0 ? (
            <></>
          ) : (
            <div className="form-item">
              <div className="form-label w-28">speed:</div>
              <InputNumber
                className="w-36"
                onChange={(e) => {
                  simpleSetSpeedParams(e, index);
                }}
                value={rider.location[index].speed}
              />
            </div>
          )}
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
