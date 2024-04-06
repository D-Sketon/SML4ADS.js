import { Card, Select, Radio, Button } from "antd";
import { ReactElement } from "react";

export default function FuzzyTest(): ReactElement {
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
      <Card title="传感器数据">
        <Radio.Group className="flex justify-around">
          <Radio value={1}>前置摄像头</Radio>
          <Radio value={2}>激光雷达</Radio>
        </Radio.Group>
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
          <Radio value={1}>安全性</Radio>
          <Radio value={2}>效率性</Radio>
          <Radio value={3}>舒适性</Radio>
        </Radio.Group>
      </Card>
      <Button type="primary">开始测试</Button>
    </div>
  );
}
