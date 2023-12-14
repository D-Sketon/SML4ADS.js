import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import BasicInformation from "./BasicInformation";
import CarInformation from "./CarInformation";
import { Button, FloatButton, Spin, notification } from "antd";
import { MModel, defaultModel } from "../../../model/Model";
import { defaultCar } from "../../../model/Car";
import AppContext from "../../../store/context";
import { setSaveFilePath } from "../../../store/action";
import { checkModel } from "./utils/check";
import oldModelAdapter from "./utils/adapter/oldModelAdapter";
import { Scene } from "./Scene";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

interface ModelProps {
  path: string;
}

function Model(props: ModelProps): ReactElement {
  const { path } = props;
  const [model, setModel] = useState<MModel | null>(null);
  const { state, dispatch } = useContext(AppContext);
  const { saveFilePath, workspacePath, config } = state;
  const [info, setInfo] = useState<string>("");
  const [saveCount, setSaveCount] = useState(1); // only for refresh
  const navigate = useNavigate();

  const saveHook = useCallback(
    async (isManual = false) => {
      if (!model) return;
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
          parametricStls: savedModel.parametricStls ?? [],
          parameters: savedModel.parameters ?? [],
        };
        checkModel(newModel);
        setSaveCount((s) => s + 1);
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

  useEffect(() => {
    if (!info) return;
    const options = {
      width:
        document.getElementById("canvas-wrapper")?.getBoundingClientRect()
          .width ?? 0,
      height:
        document.getElementById("canvas-wrapper")?.getBoundingClientRect()
          .height ?? 0,
    };
    const scene = new Scene("mycanvas", info, options);
    scene.paint();

    function resizeCanvas() {
      scene.width =
        document.getElementById("canvas-wrapper")?.getBoundingClientRect()
          .width ?? 0;
      scene.height =
        document.getElementById("canvas-wrapper")?.getBoundingClientRect()
          .height ?? 0;
      scene.paint();
    }
    window.addEventListener("resize", resizeCanvas, false);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [info]);

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      const content = await window.electronAPI.readFile(path);
      let model: MModel;
      if (!content) {
        model = defaultModel();
      } else {
        model = oldModelAdapter(JSON.parse(content));
      }
      // check model
      try {
        checkModel(model);
        setModel(model);
        const mapPath = await window.electronAPI.getAbsolutePath(
          path,
          model.map
        );
        const info = await window.electronAPI.visualize(
          mapPath,
          model.cars,
          config.simulationPort
        );
        setInfo(info);
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.message,
        });
        return;
      }
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    const asyncFn = async () => {
      if (!model) return;
      const mapPath = await window.electronAPI.getAbsolutePath(
        path,
        model.map
      );
      const info = await window.electronAPI.visualize(
        mapPath,
        model.cars,
        config.simulationPort
      );
      setInfo(info);
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.simulationPort, workspacePath, saveCount]);

  // onUnmounted
  // has bug, so ignore
  // useEffect(() => {
  //   return () => {
  //     const asyncFn = async () => {
  //       await saveHook();
  //     };
  //     asyncFn();
  //   };
  // }, [saveHook]);

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
    if (!model) return;
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
    <>
      <div
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{ height: "100%", display: "flex" }}
      >
        <div
          style={{ width: "70%", overflow: "auto" }}
          className="extend-wrapper"
        >
          {model ? (
            <>
              <BasicInformation model={model} setModel={setModel} path={path} />
              {model.cars.map((_, index) => (
                <CarInformation
                  model={model}
                  setModel={setModel}
                  index={index}
                  key={index}
                  path={path}
                />
              ))}
              <div
                style={{ padding: "0 10px 10px 0", boxSizing: "border-box" }}
              >
                <Button type="primary" block onClick={handleAdd}>
                  + Add
                </Button>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Spin />
            </div>
          )}
        </div>
        <div
          style={{
            width: "30%",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: '100%'
          }}
          className="extend-wrapper"
          id="canvas-wrapper"
        >
          {info ? <canvas id="mycanvas"></canvas> : <Spin />}
        </div>
      </div>
      <div>
        <FloatButton
          type="primary"
          style={{ right: 94 }}
          onClick={() => {
            saveHook(true);
          }}
        />
        <FloatButton
          icon={<LeftOutlined />}
          onClick={() => navigate("/")}
          style={{ right: 24 }}
        />
      </div>
    </>
  );
}

export default Model;
