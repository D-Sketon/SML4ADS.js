import { InboxOutlined } from "@ant-design/icons";
import { Button, Card, UploadFile, UploadProps } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { ReactElement, useState } from "react";
import VisGraph, { GraphData, Options } from "react-vis-graph-wrapper";

export default function CausalityAcquisition(): ReactElement {
  const [csvPath, setCsvPath] = useState<string>("");
  const [file, setFile] = useState<UploadFile[]>([]);

  const [graph] = useState<GraphData>({
    nodes: [
      { id: 1, label: "Node 1", title: "I have a popup!" },
      { id: 2, label: "Node 2", title: "I have a popup!" },
      { id: 3, label: "Node 3", title: "I have a popup!" },
      { id: 4, label: "Node 4", title: "I have a popup!" },
      { id: 5, label: "Node 5", title: "I have a popup!" },
    ],
    edges: [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
    ],
  });

  const options: Options = {
    interaction: { hover: true },
    height: "300px",
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

  const props: UploadProps = {
    name: "file",
    accept: ".csv",
    multiple: false,
    beforeUpload() {
      return false;
    },
    onChange({ fileList }) {
      // @ts-ignore
      setCsvPath(fileList[0].originFileObj?.path);
      setFile(fileList);
    },
  };

  const handleSubmit = async () => {};

  const handleClear = () => {
    setCsvPath("");
    setFile([]);
  };

  const handleDownload = async () => {};

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <Dragger {...props} maxCount={1} fileList={file}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击上传/拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">请上传CSV文件，大小在1GB以内</p>
        </Dragger>
      </Card>
      <div className="flex gap-5">
        <Button type="primary" className="flex-grow" onClick={handleSubmit}>
          分析
        </Button>
        <Button
          type="primary"
          className="flex-grow"
          danger
          onClick={handleClear}
        >
          重置
        </Button>
      </div>
      <Card title="结果展示">
        <VisGraph graph={graph} options={options} />
      </Card>
      <Button type="primary" className="flex-grow" onClick={handleDownload}>
        下载
      </Button>
    </div>
  );
}
