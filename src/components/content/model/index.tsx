import React, { ReactElement, useCallback, useEffect, useState } from "react";
import BasicInformation from "./BasicInformation";
import CarInformation from "./CarInformation";
import { Button } from "antd";
import { MModel, defaultModel } from "../../../model/Model";
import { defaultCar } from "../../../model/Car";

interface ModelProps {
  path: string;
}

function Model(props: ModelProps): ReactElement {
  const { path } = props;
  const [model, setModel] = useState<MModel>(defaultModel());

  const saveHook = useCallback(async () => {
    // TODO CHECK
    await window.electronAPI.writeJson(path, model);
  }, [model, path]);

  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      if (content) {
        const model: MModel = JSON.parse(content);
        setModel(model);
      }
    };
    asyncFn();
  }, [path]);

  useEffect(() => {
    return () => {
      const asyncFn = async () => {
        await saveHook();
      };
      asyncFn();
    };
  }, [saveHook]);

  const handleAdd = () => {
    setModel({
      ...model,
      cars: [...model.cars, defaultCar()],
    });
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      await saveHook();
      event.preventDefault();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <BasicInformation model={model} setModel={setModel} />
      {model.cars.map((_, index) => (
        <CarInformation
          model={model}
          setModel={setModel}
          index={index}
          key={index}
        />
      ))}
      <div style={{ padding: "0 10px 10px 0", boxSizing: "border-box" }}>
        <Button type="primary" block onClick={handleAdd}>
          + Add
        </Button>
      </div>
    </div>
  );
}

export default Model;
