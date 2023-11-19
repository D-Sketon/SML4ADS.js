import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Tabs } from "antd";
import Model from "./model";
import Tree from "./tree";
import AppContext from "../../store/context";
import { FILE_SUFFIX } from "../../constants";
import { activateFilePath, removeFilePath } from "../../store/action";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

function getChildrenComponent(path: string, key: FILE_SUFFIX | string) {
  switch (key) {
    case FILE_SUFFIX.MODEL:
      return <Model path={path}/>;
    case FILE_SUFFIX.TREE:
      return <Tree path={path}/>;
    default:
      return <></>;
  }
}

function ContentCore(): ReactElement {
  const { state, dispatch } = useContext(AppContext);
  const [activeKey, setActiveKey] = useState<string>();
  const [items, setItems] = useState<
    {
      label: string;
      children: JSX.Element | string;
      key: string;
    }[]
  >([]);

  useEffect(() => {
    setItems(
      state.filePath.map((path, index) => ({
        label: path.path.split("/").pop()!,
        children: getChildrenComponent(path.path, path.ext),
        key: path.path,
      }))
    );
    setActiveKey(state.filePath.find((path) => path.isActive)?.path);
  }, [state.filePath]);

  const onChange = (key: string) => {
    dispatch(activateFilePath(key));
  };

  const remove = (targetKey: TargetKey) => {
    dispatch(removeFilePath(targetKey as string));
  };

  const onEdit = (targetKey: TargetKey, _action: any) => {
    remove(targetKey);
  };

  return (
    <div style={{ height: "100%" }}>
      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={onEdit}
        items={items}
        style={{ height: "100%" }}
      />
    </div>
  );
}

export default ContentCore;
