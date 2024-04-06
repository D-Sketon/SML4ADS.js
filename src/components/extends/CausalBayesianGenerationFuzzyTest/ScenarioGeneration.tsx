import { Card, Button, Radio, Select } from "antd";
import { ReactElement } from "react";

export default function ScenarioGeneration({
  setKey
}: {
  setKey: (key: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <div className="flex gap-10 items-center">
          构建新种子场景
          <Select
            style={{ width: 150 }}
            options={[{ value: "ADS", label: "ADS" }]}
          />
          <Select
            style={{ width: 150 }}
            options={[{ value: "CBN", label: "CBN" }]}
          />
        </div>
      </Card>
      <Card title="勾选种子场景">
        <Radio.Group className="flex justify-around">
          <Radio value={1}>跟车场景</Radio>
          <Radio value={2}>车道保持场景</Radio>
          <Radio value={3}>超车场景</Radio>
        </Radio.Group>
      </Card>
      <Card title="勾选评估指标">
        <Radio.Group className="flex justify-around">
          <Radio value={1}>碰撞检测</Radio>
          <Radio value={2}>TTC</Radio>
          <Radio value={3}>交通违规</Radio>
        </Radio.Group>
      </Card>
      <Button type="primary">开始生成场景</Button>
    </div>
  );
}
