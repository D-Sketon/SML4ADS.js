import React, { ReactElement, useRef, useState } from "react";
import { Button, Tabs } from "antd";
import Model from "./model";
import Tree from "./tree";

type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const defaultPanes = [
  {
    label: "Tab 1",
    children: <Model />,
    key: "1",
  },
  {
    label: "Tab 2",
    children: <Tree />,
    key: "2",
  },
]

function ContentCore(): ReactElement {
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState(defaultPanes);
  const newTabIndex = useRef(0);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    setItems([
      ...items,
      { label: "New Tab", children: <></>, key: newActiveKey },
    ]);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    const targetIndex = items.findIndex((pane) => pane.key === targetKey);
    const newPanes = items.filter((pane) => pane.key !== targetKey);
    if (newPanes.length && targetKey === activeKey) {
      const { key } =
        newPanes[
          targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
        ];
      setActiveKey(key);
    }
    setItems(newPanes);
  };

  const onEdit = (targetKey: TargetKey, action: "add" | "remove") => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div style={{ height: '100%' }}>
      {/* <div style={{ marginBottom: 16 }}>
        <Button onClick={add}>ADD</Button>
      </div> */}
      <Tabs
        hideAdd
        onChange={onChange}
        activeKey={activeKey}
        type="editable-card"
        onEdit={onEdit}
        items={items}
        style={{ height: '100%' }}
      />
    </div>
  );
}

export default ContentCore;
