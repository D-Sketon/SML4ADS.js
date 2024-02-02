import { Card, Collapse, Input, InputNumber, Select } from "antd";
import { ReactElement } from "react";
import { MModel } from "../../../model/Model";
import {
  ENVIRONMENT_CLOUD,
  ENVIRONMENT_COMMUNICATION,
  ENVIRONMENT_ILLUMINATION,
  ENVIRONMENT_PARTICULATES,
  ENVIRONMENT_POSITIONING,
  ENVIRONMENT_RAINFALL,
  ENVIRONMENT_SNOWFALL,
  ENVIRONMENT_WIND,
} from "../../../model/Environment";

interface EnvironmentInformationProps {
  setModel: (value: any) => void;
  model: MModel;
}

export default function EnvironmentInformation({
  setModel,
  model,
}: EnvironmentInformationProps): ReactElement {
  const handleChangeCloud = (e: number | null) => {
    let p;
    if (e === null || e === 0) {
      p = ENVIRONMENT_CLOUD.CLEAR;
    } else if (e <= 2) {
      p = ENVIRONMENT_CLOUD.FEW_CLOUDS;
    } else if (e <= 4) {
      p = ENVIRONMENT_CLOUD.SCATTERED_CLOUDS;
    } else if (e <= 7) {
      p = ENVIRONMENT_CLOUD.BROKEN_CLOUDS;
    } else if (e <= 8) {
      p = ENVIRONMENT_CLOUD.OVERCAST;
    }
    setModel({
      ...model,
      environment: {
        ...model.environment,
        weather: {
          ...model.environment.weather,
          cloud: {
            cloudinessLevel: e,
            type: p,
          },
        },
      },
    });
  };

  const handleChangeSnowfall = (e: number | null) => {
    let p;
    if (e === null || e <= 1.0) {
      p = ENVIRONMENT_SNOWFALL.LIGHT_SNOW;
    } else if (e <= 2.5) {
      p = ENVIRONMENT_SNOWFALL.MODERATE_SNOW;
    } else {
      p = ENVIRONMENT_SNOWFALL.HEAVY_SNOW;
    }
    setModel({
      ...model,
      environment: {
        ...model.environment,
        weather: {
          ...model.environment.weather,
          snowfall: {
            snowfallIntensity: e,
            type: p,
          },
        },
      },
    });
  };

  const handleChangeRainfall = (e: number | null) => {
    let p;
    if (e === null || e <= 2.5) {
      p = ENVIRONMENT_RAINFALL.LIGHT_RAIN;
    } else if (e <= 7.6) {
      p = ENVIRONMENT_RAINFALL.MODERATE_RAIN;
    } else if (e <= 50) {
      p = ENVIRONMENT_RAINFALL.HEAVY_RAIN;
    } else if (e <= 100) {
      p = ENVIRONMENT_RAINFALL.VIOLENT_RAIN;
    } else {
      p = ENVIRONMENT_RAINFALL.CLOUDBURST;
    }
    setModel({
      ...model,
      environment: {
        ...model.environment,
        weather: {
          ...model.environment.weather,
          rainfall: {
            precipitationIntensity: e,
            type: p,
          },
        },
      },
    });
  };

  const handleChangeWind = (e: number | null) => {
    let p;
    if (e === null || e <= 0.2) {
      p = ENVIRONMENT_WIND.CALM_WIND;
    } else if (e <= 1.5) {
      p = ENVIRONMENT_WIND.LIGHT_AIR;
    } else if (e <= 3.3) {
      p = ENVIRONMENT_WIND.LIGHT_BREEZE;
    } else if (e <= 5.4) {
      p = ENVIRONMENT_WIND.GENTLE_BREEZE;
    } else if (e <= 7.9) {
      p = ENVIRONMENT_WIND.MODERATE_BREEZE;
    } else if (e <= 10.7) {
      p = ENVIRONMENT_WIND.FRESH_BREEZE;
    } else if (e <= 13.8) {
      p = ENVIRONMENT_WIND.STRONG_BREEZE;
    } else if (e <= 17.1) {
      p = ENVIRONMENT_WIND.NEAR_GALE;
    } else if (e <= 20.7) {
      p = ENVIRONMENT_WIND.GALE;
    } else if (e <= 24.4) {
      p = ENVIRONMENT_WIND.STRONG_GALE;
    } else if (e <= 28.4) {
      p = ENVIRONMENT_WIND.STORM;
    } else if (e <= 32.6) {
      p = ENVIRONMENT_WIND.VIOLENT_STORM;
    } else {
      p = ENVIRONMENT_WIND.HURRICANE;
    }
    setModel({
      ...model,
      environment: {
        ...model.environment,
        weather: {
          ...model.environment.weather,
          wind: {
            windSpeed: e,
            windDirection: model.environment.weather.wind?.windDirection,
            type: p,
          },
        },
      },
    });
  };

  const innerCard = (
    <Card className="box-border m-2 ml-0">
      <Card title="Connectivity" className="box-border m-2 ml-0 inner-card">
        <div className="inner-wrapper">
          <div className="form-item">
            <div className="form-label w-28">communication:</div>
            <Select
              className="w-44"
              options={Object.values(ENVIRONMENT_COMMUNICATION).map((i) => ({
                value: i,
                label: i,
              }))}
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    connectivity: {
                      communication: e,
                      positioning: model.environment.connectivity?.positioning,
                    },
                  },
                });
              }}
              value={model.environment?.connectivity?.communication}
            />
          </div>
          <div className="form-item">
            <div className="form-label w-28">positioning:</div>
            <Select
              className="w-44"
              options={Object.values(ENVIRONMENT_POSITIONING).map((i) => ({
                value: i,
                label: i,
              }))}
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    connectivity: {
                      positioning: e,
                      communication:
                        model.environment.connectivity?.communication,
                    },
                  },
                });
              }}
              value={model.environment?.connectivity?.positioning}
            />
          </div>
        </div>
      </Card>
      <div className="form-item">
        <div className="form-label w-44">atmospherePressure (Pa):</div>
        <InputNumber
          min={0}
          className="w-44"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                atmospherePressure: e,
              },
            });
          }}
          value={model.environment?.atmospherePressure}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-44">temperature (C):</div>
        <InputNumber
          className="w-44"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                temperature: e,
              },
            });
          }}
          value={model.environment?.temperature}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-44">visibility (m):</div>
        <InputNumber
          min={0}
          className="w-44"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                visibility: e,
              },
            });
          }}
          value={model.environment?.visibility}
        />
      </div>
      <Card title="SunProperty" className="box-border m-2 ml-0 inner-card">
        <div className="inner-wrapper">
          <div className="form-item">
            <div className="form-label w-28">sunAzimuth:</div>
            <InputNumber
              className="w-44"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    sunProperty: {
                      sunAzimuth: e,
                      sunElevation: model.environment.sunProperty?.sunElevation,
                    },
                  },
                });
              }}
              value={model.environment?.sunProperty?.sunAzimuth}
            />
          </div>
          <div className="form-item">
            <div className="form-label w-28">sunElevation:</div>
            <InputNumber
              className="w-44"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    sunProperty: {
                      sunAzimuth: model.environment.sunProperty?.sunAzimuth,
                      sunElevation: e,
                    },
                  },
                });
              }}
              value={model.environment?.sunProperty?.sunElevation}
            />
          </div>
        </div>
      </Card>
      <Card title="Particulates" className="box-border m-2 ml-0 inner-card">
        <div className="form-item">
          <div className="form-label w-28">type:</div>
          <Select
            className="w-44"
            options={Object.values(ENVIRONMENT_PARTICULATES).map((i) => ({
              value: i,
              label: i,
            }))}
            onChange={(e) => {
              setModel({
                ...model,
                environment: {
                  ...model.environment,
                  particulates: {
                    type: e,
                  },
                },
              });
            }}
            value={model.environment?.particulates?.type}
          />
        </div>
      </Card>
      <Card title="Illumination" className="box-border m-2 ml-0 inner-card">
        <div className="inner-wrapper">
          <div className="form-item">
            <div className="form-label w-28">type:</div>
            <Select
              className="w-44"
              options={Object.values(ENVIRONMENT_ILLUMINATION).map((i) => ({
                value: i,
                label: i,
              }))}
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    illumination: {
                      type: e,
                      lightingIntensity:
                        model.environment.illumination.lightingIntensity,
                    },
                  },
                });
              }}
              value={model.environment?.illumination?.type}
            />
          </div>
          <div className="form-item">
            <div className="form-label w-28">intensity (Lux):</div>
            <InputNumber
              min={0}
              className="w-44"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    illumination: {
                      type: model.environment.illumination.type,
                      lightingIntensity: e,
                    },
                  },
                });
              }}
              value={model.environment?.illumination?.lightingIntensity}
            />
          </div>
        </div>
      </Card>
      <Card title="Weather" className="box-border m-2 ml-0 inner-card">
        <Card title="Cloud" className="box-border m-2 ml-0 inner-card">
          <div className="inner-wrapper">
            <div className="form-item">
              <div className="form-label w-28">type:</div>
              <Select
                className="w-44"
                options={Object.values(ENVIRONMENT_CLOUD).map((i) => ({
                  value: i,
                  label: i,
                }))}
                disabled
                value={model.environment?.weather?.cloud?.type}
              />
            </div>
            <div className="form-item">
              <div className="form-label w-28">level (Okta):</div>
              <InputNumber
                min={0}
                max={8}
                className="w-44"
                onChange={handleChangeCloud}
                value={model.environment?.weather?.cloud?.cloudinessLevel}
              />
            </div>
          </div>
        </Card>
        <Card title="Snowfall" className="box-border m-2 ml-0 inner-card">
          <div className="inner-wrapper">
            <div className="form-item">
              <div className="form-label w-28">type:</div>
              <Select
                className="w-44"
                options={Object.values(ENVIRONMENT_SNOWFALL).map((i) => ({
                  value: i,
                  label: i,
                }))}
                disabled
                value={model.environment?.weather?.snowfall?.type}
              />
            </div>
            <div className="form-item">
              <div className="form-label w-28">intensity (mm/h):</div>
              <InputNumber
                min={0}
                className="w-44"
                onChange={handleChangeSnowfall}
                value={model.environment?.weather?.snowfall?.snowfallIntensity}
              />
            </div>
          </div>
        </Card>
        <Card title="Rainfall" className="box-border m-2 ml-0 inner-card">
          <div className="inner-wrapper">
            <div className="form-item">
              <div className="form-label w-28">type:</div>
              <Select
                className="w-44"
                options={Object.values(ENVIRONMENT_RAINFALL).map((i) => ({
                  value: i,
                  label: i,
                }))}
                disabled
                value={model.environment?.weather?.rainfall?.type}
              />
            </div>
            <div className="form-item">
              <div className="form-label w-28">intensity (mm/h):</div>
              <InputNumber
                min={0}
                className="w-44"
                onChange={handleChangeRainfall}
                value={
                  model.environment?.weather?.rainfall?.precipitationIntensity
                }
              />
            </div>
          </div>
        </Card>
        <Card title="Wind" className="box-border m-2 ml-0 inner-card">
          <div className="inner-wrapper">
            <div className="form-item">
              <div className="form-label w-28">type:</div>
              <Select
                className="w-44"
                options={Object.values(ENVIRONMENT_WIND).map((i) => ({
                  value: i,
                  label: i,
                }))}
                disabled
                value={model.environment?.weather?.wind?.type}
              />
            </div>
            <div className="form-item">
              <div className="form-label w-28">speed (m/s):</div>
              <InputNumber
                min={0}
                className="w-44"
                onChange={handleChangeWind}
                value={model.environment?.weather?.wind?.windSpeed}
              />
            </div>
            <div className="form-item">
              <div className="form-label w-28">direction:</div>
              <Input
                className="w-44"
                onChange={(e) => {
                  setModel({
                    ...model,
                    environment: {
                      ...model.environment,
                      weather: {
                        ...model.environment.weather,
                        wind: {
                          ...model.environment.weather.wind,
                          windDirection: e.target.value,
                        },
                      },
                    },
                  });
                }}
                value={model.environment?.weather?.wind?.windDirection}
              />
            </div>
          </div>
        </Card>
      </Card>
    </Card>
  );

  return (
    <Collapse
      className="box-border m-2 ml-0"
      items={[
        {
          key: "env",
          label: "Environment Information",
          children: innerCard,
        },
      ]}
    ></Collapse>
  );
}
