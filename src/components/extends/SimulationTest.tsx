import { LeftOutlined } from "@ant-design/icons";
import {
  Card,
  Row,
  Col,
  Button,
  Spin,
  FloatButton,
  Select,
  notification,
} from "antd";
import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../store/context";

export const meta = {
  title: "仿真测试",
  description: "实现对自动驾驶系统进行测试。用户可以选择上传自己的感知、规控模型，拼装成一辆自动驾驶车辆。随后用户选择测试场景，评估指标。最终展示测试报告。"
};

export default function SimulationTest(): ReactElement {
  const { state } = useContext(AppContext);
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
    if (!scenario) {
      notification.error({
        message: "Error",
        description: "Please choose scenario",
      });
      return;
    }
    setIsLoading(true);
    try {
      await window.electronAPI.simulationTest(
        modelPath,
        scenario,
        metrics,
        state.config.simulationPort
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

  return (
    <div className="extend-wrapper h-screen overflow-auto bg-stone-100">
      <Card title="仿真测试" className="m-2" hoverable>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>model file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              className="mr-5 w-32"
              onClick={handleChooseModelFile}
            >
              Choose File
            </Button>
            <div className="overflow-hidden text-ellipsis">{modelPath}</div>
          </Col>
        </Row>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>scenario:</Col>
          <Col span={20}>
            <Select
              className="w-44"
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
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>evaluation metrics:</Col>
          <Col span={20}>
            <Select
              className="w-44"
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
      <div className="box-border m-2 mt-0">
        <Button type="primary" block onClick={handleProcess}>
          Process
        </Button>
      </div>
      <Card title="Output" className="m-2" hoverable>
        {isLoading && <Spin />}
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}
