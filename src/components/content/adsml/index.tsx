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

export default function Adsml({ path }: AdsmlProps): ReactElement {
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

  const handleCarClick = (index: number): void => {
    const tree = model.cars[index].mTree!;
    const { nodes, edges } = treeNodeAdapter(
      tree,
      setNodes,
      "ImmutableBehaviorNode"
    );
    setNodes(nodes);
    setEdges(edges);
  };

  return (
    <div className="relative w-full h-full">
      <AdsmlContent
        model={model}
        handleCarClick={handleCarClick}
        className="w-1/2 h-full overflow-auto left-info"
      />
      <AdsmlTree
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        className="w-1/2 h-full bg-white absolute right-0 top-0"
      />
    </div>
  );
}
