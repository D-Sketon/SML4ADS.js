import { Button, Card } from "antd";
import { ReactElement } from "react";

function PedestrianInformation(): ReactElement {
  function handleDelete() {}

  return (
    <Card
      hoverable
      title="Car"
      extra={
        <Button type="primary" onClick={handleDelete}>
          Delete
        </Button>
      }
      className="box-border m-2 ml-0"
    ></Card>
  );
}

export default PedestrianInformation;
