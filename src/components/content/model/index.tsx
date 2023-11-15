import React, { ReactElement, useState } from "react";
import BasicInformation from "./BasicInformation";
import CarInformation from "./CarInformation";
import { Button } from "antd";

function Model(): ReactElement {
  const [simulatorType, setSimulatorType] = useState("Carla");
  // get init data here

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <BasicInformation changeSimulatorType={setSimulatorType} />
      <CarInformation simulatorType={simulatorType} />
      <CarInformation simulatorType={simulatorType} />
      <CarInformation simulatorType={simulatorType} />
      <div style={{ margin: "0 10px 10px 0", boxSizing: "border-box" }}>
        <Button type="primary" block>
          + Add
        </Button>
      </div>
    </div>
  );
}

export default Model;
