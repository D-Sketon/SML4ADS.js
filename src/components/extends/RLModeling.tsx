import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, FloatButton, Row, Spin } from "antd";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";
import Papa from "papaparse";
import VisGraph, {
  GraphData,
  GraphEvents,
  Options,
} from "react-vis-graph-wrapper";

function RLModeling(): ReactElement {
  const [csvPath, setCsvPath] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [graph, setGraph] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  const handleChooseCsvFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.CSV]);
    if (res.filePaths.length) {
      setCsvPath(res.filePaths[0]);
      const csvText = await window.electronAPI.readFile(res.filePaths[0]);
      const csvArray: string[][] = Papa.parse(csvText).data as string[][];
      const nodes = csvArray[0].map((item, index) => ({
        id: index,
        label: item,
        title: item,
      }));
      const edges = csvArray.slice(1).reduce((acc, cur, index) => {
        const from = index;
        cur.forEach((c, i) => {
          if (c !== "") {
            acc.push({ from, to: i, label: c });
          }
        });
        return acc;
      }, [] as { from: number; to: number; label?: string }[]);
      setGraph({ nodes, edges });
    }
  };

  const options: Options = {
    interaction: { hover: true },
    manipulation: {
      enabled: true,
    },
    height: "500px",
    physics: {
      stabilization: true,
    },
    autoResize: true,
    edges: {
      smooth: true,
      color: {
        color: "#848484",
        highlight: "#848484",
        hover: "#848484",
        inherit: "from",
        opacity: 1.0,
      },
      width: 0.5,
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.5,
        },
      },
    },
  };

  const events: GraphEvents = {
    select: (event: any) => {
      // const { nodes, edges } = event;
      // console.log(nodes, edges);
    },
  };

  const handleProcess = async () => {};

  return (
    <div className="extend-wrapper h-screen overflow-auto bg-stone-100">
      <Card title="强化学习建模" className="m-2" hoverable>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>MDP file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              className="mr-5 w-32"
              onClick={handleChooseCsvFile}
              icon={<UploadOutlined />}
            >
              MDP
            </Button>
            <span className="overflow-hidden text-ellipsis">{csvPath}</span>
          </Col>
        </Row>
        <VisGraph graph={graph} options={options} events={events} />
      </Card>
      <div className="box-border m-2 mt-0">
        <Button type="primary" block onClick={handleProcess}>
          Process
        </Button>
      </div>
      <Card title="Output" className="m-2" hoverable>
        {isLoading && <Spin />}
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}

export default RLModeling;
