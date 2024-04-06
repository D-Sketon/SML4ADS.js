import { Button } from "antd";
import { ReactElement, useState } from "react";
import VisGraph, {
  GraphData,
  GraphEvents,
  Options,
} from "react-vis-graph-wrapper";

export default function PriorKnowledge(): ReactElement {
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
    manipulation: {
      enabled: true,
    },
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

  const events: GraphEvents = {
    select: (event: any) => {
      // const { nodes, edges } = event;
      // console.log(nodes, edges);
    },
  };
  return (
    <div className="flex flex-col gap-10">
      <VisGraph graph={graph} options={options} events={events} />
      <div className="flex w-full gap-5">
        <Button type="primary" className="grow">
          上一步
        </Button>
        <Button type="primary" className="grow">
          下一步
        </Button>
      </div>
    </div>
  );
}
