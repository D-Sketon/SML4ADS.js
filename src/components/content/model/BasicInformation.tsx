import { Card, Form, Select, Button, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ReactElement, useContext } from "react";

import {
  MAP_TYPES,
  MModel,
  SIMULATOR_TYPES,
  WEATHER_TYPES_CARLA,
  WEATHER_TYPES_LGSVL,
} from "../../../model/Model";
import { FILE_SUFFIX } from "../../../constants";
import AppContext from "../../../store/context";

interface BasicInformationProps {
  setModel: (value: any) => void;
  model: MModel;
}

function BasicInformation(props: BasicInformationProps): ReactElement {
  const { model, setModel } = props;
  const { state } = useContext(AppContext);

  async function handleChooseFile(): Promise<void> {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.XODR]);
    if (res.filePaths.length) {
      const relativePath = await window.electronAPI.getRelativePath(
        state.workspacePath,
        res.filePaths[0]
      );
      setModel({ ...model, map: relativePath });
    }
  }
  return (
    <Card
      hoverable
      title="Basic Information"
      style={{ margin: "10px 10px 10px 0", boxSizing: "border-box" }}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} autoComplete="off">
        <Form.Item label="simulatorType">
          <Select
            style={{ width: 150 }}
            options={Object.values(SIMULATOR_TYPES).map((i) => ({
              value: i,
              label: i,
            }))}
            onChange={(e) => {
              setModel({ ...model, simulatorType: e });
            }}
            value={model.simulatorType}
          />
        </Form.Item>
        <Form.Item label="map">
          <Form.Item>
            <Select
              style={{ width: 150 }}
              options={Object.values(MAP_TYPES).map((i) => ({
                value: i,
                label: i,
              }))}
              onChange={(e) => {
                setModel({ ...model, mapType: e });
              }}
              value={model.mapType}
            />
          </Form.Item>
          {model.map === MAP_TYPES.CUSTOM ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="primary"
                style={{ marginRight: "20px", width: 120 }}
                onClick={handleChooseFile}
              >
                Choose File
              </Button>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {model.map}
              </span>
            </div>
          ) : (
            <></>
          )}
        </Form.Item>

        <Form.Item label="weather">
          <Select
            style={{ width: 150 }}
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
        </Form.Item>
        <Form.Item label="timeStep">
          <InputNumber
            min={0.1}
            max={10}
            style={{ width: 150 }}
            onChange={(e) => {
              setModel({ ...model, timeStep: e });
            }}
            value={model.timeStep}
          />
        </Form.Item>
        <Form.Item label="simulationTime">
          <InputNumber
            min={0.1}
            max={40.0}
            style={{ width: 150 }}
            onChange={(e) => {
              setModel({ ...model, simulationTime: e });
            }}
            value={model.simulationTime}
          />
        </Form.Item>
        <Form.Item label="scenarioTrigger">
          <TextArea
            rows={3}
            maxLength={1024}
            onChange={(e) => {
              setModel({ ...model, scenarioEndTrigger: e.target.value });
            }}
            value={model.scenarioEndTrigger}
          />
        </Form.Item>
      </Form>
    </Card>
  );
}
export default BasicInformation;
