import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import { Col, Input, Modal, Row, Select, notification } from "antd";
import AppContext from "../../store/context";
import {
  ROAD_TYPES,
  TRAFFIC_CONDITIONS,
  defaultModel,
} from "../../model/Model";
import { FILE_SUFFIX } from "../../constants";
import { refreshTree } from "../../store/action";
import { ENVIRONMENT_CLOUD, ENVIRONMENT_ILLUMINATION, ENVIRONMENT_RAINFALL, ENVIRONMENT_SNOWFALL, ENVIRONMENT_WIND } from "../../model/Environment";

enum WEATHER_TYPES {
  DEFAULT = "default",
  SUNNY = "sunny",
  RAINY = "rainy",
  SNOWY = "snowy",
}

enum TIME_TYPES {
  DEFAULT = "default",
  DAY = "day",
  NIGHT = "night",
}

export default function NewModelModal({
  isModalOpen,
  handleCancel = () => {},
  path,
}: BaseModalProps & {
  path: string;
}): ReactElement {
  const { dispatch } = useContext(AppContext);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [name, setName] = useState("");
  const [roadType, setRoadType] = useState(ROAD_TYPES.HIGHWAY);
  const [trafficCondition, setTrafficCondition] = useState(
    TRAFFIC_CONDITIONS.LOW
  );
  const [weatherType, setWeatherType] = useState(WEATHER_TYPES.DEFAULT);
  const [timeType, setTimeType] = useState(TIME_TYPES.DEFAULT);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!name) {
      notification.error({
        message: "Error",
        description: "Please input file name",
      });
      return;
    }
    setConfirmLoading(true);
    const model = defaultModel();
    model.roadType = roadType;
    model.trafficCondition = trafficCondition;
    if (weatherType === WEATHER_TYPES.SUNNY) {
      model.environment.visibility = [10000, 10000];
    } else if (weatherType === WEATHER_TYPES.RAINY) {
      model.environment.visibility = [1000, 1000];
      model.environment.temperature = [10, 10];
      model.environment.weather.cloud!.cloudinessLevel = [8, 8];
      model.environment.weather.cloud!.type = [ENVIRONMENT_CLOUD.OVERCAST];
      model.environment.weather.rainfall!.type = [ENVIRONMENT_RAINFALL.MODERATE_RAIN];
      model.environment.weather.rainfall!.precipitationIntensity = [6, 6];
      model.environment.weather.wind!.type = [ENVIRONMENT_WIND.MODERATE_BREEZE];
      model.environment.weather.wind!.windSpeed = [6, 6];
      model.environment.illumination.lightingIntensity = [500, 500];
    } else if (weatherType === WEATHER_TYPES.SNOWY) {
      model.environment.visibility = [1000, 1000];
      model.environment.temperature = [-10, -10];
      model.environment.weather.cloud!.cloudinessLevel = [8, 8];
      model.environment.weather.cloud!.type = [ENVIRONMENT_CLOUD.OVERCAST];
      model.environment.weather.snowfall!.type = [ENVIRONMENT_SNOWFALL.MODERATE_SNOW];
      model.environment.weather.snowfall!.snowfallIntensity = [10, 10];
      model.environment.weather.wind!.type = [ENVIRONMENT_WIND.MODERATE_BREEZE];
      model.environment.weather.wind!.windSpeed = [6, 6];
      model.environment.illumination.lightingIntensity = [500, 500];
    }
    if(timeType === TIME_TYPES.NIGHT) {
      model.environment.illumination.type = [ENVIRONMENT_ILLUMINATION.NIGHT];
      model.environment.illumination.lightingIntensity = [10, 10];
      // nonsense
      model.environment.sunProperty = {
        sunAzimuth: [0, 0],
        sunElevation: [0, 0]
      }
    }
    let content = JSON.stringify(model);
    await window.electronAPI.newFile(path, name, FILE_SUFFIX.MODEL, content);
    // refresh tree
    dispatch(refreshTree());
    setName("");
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <Modal
      title="New File"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>File name:</Col>
        <Col span={18}>
          <Input
            placeholder="Please input file name"
            value={name}
            onChange={handleNameChange}
          />
        </Col>
      </Row>
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>Road Type:</Col>
        <Col span={18}>
          <Select
            className="w-44"
            options={Object.values(ROAD_TYPES).map((i) => ({
              value: i,
              label: i,
            }))}
            onChange={(e) => {
              setRoadType(e);
            }}
            value={roadType}
          />
        </Col>
      </Row>
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>Traffic Condition:</Col>
        <Col span={18}>
          <Select
            className="w-44"
            options={Object.values(TRAFFIC_CONDITIONS).map((i) => ({
              value: i,
              label: i,
            }))}
            onChange={(e) => {
              setTrafficCondition(e);
            }}
            value={trafficCondition}
          />
        </Col>
      </Row>
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>Weather Type:</Col>
        <Col span={18}>
          <Select
            className="w-44"
            options={Object.values(WEATHER_TYPES).map((i) => ({
              value: i,
              label: i,
            }))}
            onChange={(e) => {
              setWeatherType(e);
            }}
            value={weatherType}
          />
        </Col>
      </Row>
      <Row className="flex items-center mt-4 mb-4">
        <Col span={6}>Time Type:</Col>
        <Col span={18}>
          <Select
            className="w-44"
            options={Object.values(TIME_TYPES).map((i) => ({
              value: i,
              label: i,
            }))}
            onChange={(e) => {
              setTimeType(e);
            }}
            value={timeType}
          />
        </Col>
      </Row>
    </Modal>
  );
}
