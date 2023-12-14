import { Spin } from "antd";
import { ReactElement, useEffect, useState } from "react";
import { Scene } from "../../content/model/Scene";
import { MModel } from "../../../model/Model";

interface ExtendAdsmlMapProps {
  model: MModel;
  modelPath: string;
  saveCount: number; // only for refresh
}

function ExtendAdsmlMap(props: ExtendAdsmlMapProps): ReactElement {
  const { model, modelPath, saveCount } = props;
  const [info, setInfo] = useState<string>("");

  useEffect(() => {
    const asyncFn = async () => {
      if (!model) return;
      const mapPath = await window.electronAPI.getAbsolutePath(
        modelPath,
        model.map
      );
      const info = await window.electronAPI.visualize(
        mapPath,
        model.cars,
        20225
      );
      setInfo(info);
    };
    asyncFn();
  }, [model, modelPath]);

  useEffect(() => {
    if (!info) return;
    const options = {
      width:
        document.getElementById("canvas-wrapper")?.getBoundingClientRect()
          ?.width ?? 0,
      height:
        document.getElementById("canvas-wrapper")?.getBoundingClientRect()
          ?.height ?? 0,
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
  }, [info, saveCount]);
  return (
    <div
      style={{
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "460px",
      }}
      id="canvas-wrapper"
    >
      {info ? <canvas id="mycanvas"></canvas> : <Spin />}
    </div>
  );
}

export default ExtendAdsmlMap;
