import { Button, Card } from "antd";
import { ReactElement } from "react";

export default function Project({
  setKey
}: {
  setKey: (key: string) => void;
}): ReactElement {
  const handleNew = () => {

  }

  const handleOpen = () => {
    setKey("3");
  }
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        <Card
          hoverable
          style={{ height: "150px" }}
          className="flex justify-center items-center"
        >
          <div className="cursor-pointer font-bold text-lg">
            +&nbsp;快速开始
          </div>
        </Card>
        <Card hoverable className="flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="font-bold text-lg mb-3">项目名称</div>
            <div className="flex w-full justify-center gap-5">
              <Button type="primary" onClick={handleNew}>新建</Button>
              <Button type="primary" onClick={handleOpen}>打开</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
