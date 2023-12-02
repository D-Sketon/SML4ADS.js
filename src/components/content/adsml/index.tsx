import React, { ReactElement, useEffect, useState } from "react";
import { MModel, defaultModel } from "../../../model/Model";
import { checkModel } from "../model/utils/check";
import { Card, Descriptions, DescriptionsProps, notification } from "antd";
import SpeedParamsDesc from "./SpeedParamsDesc";
import { SPEED_PARAMS } from "../../../model/params/ParamSpeed";
import LocationParamsDesc from "./LocationParamsDesc";
import { LOCATION_PARAMS } from "../../../model/params/ParamLocation";
import ReactFlow, {
  Controls,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "reactflow";
import CommonTransition from "../tree/transition/CommonTransition";
import ProbabilityTransition from "../tree/transition/ProbabilityTransition";
import BranchNode from "../tree/node/BranchNode";
import ImmutableBehaviorNode from "./ImmutableBehaviorNode";
import treeNodeAdapter from "../tree/utils/adapter/treeNodeAdapter";

import "./index.less";

const nodeTypes = {
  ImmutableBehaviorNode,
  BranchNode,
};

const edgeTypes = {
  CommonTransition,
  ProbabilityTransition,
};

interface AdsmlProps {
  path: string;
}

function Adsml(props: AdsmlProps): ReactElement {
  const { path } = props;
  const [model, setModel] = useState<MModel>(defaultModel());
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      let model: MModel;
      if (!content) {
        model = defaultModel();
      } else {
        model = JSON.parse(content);
      }
      // check model
      try {
        checkModel(model);
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.message,
        });
        return;
      }
      setModel(model);
    };
    asyncFn();
  }, [path]);

  const basicInfoItems: DescriptionsProps["items"] = Object.keys(model)
    .map((k) => {
      if (k === "cars") {
        return void 0;
      }
      return {
        label: k,
        key: k,
        children: model[k as keyof MModel],
      };
    })
    .filter((i) => i) as any;

  function handleCarClick(index: number): void {
    const tree = model.cars[index].mTree!;
    const { nodes, edges } = treeNodeAdapter(tree, setNodes, "ImmutableBehaviorNode");
    setNodes(nodes);
    setEdges(edges);
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div
        style={{ width: "50%", height: "100%", overflow: "auto" }}
        id="left-info"
      >
        <Card
          hoverable
          title="Basic Information"
          style={{
            margin: "10px 10px 10px 0",
            boxSizing: "border-box",
          }}
        >
          <Descriptions items={basicInfoItems} column={2} />
        </Card>
        {model.cars &&
          model.cars.map((car, index) => {
            return (
              <Card
                hoverable
                title={`Car ${car.name}`}
                key={index}
                style={{
                  margin: "10px 10px 10px 0",
                  boxSizing: "border-box",
                }}
                onClick={() => handleCarClick(index)}
              >
                <Descriptions
                  column={2}
                  items={[
                    {
                      label: "name",
                      key: "name",
                      children: car.name,
                    },
                    {
                      label: "model",
                      key: "model",
                      children: car.model,
                    },
                    {
                      label: "locationType",
                      key: "locationType",
                      children: car.locationType,
                    },
                    {
                      label: "heading",
                      key: "heading",
                      children: car.heading ? "same" : "opposite",
                    },
                    {
                      label: "roadDeviation",
                      key: "roadDeviation",
                      children: car.roadDeviation,
                    },
                    {
                      label: "treePath",
                      key: "treePath",
                      children: car.treePath,
                    },
                    {
                      label: "speedType",
                      key: "speedType",
                      children: car.speedType,
                    },
                    {
                      label: "maxSpeed",
                      key: "maxSpeed",
                      children: car.maxSpeed,
                    },
                    {
                      label: "minSpeed",
                      key: "minSpeed",
                      children: car.minSpeed ?? "N/A",
                      span: 2,
                    },
                    {
                      key: "speedParams",
                      children: (
                        <SpeedParamsDesc
                          params={car.speedParams as SPEED_PARAMS}
                        />
                      ),
                      span: 2,
                    },
                    {
                      key: "locationParams",
                      children: (
                        <LocationParamsDesc
                          params={car.locationParams as LOCATION_PARAMS}
                        />
                      ),
                      span: 2,
                    },
                  ]}
                />
              </Card>
            );
          })}
      </div>
      <div
        style={{
          width: "50%",
          backgroundColor: "#fff",
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
        }}
      >
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
          >
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}

export default Adsml;
