import { Row, Col } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { ReactElement } from "react";
import { Edge } from "reactflow";

interface GuardDrawerProps {
  selectedEdge: Edge | null;
  setEdges: (edge: React.SetStateAction<Edge[]>) => void;
}

function GuardDrawer(props: GuardDrawerProps): ReactElement {
  const { selectedEdge, setEdges } = props;

  function handleGuardChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    if (selectedEdge) {
      selectedEdge.label = event.target.value;
      setEdges((eds) => {
        return eds
          .filter((edge) => edge.id !== selectedEdge.id)
          .concat(selectedEdge);
      });
    }
  }

  return (
    <>
      <Row className="flex items-center">
        <Col span={4}>guard:</Col>
        <Col span={20}>
          <TextArea
            rows={3}
            maxLength={1024}
            value={selectedEdge?.label?.toString() ?? ""}
            onChange={handleGuardChange}
          />
        </Col>
      </Row>
    </>
  );
}

export default GuardDrawer;
