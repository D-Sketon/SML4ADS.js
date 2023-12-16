import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Dropdown, MenuProps, Tree, notification } from "antd";
import type { DataNode, DirectoryTreeProps, EventDataNode } from "antd/es/tree";
import AppContext from "../../store/context";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import NewDirectoryModal from "../modal/NewDirectoryModal";
import NewFileDirectory from "../modal/NewFileModal";
import { FILE_OPERATION, FILE_SUFFIX, FILE_TYPE } from "../../constants";
import { addFilePath, refreshTree } from "../../store/action";

const { DirectoryTree } = Tree;

const updateTreeData = (
  list: DataNode[],
  key: React.Key,
  children: DataNode[]
): DataNode[] =>
  list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });

function SiderTree(): ReactElement {
  const { state, dispatch } = useContext(AppContext);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [loadedKeys, setLoadedKeys] = useState<React.Key[]>([]);
  const [deleteConfirmModalVisible, setDeleteConfirmModalVisible] =
    useState(false);
  const [newDirectoryModalVisible, setNewDirectoryModalVisible] =
    useState(false);
  const [newFileModalVisible, setNewFileModalVisible] = useState(false);

  const [selectedPath, setSelectedPath] = useState("");
  const [rightSelectedPath, setRightSelectedPath] = useState("");
  const [newFileExt, setNewFileExt] = useState("");

  useEffect(() => {
    const asyncFn = async () => {
      if (state.workspacePath === "") return;
      const data = await window.electronAPI.generateTree(
        state.workspacePath,
        [],
        1
      );
      setTreeData(() => data);
      for (const key of loadedKeys) {
        await onLoadData({ key });
      }
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.refreshId, state.workspacePath]);

  const [selectInfo, setSelectInfo] = useState<EventDataNode<DataNode>>();
  const [rightSelectInfo, setRightSelectInfo] =
    useState<EventDataNode<DataNode>>();

  const onSelect: DirectoryTreeProps["onSelect"] = (_keys, info) => {
    setSelectInfo(info.node);
    setSelectedKeys(_keys);
    setSelectedPath(info.node.key as string);
  };

  const onDoubleClick = async () => {
    if (!selectInfo?.isLeaf) return;
    const ext = (selectInfo.key as string).split(".").pop();
    if (
      ext === FILE_SUFFIX.MODEL ||
      ext === FILE_SUFFIX.TREE ||
      ext === FILE_SUFFIX.ADSML ||
      ext === FILE_SUFFIX.XML ||
      ext === FILE_SUFFIX.XODR ||
      ext === FILE_SUFFIX.JSON
    ) {
      dispatch(addFilePath(selectInfo.key as string));
    } else {
      notification.warning({
        message: "Warning",
        description: "Not supported file type",
      });
    }
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
          key: FILE_TYPE.DIRECTORY,
        },
        {
          label: "Model",
          key: FILE_SUFFIX.MODEL,
        },
        {
          label: "Tree",
          key: FILE_SUFFIX.TREE,
        },
      ],
    },
    {
      label: "Delete",
      key: FILE_OPERATION.DELETE,
    },
  ];

  const onClick = useCallback(
    ({ key }: any, isFromMenu?: boolean) => {
      let info: EventDataNode<DataNode> | undefined;
      if (isFromMenu) {
        info = selectInfo;
        setRightSelectedPath(selectedPath);
      } else {
        info = rightSelectInfo;
      }
      switch (key) {
        case FILE_TYPE.DIRECTORY:
          if (info?.isLeaf || info === void 0) {
            notification.error({
              message: "Error",
              description: "Please select a directory",
            });
            return;
          }
          setNewDirectoryModalVisible(true);
          break;
        case FILE_SUFFIX.MODEL:
          if (info?.isLeaf || info === void 0) {
            notification.error({
              message: "Error",
              description: "Please select a directory",
            });
            return;
          }
          setNewFileExt(FILE_SUFFIX.MODEL);
          setNewFileModalVisible(true);
          break;
        case FILE_SUFFIX.TREE:
          if (info?.isLeaf || info === void 0) {
            notification.error({
              message: "Error",
              description: "Please select a directory",
            });
            return;
          }
          setNewFileExt(FILE_SUFFIX.TREE);
          setNewFileModalVisible(true);
          break;
        case FILE_OPERATION.DELETE:
          setDeleteConfirmModalVisible(true);
          break;
        default:
          break;
      }
    },
    [rightSelectInfo, selectInfo, selectedPath]
  );

  // Listen for New Folder, New File, Delete File from the menu.
  useEffect(() => {
    const onNewDirectoryCallback = (_e: any) => {
      onClick({ key: "directory" }, true);
    };
    const onNewFileCallback = (_e: any, ext: string) => {
      if (ext === FILE_SUFFIX.TREE) {
        onClick({ key: FILE_SUFFIX.TREE }, true);
      } else if (ext === FILE_SUFFIX.MODEL) {
        onClick({ key: FILE_SUFFIX.MODEL }, true);
      }
    };
    const onDeleteFileCallback = (_e: any) => {
      onClick({ key: "delete" }, true);
    };
    window.electronAPI.onNewDirectory(onNewDirectoryCallback);
    window.electronAPI.onNewFile(onNewFileCallback);
    window.electronAPI.onDeleteFile(onDeleteFileCallback);
    return () => {
      window.electronAPI.offAllNewDirectory();
      window.electronAPI.offAllNewFile();
      window.electronAPI.offAllDeleteFile();
    };
  }, [onClick]);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "F5") {
      dispatch(refreshTree());
      event.preventDefault();
    }
  };

  const onLoadData = ({ key, children }: any) => {
    return new Promise<void>((resolve) => {
      if (children) {
        resolve();
        return;
      }
      window.electronAPI._generateTree(key, [], 1).then((data) => {
        setTreeData((origin) => updateTreeData(origin, key, data));
        resolve();
      });
    });
  };

  const onExpand = (keys: any) => {
    let newLoadKeys = loadedKeys;
    if (expandedKeys.length > keys.length) {
      newLoadKeys = loadedKeys.filter((i) => keys.includes(i));
    }
    setExpandedKeys(keys);
    setLoadedKeys(newLoadKeys);
  };

  const onLoad = (loadedKeys: any) => {
    setLoadedKeys(loadedKeys);
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <Dropdown menu={{ items, onClick }} trigger={["contextMenu"]}>
        <DirectoryTree
          multiple
          defaultExpandAll
          onDoubleClick={onDoubleClick}
          onRightClick={onRightClick}
          onSelect={onSelect}
          treeData={treeData}
          onExpand={onExpand}
          onLoad={onLoad}
          loadData={onLoadData}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          loadedKeys={loadedKeys}
          className="h-full"
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
    </div>
  );
}

export default SiderTree;
