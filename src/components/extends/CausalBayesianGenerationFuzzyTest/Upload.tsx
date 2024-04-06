import { Button, Card } from "antd";
import { ReactElement } from "react";

export default function Upload(): ReactElement {
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <div className="flex flex-col items-center">
          <div className="font-bold text-lg mb-3">点击上传csv文件</div>
          <div className="flex w-full justify-center gap-5">
            <Button type="primary">上传</Button>
          </div>
        </div>
      </Card>
      <Button type="primary">下一步</Button>
    </div>
  );
}
