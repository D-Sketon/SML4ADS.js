import { Button } from "antd";
import { ReactElement } from "react";

function ElementProvider(): ReactElement {
  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div style={{ display: "flex", gap: "10px", margin: '5px 10px' }}>
      <Button
        type="primary"
        onDragStart={(event) => onDragStart(event, "BehaviorNode")}
        draggable
      >
        Behavior Node
      </Button>
      <Button
        type="primary"
        onDragStart={(event) => onDragStart(event, "BranchNode")}
        draggable
      >
        Branch Node
      </Button>
    </div>
  );
}

export default ElementProvider;
