import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Dropdown, MenuProps, Tree, notification } from "antd";
import type { DataNode, DirectoryTreeProps, EventDataNode } from "antd/es/tree";
import AppContext from "../../store/context";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import NewDirectoryModal from "../modal/NewDirectoryModal";
import NewFileDirectory from "../modal/NewFileModal";

const { DirectoryTree } = Tree;

function SiderTree(): ReactElement {
  const { state } = useContext(AppContext);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] =
    useState(false);
  const [newDirectoryModalVisible, setNewDirectoryModalVisible] =
    useState(false);
  const [newFileModalVisible, setNewFileModalVisible] = useState(false);

  const [rightSelectedPath, setRightSelectedPath] = useState("");
  const [newFileExt, setNewFileExt] = useState("");

  useEffect(() => {
    const asyncFn = async () => {
      const data = await window.electronAPI.generateTree(state.workspacePath);
      setTreeData(data);
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshId]);

  const [selectInfo, setSelectInfo] = useState<EventDataNode<DataNode>>();
  const [rightSelectInfo, setRightSelectInfo] =
    useState<EventDataNode<DataNode>>();

  const onSelect: DirectoryTreeProps["onSelect"] = (_keys, info) => {
    setSelectInfo(info.node);
  };

  const onDoubleClick = async () => {
    if (!selectInfo?.isLeaf) return;
    const content = await window.electronAPI.readFile(selectInfo.key as string);
    const ext = (selectInfo.key as string).split(".").pop();
  };

  const onRightClick = (e: any) => {
    setRightSelectInfo(e.node);
    setRightSelectedPath(e.node.key as string);
  };

  const items: MenuProps["items"] = [
    {
      label: "New",
      key: "new",
      children: [
        {
          label: "Directory",
          key: "directory",
        },
        {
          label: "Model",
          key: "model",
        },
        {
          label: "Tree",
          key: "tree",
        },
      ],
    },
    {
      label: "Delete",
      key: "delete",
    },
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    setTimeout(() => {
      console.log(rightSelectInfo);
      switch (key) {
        case "directory":
          if (rightSelectInfo?.isLeaf) {
            notification.error({
              message: "Error",
              description: "Please select a directory",
            });
            return;
          }
          setNewDirectoryModalVisible(true);
          break;
        case "model":
          if (rightSelectInfo?.isLeaf) {
            notification.error({
              message: "Error",
              description: "Please select a directory",
            });
            return;
          }
          setNewFileExt("model");
          setNewFileModalVisible(true);
          break;
        case "tree":
          if (rightSelectInfo?.isLeaf) {
            notification.error({
              message: "Error",
              description: "Please select a directory",
            });
            return;
          }
          setNewFileExt("tree");
          setNewFileModalVisible(true);
          break;
        case "delete":
          setDeleteConfirmModalVisible(true);
          break;
        default:
          break;
      }
    });
  };

  return (
    <>
      <Dropdown menu={{ items, onClick }} trigger={["contextMenu"]}>
        <DirectoryTree
          multiple
          defaultExpandAll
          onDoubleClick={onDoubleClick}
          onRightClick={onRightClick}
          onSelect={onSelect}
          treeData={treeData}
          style={{ height: "100%" }}
        />
      </Dropdown>
      <DeleteConfirmModal
        isModalOpen={deleteConfirmModalVisible}
        path={rightSelectedPath}
        handleCancel={() => setDeleteConfirmModalVisible(false)}
      />
      <NewDirectoryModal
        isModalOpen={newDirectoryModalVisible}
        path={rightSelectedPath}
        handleCancel={() => setNewDirectoryModalVisible(false)}
      />
      <NewFileDirectory
        isModalOpen={newFileModalVisible}
        path={rightSelectedPath}
        ext={newFileExt}
        handleCancel={() => setNewFileModalVisible(false)}
      />
    </>
  );
}

export default SiderTree;
