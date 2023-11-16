import { Card, Form, Select, Button, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ReactElement } from "react";
import { WEATHER_TYPES_CARLA, WEATHER_TYPES_LGSVL } from "./constant";

export type BasicFieldType = {
  simulatorType?: string;
  map?: string;
  weather?: string;
  timeStep?: number;
  simulationTime?: number;
  scenarioTrigger?: string;
};

interface BasicInformationProps {
  changeSimulatorType: (value: string) => void;
}

function BasicInformation(props: BasicInformationProps): ReactElement {
  const [form] = Form.useForm();

  function handleSimulatorTypeChange(e: any) {
    props.changeSimulatorType(e);
  }
  return (
    <Card
      hoverable
      title="Basic Information"
      style={{ margin: "10px 10px 10px 0", boxSizing: "border-box" }}
    >
      <Form<BasicFieldType>
        name="Basic Information"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        initialValues={{
          simulatorType: "Carla",
          map: "custom",
          weather: "random",
          timeStep: 0.1,
          simulationTime: 40,
          scenarioTrigger: "",
        }}
        autoComplete="off"
      >
        <Form.Item<BasicFieldType> label="simulatorType" name="simulatorType">
          <Select
            style={{ width: 150 }}
            options={[
              { value: "Carla", label: "Carla" },
              { value: "lgsvl", label: "lgsvl" },
            ]}
            onChange={handleSimulatorTypeChange}
          />
        </Form.Item>
        <Form.Item<BasicFieldType> label="map">
          <Form.Item<BasicFieldType> name="map">
            <Select
              style={{ width: 150 }}
              options={[
                { value: "custom", label: "custom" },
                { value: "default", label: "default" },
              ]}
            />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button type="primary" style={{ marginRight: "20px", width: 120 }}>
              Choose File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: 'ellipsis' }}>
              C:\Users\Jack\Desktop\SML4ADS\Examples\OvertakingScenario
            </span>
          </div>
        </Form.Item>

        <Form.Item<BasicFieldType> label="weather" name="weather">
          <Select
            style={{ width: 150 }}
            options={
              form.getFieldValue("simulatorType") === "Carla"
                ? WEATHER_TYPES_CARLA.map((i) => ({ value: i, label: i }))
                : WEATHER_TYPES_LGSVL.map((i) => ({ value: i, label: i }))
            }
          />
        </Form.Item>
        <Form.Item<BasicFieldType> label="timeStep" name="timeStep">
          <InputNumber min={0.1} max={10} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item<BasicFieldType> label="simulationTime" name="simulationTime">
          <InputNumber min={0.1} max={40.0} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item<BasicFieldType>
          label="scenarioTrigger"
          name="scenarioTrigger"
        >
          <TextArea rows={3} maxLength={1024} />
        </Form.Item>
      </Form>
    </Card>
  );
}
export default BasicInformation;
