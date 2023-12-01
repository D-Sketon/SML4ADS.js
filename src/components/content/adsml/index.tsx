import React, { ReactElement, useEffect, useState } from "react";
import { MModel, defaultModel } from "../../../model/Model";
import { checkModel } from "../model/utils/check";
import { Card, Descriptions, DescriptionsProps, notification } from "antd";
import SpeedParamsDesc from "./SpeedParamsDesc";
import { SPEED_PARAMS } from "../../../model/params/ParamSpeed";
import LocationParamsDesc from "./LocationParamsDesc";
import { LOCATION_PARAMS } from "../../../model/params/ParamLocation";

interface AdsmlProps {
  path: string;
}

function Adsml(props: AdsmlProps): ReactElement {
  const { path } = props;
  const [model, setModel] = useState<MModel>(defaultModel());

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      let model: MModel;
      if (!content) {
        model = defaultModel();
      } else {
        model = JSON.parse(content);
        console.log(model);
      }
      // check model
      try {
        checkModel(model);
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.message,
        });
        return;
      }
      setModel(model);
    };
    asyncFn();
  }, [path]);

  const basicInfoItems: DescriptionsProps["items"] = Object.keys(model)
    .map((k) => {
      if (k === "cars") {
        return void 0;
      }
      return {
        label: k,
        key: k,
        children: model[k as keyof MModel],
      };
    })
    .filter((i) => i) as any;

  return (
    <>
      <Card
        hoverable
        title="Basic Information"
        style={{ margin: "10px 10px 10px 0", boxSizing: "border-box" }}
      >
        <Descriptions items={basicInfoItems} />
      </Card>
      {model.cars &&
        model.cars.map((car, index) => {
          return (
            <Card
              hoverable
              title={`Car ${car.name}`}
              key={index}
              style={{ margin: "10px 10px 10px 0", boxSizing: "border-box" }}
            >
              <Descriptions
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
                    children: car.heading ? 'same': 'opposite',
                  },
                  {
                    label: "roadDeviation",
                    key: "roadDeviation",
                    children: car.roadDeviation,
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
                    children: car.minSpeed ?? 'N/A',
                  },
                  {
                    key: "speedParams",
                    children: (
                      <SpeedParamsDesc
                        params={car.speedParams as SPEED_PARAMS}
                      />
                    ),
                    span: 3,
                  },
                  {
                    key: "locationParams",
                    children: (
                      <LocationParamsDesc
                        params={car.locationParams as LOCATION_PARAMS}
                      />
                    ),
                    span: 3,
                  },
                ]}
              />
            </Card>
          );
        })}
    </>
  );
}

export default Adsml;
