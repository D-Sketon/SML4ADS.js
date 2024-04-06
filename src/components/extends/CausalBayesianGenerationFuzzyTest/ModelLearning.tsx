import { Button } from "antd";
import { ReactElement, useState } from "react";
import VisGraph, {
  GraphData,
  GraphEvents,
  Options,
} from "react-vis-graph-wrapper";

export default function ModelLearning({
  setKey
}: {
  setKey: (key: string) => void;
}): ReactElement {
  const [graph, setGraph] = useState<GraphData>({
    nodes: [
      { id: 1, label: "Node 1", title: "I have a popup!" },
      { id: 2, label: "Node 2", title: "I have a popup!" },
      { id: 3, label: "Node 3", title: "I have a popup!" },
      { id: 4, label: "Node 4", title: "I have a popup!" },
      { id: 5, label: "Node 5", title: "I have a popup!" },
    ],
    edges: [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
    ],
  });

  const options: Options = {
    interaction: { hover: true },
    height: "400px",
    physics: {
      stabilization: true,
    },
    autoResize: true,
    edges: {
      smooth: true,
      color: {
        color: "#848484",
        highlight: "#848484",
        hover: "#848484",
        inherit: "from",
        opacity: 1.0,
      },
      width: 0.5,
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5,
        },
      },
    },
  };

  return (
    <div className="flex flex-col gap-10">
      <VisGraph graph={graph} options={options} />
      <div className="flex w-full gap-5">
        <Button type="primary" className="grow" onClick={() => setKey("8")}>
          返回上一步反驳
        </Button>
        <Button type="primary" className="grow">
          保存模型
        </Button>
      </div>
    </div>
  );
}
