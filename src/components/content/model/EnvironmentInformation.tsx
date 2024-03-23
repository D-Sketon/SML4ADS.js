import { Card, Collapse, Input, InputNumber, Select, Tag } from "antd";
import { ReactElement, useEffect, useState } from "react";
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
  const [complexity, setComplexity] = useState(0);
  const handleChangeCloud = (e: number | null, index: number) => {
    const clouds = [
      ENVIRONMENT_CLOUD.CLEAR,
      ENVIRONMENT_CLOUD.FEW_CLOUDS,
      ENVIRONMENT_CLOUD.SCATTERED_CLOUDS,
      ENVIRONMENT_CLOUD.BROKEN_CLOUDS,
      ENVIRONMENT_CLOUD.OVERCAST,
    ];
    const cloudRange = [0, 2, 4, 7, 8];
    let low, high;
    if (index === 0) {
      low = e ?? 0;
      high = model.environment.weather.cloud?.cloudinessLevel?.[1] ?? 0;
    } else {
      low = model.environment.weather.cloud?.cloudinessLevel?.[0] ?? 0;
      high = e ?? 0;
    }
    const type = [];
    let lowType = 0;
    for (let i = 0; i < cloudRange.length; i++) {
      if (low <= cloudRange[i]) {
        lowType = i;
        break;
      }
    }
    let highType = 0;
    for (let i = 0; i < cloudRange.length; i++) {
      if (high <= cloudRange[i]) {
        highType = i;
        break;
      }
    }
    for (let i = lowType; i <= highType; i++) {
      type.push(clouds[i]);
    }
    setModel({
      ...model,
      environment: {
        ...model.environment,
        weather: {
          ...model.environment.weather,
          cloud: {
            cloudinessLevel: index === 0 ? [e, high] : [low, e],
            type,
          },
        },
      },
    });
  };

  const handleChangeSnowfall = (e: number | null, index: number) => {
    const snows = [
      ENVIRONMENT_SNOWFALL.LIGHT_SNOW,
      ENVIRONMENT_SNOWFALL.MODERATE_SNOW,
      ENVIRONMENT_SNOWFALL.HEAVY_SNOW,
    ];
    const snowRange = [1.0, 2.5, 100];
    let low, high;
    if (index === 0) {
      low = e ?? 0;
      high = model.environment.weather.snowfall?.snowfallIntensity?.[1] ?? 0;
    } else {
      low = model.environment.weather.snowfall?.snowfallIntensity?.[0] ?? 0;
      high = e ?? 0;
    }
    const type = [];
    let lowType = 0;
    for (let i = 0; i < snowRange.length; i++) {
      if (low <= snowRange[i]) {
        lowType = i;
        break;
      }
    }
    let highType = 0;
    for (let i = 0; i < snowRange.length; i++) {
      if (high <= snowRange[i]) {
        highType = i;
        break;
      }
    }
    for (let i = lowType; i <= highType; i++) {
      type.push(snows[i]);
    }
    setModel({
      ...model,
      environment: {
        ...model.environment,
        weather: {
          ...model.environment.weather,
          snowfall: {
            snowfallIntensity: index === 0 ? [e, high] : [low, e],
            type,
          },
        },
      },
    });
  };

  const handleChangeRainfall = (e: number | null, index: number) => {
    const rains = [
      ENVIRONMENT_RAINFALL.LIGHT_RAIN,
      ENVIRONMENT_RAINFALL.MODERATE_RAIN,
      ENVIRONMENT_RAINFALL.HEAVY_RAIN,
      ENVIRONMENT_RAINFALL.VIOLENT_RAIN,
      ENVIRONMENT_RAINFALL.CLOUDBURST,
    ];
    const rainRange = [2.5, 7.6, 50, 100, 500];
    let low, high;
    if (index === 0) {
      low = e ?? 0;
      high = model.environment.weather.rainfall?.precipitationIntensity?.[1] ?? 0;
    } else {
      low = model.environment.weather.rainfall?.precipitationIntensity?.[0] ?? 0;
      high = e ?? 0;
    }
    const type = [];
    let lowType = 0;
    for (let i = 0; i < rainRange.length; i++) {
      if (low <= rainRange[i]) {
        lowType = i;
        break;
      }
    }
    let highType = 0;
    for (let i = 0; i < rainRange.length; i++) {
      if (high <= rainRange[i]) {
        highType = i;
        break;
      }
    }
    for (let i = lowType; i <= highType; i++) {
      type.push(rains[i]);
    }
    setModel({
      ...model,
      environment: {
        ...model.environment,
        weather: {
          ...model.environment.weather,
          rainfall: {
            precipitationIntensity: index === 0 ? [e, high] : [low, e],
            type,
          },
        },
      },
    });
  };

  const handleChangeWind = (e: number | null, index: number) => {
    const winds = [
      ENVIRONMENT_WIND.CALM_WIND,
      ENVIRONMENT_WIND.LIGHT_AIR,
      ENVIRONMENT_WIND.LIGHT_BREEZE,
      ENVIRONMENT_WIND.GENTLE_BREEZE,
      ENVIRONMENT_WIND.MODERATE_BREEZE,
      ENVIRONMENT_WIND.FRESH_BREEZE,
      ENVIRONMENT_WIND.STRONG_BREEZE,
      ENVIRONMENT_WIND.NEAR_GALE,
      ENVIRONMENT_WIND.GALE,
      ENVIRONMENT_WIND.STRONG_GALE,
      ENVIRONMENT_WIND.STORM,
      ENVIRONMENT_WIND.VIOLENT_STORM,
      ENVIRONMENT_WIND.HURRICANE,
    ];
    const windRange = [
      0.2,
      1.5,
      3.3,
      5.4,
      7.9,
      10.7,
      13.8,
      17.1,
      20.7,
      24.4,
      28.4,
      32.6,
      100,
    ];
    let low, high;
    if (index === 0) {
      low = e ?? 0;
      high = model.environment.weather.wind?.windSpeed?.[1] ?? 0;
    } else {
      low = model.environment.weather.wind?.windSpeed?.[0] ?? 0;
      high = e ?? 0;
    }
    const type = [];
    let lowType = 0;
    for (let i = 0; i < windRange.length; i++) {
      if (low <= windRange[i]) {
        lowType = i;
        break;
      }
    }
    let highType = 0;
    for (let i = 0; i < windRange.length; i++) {
      if (high <= windRange[i]) {
        highType = i;
        break;
      }
    }
    for (let i = lowType; i <= highType; i++) {
      type.push(winds[i]);
    }
    setModel({
      ...model,
      environment: {
        ...model.environment,
        weather: {
          ...model.environment.weather,
          wind: {
            windSpeed: index === 0 ? [e, high] : [low, e],
            windDirection: model.environment.weather.wind?.windDirection,
            type,
          },
        },
      },
    });
  };
  useEffect(() => {
    const asyncFn = async () => {
      setComplexity(await window.electronAPI.evaluateEnvironment(model.environment));
    };
    asyncFn();
  }, [model.environment]);

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
          className="w-24"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                atmospherePressure: [
                  e,
                  model.environment.atmospherePressure?.[1],
                ],
              },
            });
          }}
          value={model.environment?.atmospherePressure?.[0]}
        />
        <span style={{ margin: "0 5px" }}>-</span>
        <InputNumber
          min={0}
          className="w-24"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                atmospherePressure: [
                  model.environment.atmospherePressure?.[0],
                  e,
                ],
              },
            });
          }}
          value={model.environment?.atmospherePressure?.[1]}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-44">temperature (C):</div>
        <InputNumber
          className="w-24"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                temperature: [e, model.environment.temperature?.[1]],
              },
            });
          }}
          value={model.environment?.temperature?.[0]}
        />
        <span style={{ margin: "0 5px" }}>-</span>
        <InputNumber
          className="w-24"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                temperature: [model.environment.temperature?.[0], e],
              },
            });
          }}
          value={model.environment?.temperature?.[1]}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-44">visibility (m):</div>
        <InputNumber
          min={0}
          className="w-24"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                visibility: [e, model.environment.visibility?.[1]],
              },
            });
          }}
          value={model.environment?.visibility?.[0]}
        />
        <span style={{ margin: "0 5px" }}>-</span>
        <InputNumber
          min={0}
          className="w-24"
          onChange={(e) => {
            setModel({
              ...model,
              environment: {
                ...model.environment,
                visibility: [model.environment.visibility?.[0], e],
              },
            });
          }}
          value={model.environment?.visibility?.[1]}
        />
      </div>
      <Card title="SunProperty" className="box-border m-2 ml-0 inner-card">
        <div className="inner-wrapper">
          <div className="form-item">
            <div className="form-label w-28">sunAzimuth:</div>
            <InputNumber
              className="w-16"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    sunProperty: {
                      sunAzimuth: [
                        e,
                        model.environment.sunProperty?.sunAzimuth?.[1],
                      ],
                      sunElevation: model.environment.sunProperty?.sunElevation,
                    },
                  },
                });
              }}
              value={model.environment?.sunProperty?.sunAzimuth?.[0]}
            />
            <span style={{ margin: "0 5px" }}>-</span>
            <InputNumber
              className="w-16"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    sunProperty: {
                      sunAzimuth: [
                        model.environment.sunProperty?.sunAzimuth?.[0],
                        e,
                      ],
                      sunElevation: model.environment.sunProperty?.sunElevation,
                    },
                  },
                });
              }}
              value={model.environment?.sunProperty?.sunAzimuth?.[1]}
            />
          </div>
          <div className="form-item">
            <div className="form-label w-28">sunElevation:</div>
            <InputNumber
              className="w-16"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    sunProperty: {
                      sunAzimuth: model.environment.sunProperty?.sunAzimuth,
                      sunElevation: [
                        e,
                        model.environment.sunProperty?.sunElevation?.[1],
                      ],
                    },
                  },
                });
              }}
              value={model.environment?.sunProperty?.sunElevation?.[0]}
            />
            <span style={{ margin: "0 5px" }}>-</span>
            <InputNumber
              className="w-16"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    sunProperty: {
                      sunAzimuth: model.environment.sunProperty?.sunAzimuth,
                      sunElevation: [
                        model.environment.sunProperty?.sunElevation?.[0],
                        e,
                      ],
                    },
                  },
                });
              }}
              value={model.environment?.sunProperty?.sunElevation?.[1]}
            />
          </div>
        </div>
      </Card>
      <Card title="Particulates" className="box-border m-2 ml-0 inner-card">
        <div className="form-item">
          <div className="form-label w-fit">type:</div>
          <Select
            className="w-44"
            mode="multiple"
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
            <div className="form-label w-fit">type:</div>
            <Select
              className="w-44"
              mode="multiple"
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
              className="w-16"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    illumination: {
                      type: model.environment.illumination.type,
                      lightingIntensity: [
                        e,
                        model.environment.illumination.lightingIntensity?.[1],
                      ],
                    },
                  },
                });
              }}
              value={model.environment?.illumination?.lightingIntensity?.[0]}
            />
            <span style={{ margin: "0 5px" }}>-</span>
            <InputNumber
              min={0}
              className="w-16"
              onChange={(e) => {
                setModel({
                  ...model,
                  environment: {
                    ...model.environment,
                    illumination: {
                      type: model.environment.illumination.type,
                      lightingIntensity: [
                        model.environment.illumination.lightingIntensity?.[0],
                        e,
                      ],
                    },
                  },
                });
              }}
              value={model.environment?.illumination?.lightingIntensity?.[1]}
            />
          </div>
        </div>
      </Card>
      <Card title="Weather" className="box-border m-2 ml-0 inner-card">
        <Card title="Cloud" className="box-border m-2 ml-0 inner-card">
          <div className="inner-wrapper">
            <div className="form-item">
              <div className="form-label w-fit">type:</div>
              <div className="flex: 1">
                {model.environment?.weather?.cloud?.type?.map((i: string) => (
                  <Tag key={i} color="blue">
                    {i}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="form-item">
              <div className="form-label w-28">level (Okta):</div>
              <InputNumber
                min={0}
                max={8}
                className="w-16"
                onChange={(e) => handleChangeCloud(e, 0)}
                value={model.environment?.weather?.cloud?.cloudinessLevel?.[0]}
              />
              <span style={{ margin: "0 5px" }}>-</span>
              <InputNumber
                min={0}
                max={8}
                className="w-16"
                onChange={(e) => handleChangeCloud(e, 1)}
                value={model.environment?.weather?.cloud?.cloudinessLevel?.[1]}
              />
            </div>
          </div>
        </Card>
        <Card title="Snowfall" className="box-border m-2 ml-0 inner-card">
          <div className="inner-wrapper">
            <div className="form-item">
              <div className="form-label w-fit">type:</div>
              <div className="flex: 1">
                {model.environment?.weather?.snowfall?.type?.map((i: string) => (
                  <Tag key={i} color="blue">
                    {i}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="form-item">
              <div className="form-label w-28">intensity (mm/h):</div>
              <InputNumber
                min={0}
                className="w-16"
                onChange={(e) => handleChangeSnowfall(e, 0)}
                value={
                  model.environment?.weather?.snowfall?.snowfallIntensity?.[0]
                }
              />
              <span style={{ margin: "0 5px" }}>-</span>
              <InputNumber
                min={0}
                className="w-16"
                onChange={(e) => handleChangeSnowfall(e, 1)}
                value={
                  model.environment?.weather?.snowfall?.snowfallIntensity?.[1]
                }
              />
            </div>
          </div>
        </Card>
        <Card title="Rainfall" className="box-border m-2 ml-0 inner-card">
          <div className="inner-wrapper">
            <div className="form-item">
              <div className="form-label w-fit">type:</div>
              <div className="flex: 1">
                {model.environment?.weather?.rainfall?.type?.map((i: string) => (
                  <Tag key={i} color="blue">
                    {i}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="form-item">
              <div className="form-label w-28">intensity (mm/h):</div>
              <InputNumber
                min={0}
                className="w-16"
                onChange={(e) => handleChangeRainfall(e, 0)}
                value={
                  model.environment?.weather?.rainfall
                    ?.precipitationIntensity?.[0]
                }
              />
              <span style={{ margin: "0 5px" }}>-</span>
              <InputNumber
                min={0}
                className="w-16"
                onChange={(e) => handleChangeRainfall(e, 1)}
                value={
                  model.environment?.weather?.rainfall
                    ?.precipitationIntensity?.[1]
                }
              />
            </div>
          </div>
        </Card>
        <Card title="Wind" className="box-border m-2 ml-0 inner-card">
          <div className="inner-wrapper">
            <div className="form-item">
              <div className="form-label w-fit">type:</div>
              <div className="flex: 1">
                {model.environment?.weather?.wind?.type?.map((i: string) => (
                  <Tag key={i} color="blue">
                    {i}
                  </Tag>
                ))}
              </div>
            </div>
            <div className="w-44" style={{ height: '10px' }}></div>
            <div className="form-item">
              <div className="form-label w-28">speed (m/s):</div>
              <InputNumber
                min={0}
                className="w-16"
                onChange={(e) => handleChangeWind(e, 0)}
                value={model.environment?.weather?.wind?.windSpeed?.[0]}
              />
              <span style={{ margin: "0 5px" }}>-</span>
              <InputNumber
                min={0}
                className="w-16"
                onChange={(e) => handleChangeWind(e, 1)}
                value={model.environment?.weather?.wind?.windSpeed?.[1]}
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
          extra: <div>Env Complexity: {complexity}</div>,
        },
      ]}
    ></Collapse>
  );
}
