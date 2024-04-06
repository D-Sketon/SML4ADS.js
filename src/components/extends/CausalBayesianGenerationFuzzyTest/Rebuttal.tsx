import { Button, Card, Select } from "antd";
import { ReactElement } from "react";

export default function Rebuttal({
  setKey
}: {
  setKey: (key: string) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <div className="flex gap-10 items-center">
          选择算法
          <Select
            style={{ width: 150 }}
            options={[
              { value: "PTR", label: "PTR" },
              { value: "RCC", label: "RCC" },
              { value: "DSR", label: "DSR" },
            ]}
          />
        </div>
      </Card>
      <div className="flex w-full gap-5">
        <Button type="primary" className="grow" onClick={() => setKey("7")}>
          上一步
        </Button>
        <Button type="primary" className="grow" onClick={() => setKey("9")}>
          运行
        </Button>
      </div>
    </div>
  );
}
