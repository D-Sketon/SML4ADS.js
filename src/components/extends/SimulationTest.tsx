import { LeftOutlined } from "@ant-design/icons";
import { Card, Row, Col, Button, Spin, FloatButton, Select, notification } from "antd";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

function SimulationTest(): ReactElement {
  const [modelPath, setModelPath] = useState("");
  const [scenario, setScenario] = useState("");
  const [metrics, setMetrics] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseModelFile = async () => {
    const res = await window.electronAPI.chooseFile([]);
    if (res.filePaths.length) {
      setModelPath(res.filePaths[0]);
    }
  };

  const handleProcess = async () => {
    if (!modelPath) {
      notification.error({
        message: "Error",
        description: "Please choose model file",
      });
      return;
    }
    if(!scenario) {
      notification.error({
        message: "Error",
        description: "Please choose scenario",
      });
      return;
    }
    setIsLoading(true);
    await window.electronAPI.simulationTest(modelPath, scenario, metrics);
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
          <Col span={4}>model file:</Col>
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
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>scenario:</Col>
          <Col span={20}>
            <Select
              style={{ width: 180 }}
              options={[
                {
                  value: "scenario1",
                  label: "scenario1",
                },
                {
                  value: "scenario2",
                  label: "scenario2",
                },
                {
                  value: "scenario3",
                  label: "scenario3",
                },
              ]}
              onChange={(e) => {
                setScenario(e);
              }}
              value={scenario}
            />
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>evaluation metrics:</Col>
          <Col span={20}>
          <Select
              style={{ width: 180 }}
              mode="multiple"
              options={[
                {
                  value: "metrics1",
                  label: "metrics1",
                },
                {
                  value: "metrics2",
                  label: "metrics2",
                },
                {
                  value: "metrics3",
                  label: "metrics3",
                },
              ]}
              onChange={(e) => {
                setMetrics(e);
              }}
              value={metrics}
            />
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

export default SimulationTest;
