import { Card, Form, Select, Button, InputNumber, Input } from "antd";
import { ReactElement, useState } from "react";
import { VEHICLE_TYPES_CARLA, VEHICLE_TYPES_LGSVL } from "./constant";

export type BasicFieldType = {
  name?: string;
  model?: string;
  maxSpeed?: string;
  initialSpeed?: number;
  location?: number;
  heading?: string;
  roadDeviation?: number;

  x?: number;
  y?: number;

  actorRef?: string;

  roadId?: string;
  laneId?: string;
  minLateralOffset?: number;
  maxLateralOffset?: number;
  minLongitudinalOffset?: number;
  maxLongitudinalOffset?: number;
};

interface CarInformationProps {
  simulatorType: string;
}

function globalPosition(): ReactElement {
  return (
    <>
      <Form.Item<BasicFieldType> label="x" name="x" labelCol={{ span: 6 }}>
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType> label="y" name="y" labelCol={{ span: 6 }}>
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
    </>
  );
}

function lanePosition(): ReactElement {
  return (
    <>
      <Form.Item<BasicFieldType>
        label="roadId"
        name="roadId"
        labelCol={{ span: 6 }}
      >
        <Input style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="laneId"
        name="laneId"
        labelCol={{ span: 6 }}
      >
        <Input style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="minLateralOffset"
        name="minLateralOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="maxLateralOffset"
        name="maxLateralOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="minLongitudinalOffset"
        name="minLongitudinalOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="maxLongitudinalOffset"
        name="maxLongitudinalOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
    </>
  );
}

function roadPosition(): ReactElement {
  return (
    <>
      <Form.Item<BasicFieldType>
        label="roadId"
        name="roadId"
        labelCol={{ span: 6 }}
      >
        <Input style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="minLateralOffset"
        name="minLateralOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="maxLateralOffset"
        name="maxLateralOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="minLongitudinalOffset"
        name="minLongitudinalOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="maxLongitudinalOffset"
        name="maxLongitudinalOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
    </>
  );
}

function relatedPosition(): ReactElement {
  return (
    <>
      <Form.Item<BasicFieldType>
        label="actorRef"
        name="actorRef"
        labelCol={{ span: 6 }}
      >
        <Input style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="minLateralOffset"
        name="minLateralOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="maxLateralOffset"
        name="maxLateralOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="minLongitudinalOffset"
        name="minLongitudinalOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
      <Form.Item<BasicFieldType>
        label="maxLongitudinalOffset"
        name="maxLongitudinalOffset"
        labelCol={{ span: 6 }}
      >
        <InputNumber style={{ width: 150 }} />
      </Form.Item>
    </>
  );
}

function CarInformation(props: CarInformationProps): ReactElement {
  const { simulatorType } = props;
  const [carForm] = Form.useForm();
  // only for rerender
  const [location, setLocation] = useState("Global Position");
  const [dynamic, setDynamic] = useState("");

  function handleChooseFile(): void {
    window.electronAPI.chooseFile(["tree"]).then((res) => {
      if (res.filePaths.length) {
        setDynamic(res.filePaths[0]);
      }
    });
  }

  function getPositionComponent(): ReactElement {
    switch (location) {
      case "Global Position":
        return globalPosition();
      case "Lane Position":
        return lanePosition();
      case "Road Position":
        return roadPosition();
      case "Related Position":
        return relatedPosition();
      default:
        return <></>;
    }
  }

  function handleChangeLocation(e: any): void {
    setLocation(e);
  }

  return (
    <Card
      hoverable
      title="Car"
      extra={<Button type="primary">Delete</Button>}
      style={{ margin: "10px 10px 10px 0", boxSizing: "border-box" }}
    >
      <Form<BasicFieldType>
        name="Car"
        form={carForm}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{
          name: "",
          model: "random",
          maxSpeed: 0,
          initialSpeed: 0,
          location: "Global Position",
          heading: "same",
          roadDeviation: 0,
          dynamic: "",
        }}
        autoComplete="off"
      >
        <Form.Item<BasicFieldType> label="name" name="name">
          <Input />
        </Form.Item>
        <Form.Item<BasicFieldType> label="model" name="model">
          <Select
            style={{ width: 150 }}
            options={
              simulatorType === "Carla"
                ? VEHICLE_TYPES_CARLA.map((i) => ({ label: i, value: i }))
                : VEHICLE_TYPES_LGSVL.map((i) => ({ label: i, value: i }))
            }
          />
        </Form.Item>
        <Form.Item<BasicFieldType> label="maxSpeed" name="maxSpeed">
          <InputNumber min={0} max={180} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item<BasicFieldType> label="initialSpeed" name="initialSpeed">
          <InputNumber min={0} max={180} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item<BasicFieldType> label="location" name="location">
          <Select
            style={{ width: 150 }}
            options={[
              { label: "Global Position", value: "Global Position" },
              { label: "Lane Position", value: "Lane Position" },
              { label: "Road Position", value: "Road Position" },
              { label: "Related Position", value: "Related Position" },
            ]}
            onChange={handleChangeLocation}
          />
        </Form.Item>
        {getPositionComponent()}
        <Form.Item<BasicFieldType> label="heading" name="heading">
          <Select
            style={{ width: 150 }}
            options={[
              { label: "same", value: "same" },
              { label: "opposite", value: "opposite" },
            ]}
          />
        </Form.Item>
        <Form.Item<BasicFieldType> label="roadDeviation" name="roadDeviation">
          <InputNumber min={0} max={360} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item<BasicFieldType> label="dynamic">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="primary"
              onClick={handleChooseFile}
              style={{ marginRight: "10px" }}
            >
              Select File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {dynamic}
            </span>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
}
export default CarInformation;
