import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import BasicInformation from "./BasicInformation";
import CarInformation from "./CarInformation";
import { Button, Spin, notification } from "antd";
import { MAP_TYPES, MModel, defaultModel } from "../../../model/Model";
import { defaultCar } from "../../../model/Car";
import AppContext from "../../../store/context";
import { setSaveFilePath } from "../../../store/action";
import { checkModel } from "./utils/check";
import oldModelAdapter from "./utils/adapter/oldModelAdapter";
import { Scene } from "./Scene";

import "./index.less";
import PedestrianInformation from "./PedestrianInformation";
import { defaultPedestrian } from "../../../model/Pedestrian";
import throttleByAnimationFrame from "antd/es/_util/throttleByAnimationFrame";
import EnvironmentInformation from "./EnvironmentInformation";
import RiderInformation from "./RiderInformation";
import { defaultRider } from "../../../model/Rider";

interface ModelProps {
  path: string;
}

export default function Model(props: ModelProps): ReactElement {
  const { path } = props;
  const [model, setModel] = useState<MModel | null>(null);
  const { state, dispatch } = useContext(AppContext);
  const { saveFilePath, config } = state;
  const [info, setInfo] = useState<string>("");
  const [saveCount, setSaveCount] = useState(1); // only for refresh

  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

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
        // remove pedestrian first location point speed
        if (newModel.pedestrians) {
          newModel.pedestrians.forEach((pedestrian) => {
            delete pedestrian.location[0].speedParams;
            delete pedestrian.location[0].speedType;
          });
        }
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
    if (!canvasRef.current) return;
    const options = {
      width: canvasWrapperRef.current?.getBoundingClientRect().width ?? 0,
      height: canvasWrapperRef.current?.getBoundingClientRect().height ?? 0,
    };
    const scene = new Scene(canvasRef.current, info, options);
    scene.paint();

    const resizeCanvas = throttleByAnimationFrame(() => {
      scene.width =
        canvasWrapperRef.current?.getBoundingClientRect().width ?? 0;
      scene.height =
        canvasWrapperRef.current?.getBoundingClientRect().height ?? 0;
      scene.paint();
    });
    window.addEventListener("resize", resizeCanvas, false);
    return () => {
      window.removeEventListener("resize", resizeCanvas, false);
      scene.destroy();
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
        let mapPath;
        if (model.mapType === MAP_TYPES.CUSTOM) {
          mapPath = await window.electronAPI.getAbsolutePath(path, model.map);
        } else {
          mapPath = model.map;
        }
        const info = await window.electronAPI.visualize(
          model.mapType,
          mapPath,
          model.cars,
          model.pedestrians,
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
      let mapPath;
      if (model.mapType === MAP_TYPES.CUSTOM) {
        mapPath = await window.electronAPI.getAbsolutePath(path, model.map);
      } else {
        mapPath = model.map;
      }
      const info = await window.electronAPI.visualize(
        model.mapType,
        mapPath,
        model.cars,
        model.pedestrians,
        config.simulationPort
      );
      setInfo(info);
    };
    asyncFn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.simulationPort, saveCount]);

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

  const handleAddCar = (): void => {
    if (!model) return;
    setModel({
      ...model,
      cars: [...model.cars, defaultCar()],
    });
  };

  const handleAddPedestrian = (): void => {
    if (!model) return;
    setModel({
      ...model,
      pedestrians: [...model.pedestrians, defaultPedestrian()],
    });
  };

  const handleAddRider = (): void => {
    if (!model) return;
    setModel({
      ...model,
      riders: [...model.riders, defaultRider()],
    });
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key.toLowerCase() === "s" && (event.ctrlKey || event.metaKey)) {
      await saveHook(true);
      event.preventDefault();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0} className="h-full flex">
      <div className="extend-wrapper w-4/6 overflow-auto">
        {model ? (
          <>
            <BasicInformation model={model} setModel={setModel} path={path} />
            <EnvironmentInformation model={model} setModel={setModel} />
            <div className="flex">
              <div className="w-1/2" style={{ minWidth: "350px" }}>
                {model.cars.map((_, index) => (
                  <CarInformation
                    model={model}
                    setModel={setModel}
                    index={index}
                    key={index}
                    path={path}
                  />
                ))}
                <div className="box-border pr-2 pb-2 mt-2">
                  <Button type="primary" block onClick={handleAddCar}>
                    + Add Car
                  </Button>
                </div>
              </div>
              <div className="w-1/2" style={{ minWidth: "350px" }}>
                {model.pedestrians.map((_, index) => (
                  <PedestrianInformation
                    model={model}
                    setModel={setModel}
                    index={index}
                    key={index}
                    path={path}
                  />
                ))}
                <div className="box-border pr-2 pb-2 mt-2">
                  <Button type="primary" block onClick={handleAddPedestrian}>
                    + Add Pedestrian
                  </Button>
                </div>
                {model.riders.map((_, index) => (
                  <RiderInformation
                    model={model}
                    setModel={setModel}
                    index={index}
                    key={index}
                    path={path}
                  />
                ))}
                <div className="box-border pr-2 pb-2 mt-2">
                  <Button type="primary" block onClick={handleAddRider}>
                    + Add Rider
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Spin />
          </div>
        )}
      </div>
      <div
        className="w-2/6 h-full overflow-hidden flex justify-center items-center"
        ref={canvasWrapperRef}
      >
        {info ? <canvas ref={canvasRef}></canvas> : <Spin />}
      </div>
    </div>
  );
}
