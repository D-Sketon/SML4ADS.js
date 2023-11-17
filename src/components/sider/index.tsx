import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Tree } from "antd";
import type { DataNode, DirectoryTreeProps } from "antd/es/tree";
import AppContext from "../../store/context";

const { DirectoryTree } = Tree;

function SiderTree(): ReactElement {
  const { state } = useContext(AppContext);
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  useEffect(() => {
    const asyncFn = async () => {
      const data = await window.electronAPI.generateTree(state.workspacePath);
      setTreeData(data);
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
