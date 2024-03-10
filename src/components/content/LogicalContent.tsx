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
import SimulationResult from "./virtual/SimulationResult";
import Adstl from "./adstl";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const getChildrenComponent = (
  path: string,
  key: FILE_SUFFIX | string
): ReactElement => {
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
    case FILE_SUFFIX.VIRTUAL_SIMULATION_RESULT:
      return <SimulationResult path={path} />
    case FILE_SUFFIX.ADSTL:
      return <Adstl path={path}/>;
    case FILE_SUFFIX.OSC:
      return <Text path={path} ext={key} />;
    default:
      return <></>;
  }
};

export default function LogicalContent(): ReactElement {
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
        label: path.path.endsWith(FILE_SUFFIX.VIRTUAL_SIMULATION_RESULT) ? "Simulation Result" : path.path.split("/").pop()!,
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
    <div className="h-full">
      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={onEdit}
        items={items}
        className="h-full"
      />
      <FloatButton icon={<LeftOutlined />} onClick={back} className="right-6" />
    </div>
  );
}
