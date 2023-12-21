import React, { ReactElement } from "react";
import { Card, Descriptions, DescriptionsProps } from "antd";
import { LOCATION_PARAMS } from "../../../model/params/ParamLocation";
import { SPEED_PARAMS } from "../../../model/params/ParamSpeed";
import LocationParamsDesc from "./LocationParamsDesc";
import SpeedParamsDesc from "./SpeedParamsDesc";
import { MModel } from "../../../model/Model";
import PedestrianLocationDesc from "./PedestrianLocationDesc";

interface AdsmlContentProps {
  model: MModel;
  handleCarClick: (index: number) => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function AdsmlContent({
  model,
  handleCarClick,
  style,
  className,
}: AdsmlContentProps): ReactElement {
  const basicInfoItems: DescriptionsProps["items"] = Object.keys(model)
    .map((k) => {
      if (k === "cars" || k === "pedestrians") {
        return void 0;
      }
      return {
        label: k,
        key: k,
        children: Array.isArray(model[k as keyof MModel])
          ? JSON.stringify(model[k as keyof MModel])
          : model[k as keyof MModel],
      };
    })
    .filter((i) => i) as any;

  return (
    <div style={style} className={className}>
      <Card hoverable title="Basic Information" className="box-border m-2 ml-0">
        <Descriptions items={basicInfoItems} column={2} />
      </Card>
      {model.cars &&
        model.cars.map((car, index) => {
          return (
            <Card
              hoverable
              title={`Car ${car.name}`}
              key={index}
              className="box-border m-2 ml-0"
              onClick={() => handleCarClick(index)}
            >
              <Descriptions
                column={2}
                items={[
                  {
                    label: "name",
                    key: "name",
                    children: car.name,
                  },
                  {
                    label: "model",
                    key: "model",
                    children: car.model,
                  },
                  {
                    label: "locationType",
                    key: "locationType",
                    children: car.locationType,
                  },
                  {
                    label: "heading",
                    key: "heading",
                    children: car.heading ? "same" : "opposite",
                  },
                  {
                    label: "roadDeviation",
                    key: "roadDeviation",
                    children: JSON.stringify(car.roadDeviation),
                  },
                  {
                    label: "treePath",
                    key: "treePath",
                    children: car.treePath,
                  },
                  {
                    label: "speedType",
                    key: "speedType",
                    children: car.speedType,
                  },
                  {
                    label: "maxSpeed",
                    key: "maxSpeed",
                    children: car.maxSpeed,
                  },
                  {
                    label: "minSpeed",
                    key: "minSpeed",
                    children: car.minSpeed ?? "N/A",
                    span: 2,
                  },
                  {
                    key: "speedParams",
                    children: (
                      <SpeedParamsDesc
                        params={car.speedParams as SPEED_PARAMS}
                        title="Speed Params"
                      />
                    ),
                    span: 2,
                  },
                  {
                    label: "accelerationType",
                    key: "accelerationType",
                    children: car.accelerationType,
                  },
                  {
                    label: "maxAcceleration",
                    key: "maxAcceleration",
                    children: car.maxAcceleration,
                  },
                  {
                    label: "minAcceleration",
                    key: "minAcceleration",
                    children: car.minAcceleration ?? "N/A",
                    span: 2,
                  },
                  {
                    key: "accelerationParams",
                    children: (
                      <SpeedParamsDesc
                        params={car.accelerationParams as SPEED_PARAMS}
                        title="Acceleration Params"
                      />
                    ),
                    span: 2,
                  },
                  {
                    key: "locationParams",
                    children: (
                      <LocationParamsDesc
                        params={car.locationParams as LOCATION_PARAMS}
                      />
                    ),
                    span: 2,
                  },
                ]}
              />
            </Card>
          );
        })}
      {model.pedestrians &&
        model.pedestrians.map((pedestrian, index) => {
          return (
            <Card
              hoverable
              title={`Pedestrian ${pedestrian.name}`}
              key={index}
              className="box-border m-2 ml-0"
            >
              <Descriptions
                column={2}
                items={[
                  {
                    label: "name",
                    key: "name",
                    children: pedestrian.name,
                  },
                  {
                    label: "model",
                    key: "model",
                    children: pedestrian.model,
                  },
                  {
                    key: "location",
                    children: (
                      <PedestrianLocationDesc location={pedestrian.location} />
                    ),
                  },
                ]}
              />
            </Card>
          );
        })}
    </div>
  );
}