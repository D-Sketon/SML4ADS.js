import { Spin } from "antd";
import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { Scene } from "../../content/model/Scene";
import { MAP_TYPES, MModel } from "../../../model/Model";
import AppContext from "../../../store/context";
import throttleByAnimationFrame from "antd/es/_util/throttleByAnimationFrame";

interface ExtendAdsmlMapProps {
  model: MModel;
  modelPath: string;
  saveCount: number; // only for refresh
  mapPath?: string;
}

export default function ExtendAdsmlMap({
  model,
  modelPath,
  saveCount,
  mapPath: mapPropPath,
}: ExtendAdsmlMapProps): ReactElement {
  const { state } = useContext(AppContext);
  const [info, setInfo] = useState<string>("");
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const asyncFn = async () => {
      if (!model) return;
      let mapPath;
      if (model.mapType === MAP_TYPES.CUSTOM) {
        mapPath =
          mapPropPath ??
          (await window.electronAPI.getAbsolutePath(modelPath, model.map));
      } else {
        mapPath = model.map;
      }
      const info = await window.electronAPI.visualize(
        model.mapType,
        mapPath,
        model.cars,
        model.pedestrians,
        state.config.simulationPort
      );
      setInfo(info);
    };
    asyncFn();
  }, [mapPropPath, model, modelPath, state.config.simulationPort]);

  useEffect(() => {
    if (!info) return;
    if (!canvasRef.current) return;
    const options = {
      width: canvasWrapperRef.current?.getBoundingClientRect()?.width ?? 0,
      height: canvasWrapperRef.current?.getBoundingClientRect()?.height ?? 0,
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
  }, [info, saveCount]);
  return (
    <div
      className="flex justify-center items-center overflow-hidden"
      style={{ height: "460px" }}
      ref={canvasWrapperRef}
    >
      {info ? <canvas ref={canvasRef}></canvas> : <Spin />}
    </div>
  );
}
