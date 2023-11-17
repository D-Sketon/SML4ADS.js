import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Tree } from "antd";
import type { DataNode, DirectoryTreeProps, EventDataNode } from "antd/es/tree";
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

  let selectInfo: EventDataNode<DataNode>;

  const onSelect: DirectoryTreeProps["onSelect"] = (_keys, info) => {
    selectInfo = info.node;
  };

  const onDoubleClick = async () => {
    if (!selectInfo.isLeaf) return;
    const content = await window.electronAPI.readFile(selectInfo.key as string);
    const ext = (selectInfo.key as string).split(".").pop();
  };

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      onDoubleClick={onDoubleClick}
      onSelect={onSelect}
      treeData={treeData}
    />
  );
}

export default SiderTree;
