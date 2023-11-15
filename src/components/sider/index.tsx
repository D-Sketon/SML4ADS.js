import React, { ReactElement, useEffect, useState } from "react";
import { Tree } from "antd";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";

const { DirectoryTree } = Tree;

function SiderTree(): ReactElement {
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  useEffect(() => {
    const a = async () => {
      const data = await window.electronAPI.generateTree();
      setTreeData(data);
    }
    a();
  }, []);

  const onSelect: DirectoryTreeProps["onSelect"] = (keys, info) => {
    console.log("Trigger Select", keys, info);
  };

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={onSelect}
      treeData={treeData}
    />
  );
}

export default SiderTree;
