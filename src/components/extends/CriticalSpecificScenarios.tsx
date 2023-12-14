import {
  DownloadOutlined,
  LeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  FloatButton,
  InputNumber,
  Row,
  Select,
  Spin,
  Tabs,
  notification,
} from "antd";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";
import { MModel } from "../../model/Model";
import { checkModel } from "../content/model/utils/check";
import AdsmlContent from "../content/adsml/AdsmlContent";
import { Scene } from "../content/model/Scene";
import ImmutableBehaviorNode from "../content/adsml/ImmutableBehaviorNode";
import BranchNode from "../content/tree/node/BranchNode";
import CommonTransition from "../content/tree/transition/CommonTransition";
import ProbabilityTransition from "../content/tree/transition/ProbabilityTransition";
import { useEdgesState, useNodesState } from "reactflow";
import treeNodeAdapter from "../content/tree/utils/adapter/treeNodeAdapter";
import AdsmlTree from "../content/adsml/AdsmlTree";

const nodeTypes = {
  ImmutableBehaviorNode,
  BranchNode,
};

const edgeTypes = {
  CommonTransition,
  ProbabilityTransition,
};

function CriticalSpecificScenarios(): ReactElement {
  const [port, setPort] = useState<number | null>(2000);
  const [modelPath, setModelPath] = useState("");
  const [outputPath, setOutputPath] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [model, setModel] = useState<MModel | null>(null);
  const [info, setInfo] = useState<string>("");
  const [saveCount, setSaveCount] = useState(1); // only for refresh
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  const handleChooseModelFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.ADSML]);
    if (res.filePaths.length) {
      setModelPath(res.filePaths[0]);
      const content = await window.electronAPI.readFile(res.filePaths[0]);
      let model: MModel = JSON.parse(content);
      try {
        checkModel(model);
        setModel(model);
      } catch (error: any) {
        console.error(error);
        notification.error({
          message: "Error",
          description: error.message,
        });
        return;
      }
    }
  };

  const handleChooseOutputDirectory = async () => {
    const res = await window.electronAPI.chooseDirectory();
    if (res.filePaths.length) {
      setOutputPath(res.filePaths[0]);
    }
  };

  const handleProcess = async () => {
    if (!port) {
      notification.error({
        message: "Error",
        description: "Please input port",
      });
      return;
    }
    if (!modelPath) {
      notification.error({
        message: "Error",
        description: "Please choose model file",
      });
      return;
    }
    if (!outputPath) {
      notification.error({
        message: "Error",
        description: "Please choose output file",
      });
      return;
    }
    setIsLoading(true);
    await window.electronAPI.criticalSpecificScenarios(
      port,
      modelPath,
      outputPath
    );
    setIsLoading(false);
  };

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

  const tabItems = [
    {
      label: "model",
      key: "model",
      children: model ? (
        <AdsmlContent
          model={model}
          handleCarClick={() => {}}
          className="left-info"
          style={{
            height: "460px",
            overflow: "auto",
          }}
        />
      ) : (
        <></>
      ),
    },
    {
      label: "tree",
      key: "tree",
      children: (
        <>
          <Row
            style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
          >
            <Col span={3}>Car name:</Col>
            <Col span={21}>
              <Select
                style={{ width: 180 }}
                options={
                  model?.cars.map((car, index) => ({
                    label: car.name,
                    value: index,
                  })) ?? []
                }
                value={selectedCar}
                onChange={(e) => {
                  setSelectedCar(e);
                  if (e === null || model === null) return;
                  const tree = model.cars[e].mTree!;
                  const { nodes, edges } = treeNodeAdapter(
                    tree,
                    setNodes,
                    "ImmutableBehaviorNode"
                  );
                  setNodes(nodes);
                  setEdges(edges);
                }}
              />
            </Col>
          </Row>

          <AdsmlTree
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            style={{
              backgroundColor: "#fff",
              height: "428px",
            }}
          />
        </>
      ),
    },
    {
      label: "map",
      key: "map",
      forceRender: true,
      children: (
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
      ),
    },
  ];

  const onChange = (key: string) => {
    if (key === "map") {
      setTimeout(() => {
        setSaveCount((s) => s + 1);
      });
    }
  };

  return (
    <div
      style={{ backgroundColor: "#f6f6f6", height: "100vh", overflow: "auto" }}
      className="extend-wrapper"
    >
      <div style={{ display: "flex", height: "500px" }}>
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Card
            title="Input"
            style={{ margin: "10px", height: "100%" }}
            hoverable
          >
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                margin: "15px 0",
              }}
            >
              <Col span={8}>carla port:</Col>
              <Col span={16}>
                <InputNumber
                  min={0}
                  max={65535}
                  value={port}
                  onChange={(e) => setPort(e)}
                />
              </Col>
            </Row>
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                margin: "15px 0",
              }}
            >
              <Col span={8}>scenario model file:</Col>
              <Col span={16}>
                <Button
                  type="primary"
                  style={{ marginRight: "20px", width: 120 }}
                  onClick={handleChooseModelFile}
                  icon={<UploadOutlined />}
                >
                  File
                </Button>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {modelPath}
                </div>
              </Col>
            </Row>
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                margin: "15px 0",
              }}
            >
              <Col span={8}>output directory:</Col>
              <Col span={16}>
                <Button
                  type="primary"
                  style={{ marginRight: "20px", width: 120 }}
                  onClick={handleChooseOutputDirectory}
                  icon={<DownloadOutlined />}
                >
                  Directory
                </Button>
                <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {outputPath}
                </div>
              </Col>
            </Row>
          </Card>
          <div style={{ padding: "0 10px 10px 10px", boxSizing: "border-box" }}>
            <Button type="primary" block onClick={handleProcess}>
              Process
            </Button>
          </div>
        </div>
        <div style={{ width: "50%", height: "100%" }}>
          <Tabs type="card" items={tabItems} onChange={onChange} />
        </div>
      </div>
      <Card title="Output" style={{ margin: "10px" }} hoverable>
        {isLoading && <Spin />}
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}

export default CriticalSpecificScenarios;
