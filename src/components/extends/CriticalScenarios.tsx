import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  FloatButton,
  InputNumber,
  Row,
  Spin,
  Tabs,
  notification,
} from "antd";
import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";
import { MModel } from "../../model/Model";
import { checkModel } from "../content/model/utils/check";
import ExtendAdsmlContent from "./common/ExtendAdsmlContent";
import ExtendAdsmlTree from "./common/ExtendAdsmlTree";
import ExtendAdsmlMap from "./common/ExtendAdsmlMap";
import AppContext from "../../store/context";

export const meta = {
  title: "逻辑场景到具体场景生成",
  description: "将工具前端生成的逻辑场景模型输入，输出具体初始场景。",
};

export default function CriticalScenarios(): ReactElement {
  const { state } = useContext(AppContext);
  const [port, setPort] = useState<number | null>(2000);
  const [mapPath, setMapPath] = useState("");
  const [modelPath, setModelPath] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [model, setModel] = useState<MModel | null>(null);
  const [saveCount, setSaveCount] = useState(1); // only for refresh

  const handleChooseModelFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.ADSML]);
    if (res.filePaths.length) {
      setModelPath(res.filePaths[0]);
      const content = await window.electronAPI.readFile(res.filePaths[0]);
      let model: MModel = JSON.parse(content);
      try {
        checkModel(model);
        setModel(model);
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.message,
        });
      }
    }
  };

  const handleChooseMapFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.XODR]);
    if (res.filePaths.length) {
      setMapPath(res.filePaths[0]);
    }
  };

  const handleProcess = async () => {
    if (!port) {
      notification.error({
        message: "Error",
        description: "Please input port",
      });
      return;
    }
    if (!mapPath) {
      notification.error({
        message: "Error",
        description: "Please choose map file",
      });
      return;
    }
    if (!modelPath) {
      notification.error({
        message: "Error",
        description: "Please choose model file",
      });
      return;
    }
    setIsLoading(true);
    try {
      await window.electronAPI.extendRPC(
        "criticalScenarios",
        "127.0.0.1",
        state.config.simulationPort,
        port,
        mapPath,
        modelPath
      );
      notification.success({
        message: "Success",
        description: "Process Success",
      });
    } catch (e: any) {
      notification.error({
        message: "Error",
        description: e.message,
      });
    }
    setIsLoading(false);
  };

  const tabItems = [
    {
      label: "model",
      key: "model",
      children: model ? <ExtendAdsmlContent model={model} /> : <></>,
    },
    {
      label: "tree",
      key: "tree",
      children: model ? <ExtendAdsmlTree model={model} /> : <></>,
    },
    {
      label: "map",
      key: "map",
      forceRender: true,
      children: model ? (
        <ExtendAdsmlMap
          model={model}
          modelPath={modelPath}
          saveCount={saveCount}
          mapPath={mapPath}
        />
      ) : (
        <></>
      ),
    },
  ];

  const onChange = (key: string) => {
    if (key === "map") {
      setTimeout(() => {
        setSaveCount((s) => s + 1);
      });
    }
  };

  return (
    <div className="extend-wrapper h-screen overflow-auto bg-stone-100">
      <div style={{ display: "flex", height: "500px" }}>
        <div className="w-1/2 h-full flex flex-col">
          <Card title="逻辑场景到具体场景生成" className="m-2 h-full" hoverable>
            <Row className="flex items-center mt-4 mb-4">
              <Col span={8}>carla port:</Col>
              <Col span={16}>
                <InputNumber
                  min={0}
                  max={65535}
                  value={port}
                  onChange={(e) => setPort(e)}
                />
              </Col>
            </Row>
            <Row className="flex items-center mt-4 mb-4">
              <Col span={8}>scenario map file:</Col>
              <Col span={16}>
                <Button
                  type="primary"
                  className="mr-5 w-32"
                  onClick={handleChooseMapFile}
                  icon={<UploadOutlined />}
                >
                  Map
                </Button>
                <div className="overflow-hidden text-ellipsis">{mapPath}</div>
              </Col>
            </Row>
            <Row className="flex items-center mt-4 mb-4">
              <Col span={8}>scenario model file:</Col>
              <Col span={16}>
                <Button
                  type="primary"
                  className="mr-5 w-32"
                  onClick={handleChooseModelFile}
                  icon={<UploadOutlined />}
                >
                  Model
                </Button>
                <div className="overflow-hidden text-ellipsis">{modelPath}</div>
              </Col>
            </Row>
          </Card>
          <div className="box-border m-2 mt-0">
            <Button type="primary" block onClick={handleProcess}>
              Process
            </Button>
          </div>
        </div>
        <div className="w-1/2 h-full">
          <Tabs type="card" items={tabItems} onChange={onChange} />
        </div>
      </div>

      <Card title="Output" className="m-2" hoverable>
        {isLoading && <Spin />}
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}
