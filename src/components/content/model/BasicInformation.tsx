import { Card, Select, Button, InputNumber, Input, Collapse } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ReactElement } from "react";

import {
  DEFAULT_MAP_TYPES,
  MAP_TYPES,
  MModel,
  ROAD_TYPES,
  SIMULATOR_TYPES,
  TRAFFIC_CONDITIONS,
  WEATHER_TYPES_CARLA,
  WEATHER_TYPES_LGSVL,
} from "../../../model/Model";
import { FILE_SUFFIX } from "../../../constants";
import { UploadOutlined } from "@ant-design/icons";

interface BasicInformationProps {
  setModel: (value: any) => void;
  model: MModel;
  path: string;
}

export default function BasicInformation({
  model,
  setModel,
  path,
}: BasicInformationProps): ReactElement {
  const handleChooseFile = async (): Promise<void> => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.XODR]);
    if (res.filePaths.length) {
      const relativePath = await window.electronAPI.getRelativePath(
        path,
        res.filePaths[0]
      );
      setModel({ ...model, map: relativePath });
    }
  };

  const handleChooseStlFile = async (): Promise<void> => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.ADSTL]);
    if (res.filePaths.length) {
      const relativePath = await window.electronAPI.getRelativePath(
        path,
        res.filePaths[0]
      );
      setModel({ ...model, stlPath: relativePath });
    }
  };
  const innerCard = (
    <Card>
      <div className="form-item">
        <div className="form-label w-28">simulatorType:</div>
        <Select
          className="w-44"
          options={Object.values(SIMULATOR_TYPES).map((i) => ({
            value: i,
            label: i,
          }))}
          onChange={(e) => {
            setModel({ ...model, simulatorType: e });
          }}
          value={model.simulatorType}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">mapType:</div>
        <Select
          className="w-44"
          options={Object.values(MAP_TYPES).map((i) => ({
            value: i,
            label: i,
          }))}
          onChange={(e) => {
            if (e === MAP_TYPES.CUSTOM) {
              setModel({ ...model, mapType: e, map: "" });
            } else if (e === MAP_TYPES.DEFAULT) {
              setModel({
                ...model,
                mapType: e,
                map: DEFAULT_MAP_TYPES.TOWN_01,
              });
            }
          }}
          value={model.mapType}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">map:</div>
        {model.mapType === MAP_TYPES.CUSTOM ? (
          <div className="flex items-center">
            <Input value={model.map} spellCheck={false} />
            <Button
              type="primary"
              className="mr-2 ml-2"
              onClick={handleChooseFile}
              icon={<UploadOutlined />}
            >
              Map File
            </Button>
            {/* <span className="overflow-hidden text-ellipsis">{model.map}</span> */}
          </div>
        ) : (
          <div className="flex items-center">
            <Select
              className="w-44"
              options={Object.values(DEFAULT_MAP_TYPES).map((i) => ({
                value: i,
                label: i,
              }))}
              onChange={(e) => {
                setModel({ ...model, map: e });
              }}
              value={model.map}
            />
          </div>
        )}
      </div>
      <div className="form-item">
        <div className="form-label w-28">simulatorWeather:</div>
        <Select
          className="w-44"
          mode="multiple"
          options={
            model.simulatorType === SIMULATOR_TYPES.CARLA
              ? Object.values(WEATHER_TYPES_CARLA).map((i) => ({
                  value: i,
                  label: i,
                }))
              : Object.values(WEATHER_TYPES_LGSVL).map(
                  (i) => ({ value: i, label: i } as any)
                )
          }
          onChange={(e) => {
            setModel({ ...model, weather: e });
          }}
          allowClear
          value={model.weather}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">timeStep:</div>
        <InputNumber
          min={0.1}
          max={10}
          className="w-44"
          onChange={(e) => {
            setModel({ ...model, timeStep: e });
          }}
          value={model.timeStep}
        />
      </div>
      <div className="form-item">
        <div className="form-label w-28">simulationTime:</div>
        <InputNumber
          min={0.1}
          max={40.0}
          className="w-44"
          onChange={(e) => {
            setModel({ ...model, simulationTime: e });
          }}
          value={model.simulationTime}
        />
      </div>
      {model.trafficCondition ? (
        <div className="form-item">
          <div className="form-label w-28">trafficCondition:</div>
          <Select
            className="w-44"
            options={Object.values(TRAFFIC_CONDITIONS).map((i) => ({
              value: i,
              label: i,
            }))}
            onChange={(e) => {
              setModel({ ...model, trafficCondition: e });
            }}
            value={model.trafficCondition}
          />
        </div>
      ) : (
        <></>
      )}
      {model.roadType ? (
        <div className="form-item">
          <div className="form-label w-28">roadType:</div>
          <Select
            className="w-44"
            options={Object.values(ROAD_TYPES).map((i) => ({
              value: i,
              label: i,
            }))}
            onChange={(e) => {
              setModel({ ...model, roadType: e });
            }}
            value={model.roadType}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="form-item">
        <div className="form-label w-28">STL:</div>
        <div className="flex items-center">
          <Input value={model.stlPath} spellCheck={false} />
          <Button
            type="primary"
            className="mr-2 ml-2"
            onClick={handleChooseStlFile}
            icon={<UploadOutlined />}
          >
            ADSTL File
          </Button>
        </div>
      </div>
      <div className="form-item">
        <div className="form-label w-28">scenarioTrigger:</div>
        <TextArea
          rows={3}
          maxLength={1024}
          onChange={(e) => {
            setModel({ ...model, scenarioEndTrigger: e.target.value });
          }}
          value={model.scenarioEndTrigger}
        />
      </div>
    </Card>
  );
  return (
    <Collapse
      className="box-border m-2 ml-0"
      items={[
        {
          key: "basic",
          label: "Basic Information",
          children: innerCard,
        },
      ]}
    ></Collapse>
  );
}
