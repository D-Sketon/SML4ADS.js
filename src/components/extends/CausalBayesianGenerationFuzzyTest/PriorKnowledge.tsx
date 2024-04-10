import { Button } from "antd";
import { ReactElement, useEffect, useState } from "react";
import VisGraph, { GraphEvents, Options } from "react-vis-graph-wrapper";
import { ProjectType } from ".";

export default function PriorKnowledge({
  setKey,
  projectData,
  setProjectData,
}: {
  setKey: (key: string) => void;
  projectData: ProjectType;
  setProjectData: (data: any) => void;
}): ReactElement {
  const [network, setNetwork] = useState<any>();
  const [graph, setGraph] = useState<any>({
    nodes: [
      { id: 1, label: "Node 1", title: "I have a popup!" },
      { id: 2, label: "Node 2", title: "I have a popup!" },
      { id: 3, label: "Node 3", title: "I have a popup!" },
      { id: 4, label: "Node 4", title: "I have a popup!" },
      { id: 5, label: "Node 5", title: "I have a popup!" },
    ],
    edges: projectData.knowledgeEdge,
  });

  useEffect(() => {
    setGraph((graph: any) => {
      return {
        ...graph,
        edges: projectData.knowledgeEdge,
      };
    });
  }, [projectData.knowledgeEdge]);

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
    // nodes: {
    //   fixed: {
    //     x: true,
    //     y: true,
    //   },
    // },
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
    doubleClick: (event: any) => {
      const { edges } = event;
      const edgesList = [];
      for (const e in network.body.edges) {
        if (e === edges[0]) {
          if (network.body.edges[e].options.arrows?.middle?.enabled) {
            edgesList.push({
              from: network.body.edges[e].fromId,
              to: network.body.edges[e].toId,
              id: network.body.edges[e].id,
            });
          } else {
            edgesList.push({
              from: network.body.edges[e].fromId,
              to: network.body.edges[e].toId,
              id: network.body.edges[e].id,
              arrows: {
                middle: {
                  enabled: true,
                  type: "image",
                  imageWidth: 24,
                  imageHeight: 24,
                  src: "/cross.svg",
                },
              },
            });
          }
        } else {
          if (network.body.edges[e].options.arrows?.middle?.enabled) {
            edgesList.push({
              from: network.body.edges[e].fromId,
              to: network.body.edges[e].toId,
              id: network.body.edges[e].id,
              arrows: {
                middle: {
                  enabled: true,
                  type: "image",
                  imageWidth: 24,
                  imageHeight: 24,
                  src: "/cross.svg",
                },
              },
            });
          } else {
            edgesList.push({
              from: network.body.edges[e].fromId,
              to: network.body.edges[e].toId,
              id: network.body.edges[e].id,
            });
          }
        }
      }
      network.setData({ nodes: graph.nodes, edges: edgesList });
    },
  };

  const handleSave = () => {
    const edgesList: any[] = [];
    for (const e in network.body.edges) {
      if (network.body.edges[e].options.arrows?.middle?.enabled) {
        edgesList.push({
          from: network.body.edges[e].fromId,
          to: network.body.edges[e].toId,
          id: network.body.edges[e].id,
          arrows: {
            middle: {
              enabled: true,
              type: "image",
              imageWidth: 24,
              imageHeight: 24,
              src: "/cross.svg",
            },
          },
        });
      } else {
        edgesList.push({
          from: network.body.edges[e].fromId,
          to: network.body.edges[e].toId,
          id: network.body.edges[e].id,
        });
      }
    }
    setProjectData((data: ProjectType) => {
      return { ...data, knowledgeEdge: edgesList };
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
            setKey("4");
          }}
        >
          上一步
        </Button>
        <Button
          type="primary"
          className="grow"
          onClick={() => {
            handleSave();
            setKey("6");
          }}
        >
          下一步
        </Button>
      </div>
    </div>
  );
}
