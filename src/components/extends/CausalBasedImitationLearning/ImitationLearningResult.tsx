import { Button, Card, Input } from "antd";
import { ReactElement } from "react";

export default function ImitationLearningResult(): ReactElement {
  return (
    <div className="flex flex-col gap-10">
      <Card title="模仿学习结果展示">
        <div className="flex justify-between items-center m-4">
          <div className="flex gap-10 items-center w-40">输入环境特征</div>
          <div className="flex gap-5">
            <Input className="w-44" />
            <Button type="primary">确定</Button>
          </div>
        </div>
        <div className="flex justify-between items-center m-4">
          <div className="flex gap-10 items-center w-40">模型选择</div>
          <div className="flex gap-5">
            <Input className="w-44" />
            <Button type="primary">确定</Button>
          </div>
        </div>
        <div className="flex justify-between items-center m-4">
          <div className="flex gap-10 items-center w-40">输出动作</div>
          <div className="flex gap-5">
            <Input className="w-44" />
            <Button type="primary" style={{ visibility: 'hidden' }}>确定</Button>
          </div>
        </div>
        <div className="flex gap-5">
          <Button type="primary" className="flex-grow">
            获取
          </Button>
          <Button type="primary" className="flex-grow">
            下载
          </Button>
        </div>
      </Card>
    </div>
  );
}
