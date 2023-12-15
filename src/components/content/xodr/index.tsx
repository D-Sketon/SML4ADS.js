import { ReactElement, useContext, useEffect, useRef, useState } from "react";
import { FILE_SUFFIX } from "../../../constants";
import Text from "../text";
import { Spin } from "antd";
import AppContext from "../../../store/context";
import { Scene } from "../model/Scene";

interface XodrProps {
  path: string;
  ext: FILE_SUFFIX;
}

function Xodr(props: XodrProps): ReactElement {
  const { path, ext } = props;
  const { state } = useContext(AppContext);
  const { config } = state;
  const [info, setInfo] = useState<string>("");
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const asyncFn = async () => {
      const info = await window.electronAPI.visualize(
        path,
        [],
        config.simulationPort
      );
      setInfo(info);
    };
    asyncFn();
  }, [config.simulationPort, path]);

  useEffect(() => {
    if (!info) return;
    if (!canvasRef.current) return;
    const options = {
      width: canvasWrapperRef.current?.getBoundingClientRect()?.width ?? 0,
      height: canvasWrapperRef.current?.getBoundingClientRect()?.height ?? 0,
    };
    const scene = new Scene(canvasRef.current, info, options);
    scene.paint();

    function resizeCanvas() {
      scene.width =
        canvasWrapperRef.current?.getBoundingClientRect().width ?? 0;
      scene.height =
        canvasWrapperRef.current?.getBoundingClientRect().height ?? 0;
      scene.paint();
    }
    window.addEventListener("resize", resizeCanvas, false);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [info]);

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <div
        style={{ width: "50%", overflow: "auto" }}
        className="extend-wrapper"
      >
        <Text path={path} ext={ext} />
      </div>
      <div
        style={{
          width: "50%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
        ref={canvasWrapperRef}
      >
        {info ? <canvas ref={canvasRef}></canvas> : <Spin />}
      </div>
    </div>
  );
}

export default Xodr;
