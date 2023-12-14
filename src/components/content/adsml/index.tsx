import React, { ReactElement, useEffect, useState } from "react";
import { MModel, defaultModel } from "../../../model/Model";
import { checkModel } from "../model/utils/check";
import { useEdgesState, useNodesState } from "reactflow";
import CommonTransition from "../tree/transition/CommonTransition";
import ProbabilityTransition from "../tree/transition/ProbabilityTransition";
import BranchNode from "../tree/node/BranchNode";
import ImmutableBehaviorNode from "./ImmutableBehaviorNode";
import treeNodeAdapter from "../tree/utils/adapter/treeNodeAdapter";

import "./index.less";
import AdsmlContent from "./AdsmlContent";
import { notification } from "antd";
import AdsmlTree from "./AdsmlTree";

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

  function handleCarClick(index: number): void {
    const tree = model.cars[index].mTree!;
    const { nodes, edges } = treeNodeAdapter(
      tree,
      setNodes,
      "ImmutableBehaviorNode"
    );
    setNodes(nodes);
    setEdges(edges);
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <AdsmlContent
        model={model}
        handleCarClick={handleCarClick}
        style={{ width: "50%", height: "100%", overflow: "auto" }}
        className="left-info"
      />
      <AdsmlTree
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        style={{
          width: "50%",
          backgroundColor: "#fff",
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
        }}
      />
    </div>
  );
}

export default Adsml;
