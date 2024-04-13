import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  FloatButton,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
} from "antd";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";

export const meta = {
  title: "强化学习训练",
  description: "强化学习训练",
};

interface ParameterType {
  causalPriorityExperienceReplay: boolean;
  priorityLevelExperienceReplay: boolean;
  model: string;
  maxEpoch: number;
  batchSize: number;
  mainExperienceReplayPoolSize: number;
  tempExperienceReplayPoolSize: number;
  actorLearningRate: number;
  criticLearningRate: number;
}

export default function RLTraining(): ReactElement {
  const navigate = useNavigate();
  const [envType, setEnvType] = useState(1);
  const [envTemplate, setEnvTemplate] = useState("Highway");
  const [envPath, setEnvPath] = useState("");
  const [parameter, setParameter] = useState<ParameterType>({
    causalPriorityExperienceReplay: false,
    priorityLevelExperienceReplay: false,
    model: "DDPG",
    maxEpoch: 0,
    batchSize: 0,
    mainExperienceReplayPoolSize: 0,
    tempExperienceReplayPoolSize: 0,
    actorLearningRate: 0,
    criticLearningRate: 0,
  });

  const [output, setOutput] = useState({
    model: "DDPG",
    experienceReplayType: "因果优先",
    trainingEpoch: "待训练",
    averageScore: 0,
    bestScore: 0,
    averageScoreTimeStep: 0,
    averageAccumulatedScore: 0,
  });

  const onChangeEnv = (e: RadioChangeEvent) => {
    setEnvType(e.target.value);
    if (e.target.value === 1) {
      setEnvPath("");
    }
  };

  const handleChooseEnvFile = async () => {
    const res = await window.electronAPI.chooseFile([]);
    if (res.filePaths.length) {
      setEnvPath(res.filePaths[0]);
    }
  };

  const handleRefresh = () => {};
  const handleDownloadLog = () => {};
  const handledDownloadResult = () => {};

  const onChange = (key: string, value: any) => {
    setParameter({ ...parameter, [key]: value });
  };
  return (
    <div>
      <Card title="强化学习训练" className="m-2" hoverable>
        <Card title="Environment" className="m-2" style={{ flex: 1 }} hoverable>
          <Radio.Group onChange={onChangeEnv} value={envType}>
            <Space direction="vertical">
              <Radio value={1} className="flex items-center h-10">
                <Select
                  className="w-44"
                  options={[{ value: "Highway", label: "Highway" }]}
                  onChange={(e) => {
                    setEnvTemplate(e);
                  }}
                  value={envTemplate}
                  disabled={envType !== 1}
                />
              </Radio>
              <Radio value={2}>
                <Button
                  type="primary"
                  className="mr-5 w-44"
                  onClick={handleChooseEnvFile}
                  icon={<UploadOutlined />}
                  disabled={envType !== 2}
                >
                  New Environment
                </Button>
                <span className="overflow-hidden text-ellipsis">{envPath}</span>
              </Radio>
            </Space>
          </Radio.Group>
        </Card>
        <Card title="Parameter" className="m-2" style={{ flex: 1 }} hoverable>
          <div style={{ display: "flex", width: "100%" }}>
            <div style={{ flex: 1 }}>
              <div className="mt-4 mb-4">
                <Checkbox
                  onChange={(e) =>
                    onChange("causalPriorityExperienceReplay", e.target.checked)
                  }
                  checked={parameter.causalPriorityExperienceReplay}
                >
                  是否采用因果优先经验回放
                </Checkbox>
              </div>
              <div className="mt-4 mb-4">
                <Checkbox
                  onChange={(e) =>
                    onChange("priorityLevelExperienceReplay", e.target.checked)
                  }
                  checked={parameter.priorityLevelExperienceReplay}
                >
                  是否采用优先级经验回放
                </Checkbox>
              </div>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">模型选择:</div>
                <Select
                  className="w-44"
                  options={[{ value: "DDPG", label: "DDPG" }]}
                  onChange={(e) => onChange("model", e)}
                  value={parameter.model}
                />
              </div>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">最大轮次:</div>
                <InputNumber
                  className="w-44"
                  onChange={(e) => onChange("maxEpoch", e)}
                  value={parameter.maxEpoch}
                />
              </div>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">批次样本个数:</div>
                <InputNumber
                  className="w-44"
                  onChange={(e) => onChange("batchSize", e)}
                  value={parameter.batchSize}
                />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">主经验回放池大小:</div>
                <InputNumber
                  className="w-44"
                  onChange={(e) => onChange("mainExperienceReplayPoolSize", e)}
                  value={parameter.mainExperienceReplayPoolSize}
                />
              </div>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">临时经验回放池大小:</div>
                <InputNumber
                  className="w-44"
                  onChange={(e) => onChange("tempExperienceReplayPoolSize", e)}
                  value={parameter.tempExperienceReplayPoolSize}
                />
              </div>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">Actor网络学习率:</div>
                <InputNumber
                  className="w-44"
                  onChange={(e) => onChange("actorLearningRate", e)}
                  value={parameter.actorLearningRate}
                />
              </div>
              <div className="mt-4 mb-4 flex items-center">
                <div className="w-44 mr-2">Critic网络学习率:</div>
                <InputNumber
                  className="w-44"
                  onChange={(e) => onChange("criticLearningRate", e)}
                  value={parameter.criticLearningRate}
                />
              </div>
              <div className="flex w-full" style={{ gap: "10px" }}>
                <Button type="primary" className="w-44 mt-4">
                  开始训练
                </Button>
                <Button type="primary" danger className="w-44 mt-4">
                  结束
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Card>
      <Card
        title="Output"
        className="m-2"
        hoverable
        extra={
          <div style={{ display: "flex", gap: "10px" }}>
            <Button type="primary" onClick={handleRefresh}>
              刷新
            </Button>
            <Button type="primary" onClick={handleDownloadLog}>
              下载日志
            </Button>
            <Button type="primary" onClick={handledDownloadResult}>
              下载训练结果
            </Button>
          </div>
        }
      >
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: 1 }}>
            <div className="mt-4 mb-4 flex items-center">
              <div className="w-44 mr-2">模型选择:</div>
              {output.model}
            </div>
            <div className="mt-4 mb-4 flex items-center">
              <div className="w-44 mr-2">经验回放类型:</div>
              {output.experienceReplayType}
            </div>
            <div className="mt-4 mb-4 flex items-center">
              <div className="w-44 mr-2">训练轮次:</div>
              {output.trainingEpoch}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="mt-4 mb-4 flex items-center">
              <div className="w-44 mr-2">平均分数:</div>
              {output.averageScore}
            </div>
            <div className="mt-4 mb-4 flex items-center">
              <div className="w-44 mr-2">最佳分数:</div>
              {output.bestScore}
            </div>
            <div className="mt-4 mb-4 flex items-center">
              <div className="w-44 mr-2">平均分数时间步:</div>
              {output.averageScoreTimeStep}
            </div>
            <div className="mt-4 mb-4 flex items-center">
              <div className="w-44 mr-2">平均累积分数:</div>
              {output.averageAccumulatedScore}
            </div>
          </div>
        </div>
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}
