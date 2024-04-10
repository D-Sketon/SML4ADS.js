import { Button } from "antd";
import { ReactElement, useEffect, useState } from "react";
import VisGraph, {
  GraphData,
  GraphEvents,
  Options,
} from "react-vis-graph-wrapper";
import { ProjectType } from ".";

export default function RelationshipConfirmation({
  setKey,
  projectData,
  setProjectData,
}: {
  setKey: (key: string) => void;
  projectData: ProjectType;
  setProjectData: (data: any) => void;
}): ReactElement {
  const [network, setNetwork] = useState<any>();
  const [graph, setGraph] = useState<GraphData>({
    nodes: [
      { id: 1, label: "Node 1", title: "I have a popup!" },
      { id: 2, label: "Node 2", title: "I have a popup!" },
      { id: 3, label: "Node 3", title: "I have a popup!" },
      { id: 4, label: "Node 4", title: "I have a popup!" },
      { id: 5, label: "Node 5", title: "I have a popup!" },
    ],
    edges: projectData.confirmationEdge,
  });

  useEffect(() => {
    setGraph((graph: any) => {
      return {
        ...graph,
        edges: projectData.confirmationEdge,
      };
    });
  }, [projectData.confirmationEdge]);

  const options: Options = {
    interaction: { hover: true },
    manipulation: {
      enabled: true,
      addNode: false,
      addEdge: true,
      editEdge: false,
      deleteNode: false,
      deleteEdge: true,
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

  const handleSave = () => {
    const edgesList: any[] = [];
    for (const e in network.body.edges) {
      edgesList.push({
        from: network.body.edges[e].fromId,
        to: network.body.edges[e].toId,
        id: network.body.edges[e].id,
      });
    }
    setProjectData((data: ProjectType) => {
      return { ...data, confirmationEdge: edgesList };
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <VisGraph
        graph={graph}
        options={options}
        events={events}
        getNetwork={(network) => {
          setNetwork(network);
        }}
      />
      <div className="flex w-full gap-5">
        <Button
          type="primary"
          className="grow"
          onClick={() => {
            handleSave();
            setKey("6");
          }}
        >
          上一步
        </Button>
        <Button
          type="primary"
          className="grow"
          onClick={() => {
            handleSave();
            setKey("8");
          }}
        >
          反驳
        </Button>
        <Button
          type="primary"
          className="grow"
          onClick={() => {
            handleSave();
            setKey("9");
          }}
        >
          学习
        </Button>
      </div>
    </div>
  );
}
