import { Card, Button, Radio, Select } from "antd";
import { ReactElement, useState } from "react";

export default function ScenarioGeneration({
  setKey,
}: {
  setKey: (key: string) => void;
}): ReactElement {
  // ADS
  const [type, setType] = useState("ADS");
  // CBN
  const [algorithm, setAlgorithm] = useState("CBN");
  // 种子场景
  const [seedScenarios, setSeedScenarios] = useState(1);
  // 评价指标
  const [evaluation, setEvaluation] = useState(1);

  const handleGeneration = () => {};
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
          <Radio value={1}>碰撞检测</Radio>
          <Radio value={2}>TTC</Radio>
          <Radio value={3}>交通违规</Radio>
        </Radio.Group>
      </Card>
      <Button type="primary" onClick={handleGeneration}>
        开始生成场景
      </Button>
    </div>
  );
}
