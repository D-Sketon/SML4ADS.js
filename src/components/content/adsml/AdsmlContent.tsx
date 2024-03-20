import React, { ReactElement } from "react";
import { Card, Descriptions } from "antd";
import { LOCATION_PARAMS } from "../../../model/params/ParamLocation";
import { SPEED_PARAMS } from "../../../model/params/ParamSpeed";
import LocationParamsDesc from "./LocationParamsDesc";
import SpeedParamsDesc from "./SpeedParamsDesc";
import { MModel } from "../../../model/Model";
import PedestrianLocationDesc from "./PedestrianLocationDesc";
import RiderLocationDesc from "./RiderLocationDesc";

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
  const basicInfoItems = Object.keys(model)
    .map((k) => {
      if (k === "cars" || k === "pedestrians" || k === "environment" || k === "riders") {
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

  const environmentInfoItems = [
    {
      label: "atmospherePressure",
      key: "atmospherePressure",
      children: JSON.stringify(model.environment.atmospherePressure),
    },
    {
      label: "temperature",
      key: "temperature",
      children: JSON.stringify(model.environment.temperature),
    },
    {
      label: "visibility",
      key: "visibility",
      children: JSON.stringify(model.environment.visibility),
      span: 2,
    },
    {
      key: "sunProperty",
      children: (
        <Descriptions
          title="Sun Property"
          column={2}
          items={[
            {
              label: "azimuth",
              key: "azimuth",
              children: JSON.stringify(model.environment.sunProperty?.sunAzimuth),
            },
            {
              label: "elevation",
              key: "elevation",
              children: JSON.stringify(model.environment.sunProperty?.sunElevation),
            },
          ]}
        />
      ),
      span: 2,
    },
    {
      key: "particulates",
      children: (
        <Descriptions
          title="Particulates"
          column={2}
          items={[
            {
              label: "type",
              key: "particulatesType",
              children: model.environment.particulates?.type,
            },
          ]}
        />
      ),
      span: 2,
    },
    {
      key: "illumination",
      children: (
        <Descriptions
          title="Illumination"
          column={2}
          items={[
            {
              label: "type",
              key: "illuminationType",
              children: model.environment.illumination?.type,
            },
            {
              label: "intensity",
              key: "illuminationIntensity",
              children: JSON.stringify(model.environment.illumination?.lightingIntensity),
            },
          ]}
        />
      ),
      span: 2,
    },
    {
      key: "cloud",
      children: (
        <Descriptions
          title="Cloud"
          column={2}
          items={[
            {
              label: "type",
              key: "cloudType",
              children: JSON.stringify(model.environment.weather?.cloud?.type),
            },
            {
              label: "level",
              key: "cloudinessLevel",
              children: JSON.stringify(model.environment.weather?.cloud?.cloudinessLevel),
            },
          ]}
        />
      ),
      span: 2,
    },
    {
      key: "snowfall",
      children: (
        <Descriptions
          title="Snowfall"
          column={2}
          items={[
            {
              label: "type",
              key: "snowfallType",
              children: JSON.stringify(model.environment.weather?.snowfall?.type),
            },
            {
              label: "intensity",
              key: "snowfallIntensity",
              children: JSON.stringify(model.environment.weather?.snowfall?.snowfallIntensity),
            },
          ]}
        />
      ),
      span: 2,
    },
    {
      key: "rainfall",
      children: (
        <Descriptions
          title="Rainfall"
          column={2}
          items={[
            {
              label: "type",
              key: "rainfallType",
              children: JSON.stringify(model.environment.weather?.rainfall?.type),
            },
            {
              label: "intensity",
              key: "precipitationIntensity",
              children:
              JSON.stringify(model.environment.weather?.rainfall?.precipitationIntensity),
            },
          ]}
        />
      ),
      span: 2,
    },
    {
      key: "wind",
      children: (
        <Descriptions
          title="Wind"
          column={2}
          items={[
            {
              label: "type",
              key: "windType",
              children: JSON.stringify(model.environment.weather?.wind?.type),
            },
            {
              label: "speed",
              key: "windSpeed",
              children: JSON.stringify(model.environment.weather?.wind?.windSpeed),
            },
            {
              label: "direction",
              key: "windDirection",
              children: model.environment.weather?.wind?.windDirection,
            },
          ]}
        />
      ),
      span: 2,
    },
    {
      key: "connectivity",
      children: (
        <Descriptions
          title="Connectivity"
          column={2}
          items={[
            {
              label: "communication",
              key: "communication",
              children: model.environment.connectivity?.communication,
            },
            {
              label: "positioning",
              key: "positioning",
              children: model.environment.connectivity?.positioning,
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div style={style} className={className}>
      <Card hoverable title="Basic Information" className="box-border m-2 ml-0">
        <Descriptions items={basicInfoItems} column={2} />
      </Card>
      <Card
        hoverable
        title="Environment Information"
        className="box-border m-2 ml-0"
      >
        <Descriptions items={environmentInfoItems} column={2} />
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
                    label: "type",
                    key: "type",
                    children: car.type,
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
      {model.riders &&
        model.riders.map((rider, index) => {
          return (
            <Card
              hoverable
              title={`Pedestrian ${rider.name}`}
              key={index}
              className="box-border m-2 ml-0"
            >
              <Descriptions
                column={2}
                items={[
                  {
                    label: "name",
                    key: "name",
                    children: rider.name,
                    span: 2,
                  },
                  {
                    key: "location",
                    children: (
                      <RiderLocationDesc location={rider.location} />
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
