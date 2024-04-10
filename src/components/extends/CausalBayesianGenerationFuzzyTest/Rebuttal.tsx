import { Button, Card, Select } from "antd";
import { ReactElement } from "react";
import { ProjectType } from ".";

export default function Rebuttal({
  setKey,
  projectData,
  setProjectData,
}: {
  setKey: (key: string) => void;
  projectData: ProjectType;
  setProjectData: (data: any) => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-10">
      <Card>
        <div className="flex gap-10 items-center">
          选择算法
          <Select
            style={{ width: 150 }}
            value={projectData.rebuttal}
            onChange={(e) =>
              setProjectData((data: ProjectType) => {
                return { ...data, rebuttal: e };
              })
            }
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
