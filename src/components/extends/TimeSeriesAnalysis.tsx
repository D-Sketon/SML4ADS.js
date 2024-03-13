import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  FloatButton,
  InputNumber,
  Row,
  Spin,
  Table,
  TableProps,
} from "antd";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";
import Papa from "papaparse";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VisGraph, {
  GraphData,
  GraphEvents,
  Options,
} from "react-vis-graph-wrapper";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  LineChart,
  CanvasRenderer,
]);

interface DataType {
  index: string;
  factorA: string;
  factorB: string;
  factorC: string;
}

const extraInfo = {
  acc: Array.from({ length: 100 }, () => Math.random() * 100),
};

export default function TimeSeriesAnalysis(): ReactElement {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [csvPath, setCsvPath] = useState("");
  const [csvArray, setCsvArray] = useState<string[][]>([]);
  const [k, setK] = useState<number | null>(0);
  const [graph, setGraph] = useState<GraphData>({
    nodes: [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
      { id: 5, label: "Node 5" },
    ],
    edges: [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 },
    ],
  });

  const sampleOptions = {
    title: {
      text: "Sample",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: extraInfo.acc.map((_, index) => index),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        symbol: "none",
        data: extraInfo.acc,
        type: "line",
        smooth: true,
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0],
        filterMode: "filter",
      },
    ],
  };

  const handleChooseCsvFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.CSV]);
    if (res.filePaths.length) {
      setCsvPath(res.filePaths[0]);
      const csvText = (
        await window.electronAPI.readFile(res.filePaths[0])
      ).trim();
      setCsvArray(Papa.parse(csvText).data as string[][]);
    }
  };

  const handleProcess = async () => {
    setIsLoading(true);

    setIsLoading(false);
  };

  const options: Options = {
    // interaction: { hover: true },
    // manipulation: {
    //   enabled: true,
    // },
    height: "400px",
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

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "索引",
      dataIndex: "index",
      rowScope: "row",
      width: 100,
    },
    {
      title: "时序因子",
      colSpan: 3,
      dataIndex: "factorA",
    },
    {
      title: "",
      colSpan: 0,
      dataIndex: "factorB",
    },
    {
      title: "",
      colSpan: 0,
      dataIndex: "factorC",
    },
  ];

  const tableData: DataType[] = [
    {
      index: "1",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "2",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "3",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "4",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "5",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "6",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "7",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "8",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "9",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
    {
      index: "10",
      factorA: "1",
      factorB: "2",
      factorC: "3",
    },
  ];

  const handleDownloadModel = () => {
    
  }

  const handleDownloadResult = () => {
  
  }

  return (
    <div>
      <Card title="时序数据分析" className="m-2" hoverable>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>time series file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              className="mr-5 w-32"
              onClick={handleChooseCsvFile}
              icon={<UploadOutlined />}
            >
              Time Series
            </Button>
            <span className="overflow-hidden text-ellipsis">{csvPath}</span>
          </Col>
        </Row>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>clusters number:</Col>
          <Col span={20}>
            <InputNumber value={k} onChange={(e) => setK(e)} />
          </Col>
        </Row>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>sample:</Col>
          <Col span={20}>
            Select the &nbsp;
            <InputNumber value={k} onChange={(e) => setK(e)} />
            &nbsp;th time series data sample
          </Col>
        </Row>
        <ReactEChartsCore
          echarts={echarts}
          option={sampleOptions}
          notMerge={true}
          lazyUpdate={true}
          style={{ width: "100%" }}
        />
      </Card>
      <div className="box-border m-2 mt-0">
        <Button type="primary" block onClick={handleProcess}>
          Process
        </Button>
      </div>
      <Card title="Output" className="m-2" hoverable>
        {/* {isLoading && <Spin />} */}
        <div className="flex w-full">
          <Card title="因果模型" className="m-2" style={{ flex: 1 }} hoverable extra={<Button type="primary" onClick={handleDownloadModel}>下载</Button>}>
            <VisGraph graph={graph} options={options} events={events} />
          </Card>
          <Card
            title="时序数据表征结果"
            className="m-2"
            style={{ flex: 1 }}
            hoverable
            extra={<Button type="primary" onClick={handleDownloadResult}>下载</Button>}
          >
            <Table
              columns={columns}
              dataSource={tableData}
              bordered
              pagination={{ position: ["bottomCenter"], pageSize: 5 }}
            />
          </Card>
        </div>
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}
