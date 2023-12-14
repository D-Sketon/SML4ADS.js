import { LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  FloatButton,
  InputNumber,
  Row,
  Spin,
  notification,
} from "antd";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";

function CriticalScenarios(): ReactElement {
  const [port, setPort] = useState<number | null>(2000);
  const [mapPath, setMapPath] = useState("");
  const [modelPath, setModelPath] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseModelFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.ADSML]);
    if (res.filePaths.length) {
      setModelPath(res.filePaths[0]);
    }
  };

  const handleChooseMapFile = async () => {
    const res = await window.electronAPI.chooseFile([]);
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
    await window.electronAPI.criticalScenarios(port, mapPath, modelPath);
    setIsLoading(false);
  };

  return (
    <div
      style={{ backgroundColor: "#f6f6f6", height: "100vh", overflow: "auto" }}
      className="extend-wrapper"
    >
      <Card title="Input" style={{ margin: "10px" }} hoverable>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>carla port:</Col>
          <Col span={20}>
            <InputNumber
              min={0}
              max={65535}
              value={port}
              onChange={(e) => setPort(e)}
            />
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>scenario map file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseMapFile}
            >
              Choose File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {mapPath}
            </span>
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>scenario model file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseModelFile}
            >
              Choose File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {modelPath}
            </span>
          </Col>
        </Row>
      </Card>
      <div style={{ padding: "0 10px 10px 10px", boxSizing: "border-box" }}>
        <Button type="primary" block onClick={handleProcess}>
          Process
        </Button>
      </div>
      <Card title="Output" style={{ margin: "10px" }} hoverable>
        {isLoading && <Spin />}
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}

export default CriticalScenarios
