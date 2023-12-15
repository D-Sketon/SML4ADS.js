import React, { ReactElement, useContext, useEffect, useState } from "react";
import { FloatButton, Tabs } from "antd";
import Model from "./model";
import Tree from "./tree";
import Adsml from "./adsml";
import Text from "./text";
import AppContext from "../../store/context";
import { FILE_SUFFIX } from "../../constants";
import {
  activateFilePath,
  clearStore,
  removeFilePath,
} from "../../store/action";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Xodr from "./xodr";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

function getChildrenComponent(path: string, key: FILE_SUFFIX | string) {
  switch (key) {
    case FILE_SUFFIX.MODEL:
      return <Model path={path} />;
    case FILE_SUFFIX.TREE:
      return <Tree path={path} />;
    case FILE_SUFFIX.ADSML:
      return <Adsml path={path} />;
    case FILE_SUFFIX.JSON:
    case FILE_SUFFIX.XML:
      return <Text path={path} ext={key} />;
    case FILE_SUFFIX.XODR:
      return <Xodr path={path} ext={key} />;
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
  const navigate = useNavigate();

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

  const back = () => {
    dispatch(clearStore());
    navigate("/");
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
      <FloatButton
        icon={<LeftOutlined />}
        onClick={back}
        style={{ right: 24 }}
      />
    </div>
  );
}

export default ContentCore;
