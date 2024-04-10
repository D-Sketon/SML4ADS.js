import { Card, Select, Radio, Button } from "antd";
import { ReactElement, useState } from "react";

export default function FuzzyTest({
  setKey,
}: {
  setKey: (key: string) => void;
}): ReactElement {
  // ADS
  const [type, setType] = useState("ADS");
  // CBN
  const [algorithm, setAlgorithm] = useState("CBN");
  // 传感器数据
  const [sensorData, setSensorData] = useState(1);
  // 种子场景
  const [seedScenarios, setSeedScenarios] = useState(1);
  // 评价指标
  const [evaluation, setEvaluation] = useState(1);

  const handleTest = () => {};
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <div className="flex gap-10 items-center">
          构建新种子场景
          <Select
            style={{ width: 150 }}
            value={type}
            onChange={(e) => setType(e)}
            options={[{ value: "ADS", label: "ADS" }]}
          />
          <Select
            style={{ width: 150 }}
            value={algorithm}
            onChange={(e) => setAlgorithm(e)}
            options={[{ value: "CBN", label: "CBN" }]}
          />
        </div>
      </Card>
      <Card title="传感器数据">
        <Radio.Group
          className="flex justify-around"
          value={sensorData}
          onChange={(e) => setSensorData(e.target.value)}
        >
          <Radio value={1}>前置摄像头</Radio>
          <Radio value={2}>激光雷达</Radio>
        </Radio.Group>
      </Card>
      <Card title="勾选种子场景">
        <Radio.Group
          className="flex justify-around"
          value={seedScenarios}
          onChange={(e) => setSeedScenarios(e.target.value)}
        >
          <Radio value={1}>跟车场景</Radio>
          <Radio value={2}>车道保持场景</Radio>
          <Radio value={3}>超车场景</Radio>
        </Radio.Group>
      </Card>
      <Card title="勾选评估指标">
        <Radio.Group
          className="flex justify-around"
          value={evaluation}
          onChange={(e) => setEvaluation(e.target.value)}
        >
          <Radio value={1}>安全性</Radio>
          <Radio value={2}>效率性</Radio>
          <Radio value={3}>舒适性</Radio>
        </Radio.Group>
      </Card>
      <Button type="primary" onClick={handleTest}>
        开始测试
      </Button>
    </div>
  );
}
