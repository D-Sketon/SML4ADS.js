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
        // Prevent overwriting of saved requirements and parametricStls
        // Need to merge the requirements and parametricStls of the current model with the saved model
        const content = await window.electronAPI.readFile(path);
        let savedModel: MModel;
        if (!content) {
          savedModel = defaultModel();
        } else {
          savedModel = JSON.parse(content);
        }
        const newModel = {
          ...model,
          requirements: savedModel.requirements,
          parametricStls: savedModel.parametricStls,
          parameters: savedModel.parameters,
        };
        checkModel(newModel);
        await window.electronAPI.writeJson(path, newModel);
        // There is no need to update the model because the component does not read the requirements  and parametricStls.
        // setModel(newModel);
      } catch (error: any) {
        console.error(error);
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
      let model: MModel;
      if (!content) {
        model = defaultModel();
      } else {
        model = JSON.parse(content);
      }
      // check model
      try {
        checkModel(model);
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.message,
        });
        return;
      }
      setModel(model);
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
        await saveHook(true);
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
