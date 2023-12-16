import { Card, Select, Button, InputNumber, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ReactElement } from "react";

import {
  DEFAULT_MAP_TYPES,
  MAP_TYPES,
  MModel,
  SIMULATOR_TYPES,
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

function BasicInformation(props: BasicInformationProps): ReactElement {
  const { model, setModel, path } = props;
  async function handleChooseFile(): Promise<void> {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.XODR]);
    if (res.filePaths.length) {
      const relativePath = await window.electronAPI.getRelativePath(
        path,
        res.filePaths[0]
      );
      setModel({ ...model, map: relativePath });
    }
  }
  return (
    <Card hoverable title="Basic Information" className="box-border m-2 ml-0">
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
        <div className="form-label w-28">simulatorType:</div>
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
}
export default BasicInformation;
