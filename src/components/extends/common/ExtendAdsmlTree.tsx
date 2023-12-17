import { Row, Col, Select } from "antd";
import { ReactElement, useState } from "react";
import AdsmlTree from "../../content/adsml/AdsmlTree";
import treeNodeAdapter from "../../content/tree/utils/adapter/treeNodeAdapter";
import { MModel } from "../../../model/Model";
import { useNodesState, useEdgesState } from "reactflow";
import ImmutableBehaviorNode from "../../content/adsml/ImmutableBehaviorNode";
import BranchNode from "../../content/tree/node/BranchNode";
import CommonTransition from "../../content/tree/transition/CommonTransition";
import ProbabilityTransition from "../../content/tree/transition/ProbabilityTransition";

interface ExtendAdsmlTreeProps {
  model: MModel;
}

const nodeTypes = {
  ImmutableBehaviorNode,
  BranchNode,
};

const edgeTypes = {
  CommonTransition,
  ProbabilityTransition,
};

export default function ExtendAdsmlTree({
  model,
}: ExtendAdsmlTreeProps): ReactElement {
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  return (
    <>
      <Row className="flex items-center mt-4 mb-4">
        <Col span={3}>Car name:</Col>
        <Col span={21}>
          <Select
            className="w-44"
            options={
              model?.cars.map((car, index) => ({
                label: car.name,
                value: index,
              })) ?? []
            }
            value={selectedCar}
            onChange={(e) => {
              setSelectedCar(e);
              if (e === null || model === null) return;
              const tree = model.cars[e].mTree!;
              const { nodes, edges } = treeNodeAdapter(
                tree,
                setNodes,
                "ImmutableBehaviorNode"
              );
              setNodes(nodes);
              setEdges(edges);
            }}
          />
        </Col>
      </Row>

      <AdsmlTree
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        style={{
          backgroundColor: "#fff",
          height: "398px",
        }}
      />
    </>
  );
}
