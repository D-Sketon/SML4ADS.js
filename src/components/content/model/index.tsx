import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import BasicInformation from "./BasicInformation";
import CarInformation from "./CarInformation";
import { Button, notification } from "antd";
import { MModel, defaultModel } from "../../../model/Model";
import { defaultCar } from "../../../model/Car";
import { checkModel } from "./utils";
import AppContext from "../../../store/context";
import { setSaveFilePath } from "../../../store/action";

interface ModelProps {
  path: string;
}

function Model(props: ModelProps): ReactElement {
  const { path } = props;
  const [model, setModel] = useState<MModel>(defaultModel());
  const { state, dispatch } = useContext(AppContext);
  const { saveFilePath } = state;

  const saveHook = useCallback(
    async (isManual = false) => {
      try {
        checkModel(model);
        await window.electronAPI.writeJson(path, model);
      } catch (error: any) {
        isManual &&
          notification.error({
            message: "Error",
            description: error.message,
          });
      }
    },
    [model, path]
  );

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      if (content) {
        const model: MModel = JSON.parse(content);
        // check model
        try {
          checkModel(model);
        } catch (error: any) {
          notification.error({
            message: "Error",
            description: error.message,
          });
          return;
        }
        setModel(model);
      }
    };
    asyncFn();
  }, [path]);

  // onUnmounted
  useEffect(() => {
    return () => {
      const asyncFn = async () => {
        await saveHook();
      };
      asyncFn();
    };
  }, [saveHook]);

  // preprocess
  useEffect(() => {
    if (saveFilePath === path) {
      const asyncFn = async () => {
        await saveHook();
        dispatch(setSaveFilePath("$$\ua265SAVE\ua265$$"));
      };
      asyncFn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveFilePath, path, saveHook]);

  const handleAdd = () => {
    setModel({
      ...model,
      cars: [...model.cars, defaultCar()],
    });
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
      await saveHook(true);
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
