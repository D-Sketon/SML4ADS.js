import { Button, Card, Col, FloatButton, Row, Spin, notification } from "antd";
import { ReactElement, useContext, useState } from "react";
import { FILE_SUFFIX } from "../../constants";
import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import ExtendCsv from "./common/ExtendCsv";
import AppContext from "../../store/context";

export default function OnlineMonitor(): ReactElement {
  const [csvPath, setCsvPath] = useState("");
  const [stlPath, setStlPath] = useState("");
  const [stlData, setStlData] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [csvArray, setCsvArray] = useState<string[][]>([]);
  const { state } = useContext(AppContext);

  const navigate = useNavigate();

  const handleChooseCsvFile = async (): Promise<void> => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.CSV]);
    if (res.filePaths.length) {
      setCsvPath(res.filePaths[0]);
      const csvText = (
        await window.electronAPI.readFile(res.filePaths[0])
      ).trim();
      setCsvArray(Papa.parse(csvText).data as string[][]);
    }
  };

  const handleChooseStlFile = async (): Promise<void> => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.JSON]);
    if (res.filePaths.length) {
      setStlPath(res.filePaths[0]);
      const json = await window.electronAPI.readFile(res.filePaths[0]);
      if (json) {
        const stlData: {
          stl: string;
        } = JSON.parse(json);
        setStlData(stlData.stl);
      }
    }
  };

  const handleMonitor = async () => {
    if (!csvPath) {
      notification.error({
        message: "Error",
        description: "Please choose csv file",
      });
      return;
    }
    if (!stlPath) {
      notification.error({
        message: "Error",
        description: "Please choose stl file",
      });
      return;
    }
    setImgUrl("");
    setIsLoading(true);
    try {
      const base64 = await window.electronAPI.onlineMonitor(
        csvPath,
        stlData,
        true,
        state.config.simulationPort
      );

      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      setImgUrl(URL.createObjectURL(blob));
      notification.success({
        message: "Success",
        description: "Monitor success",
      });
    } catch (e: any) {
      notification.error({
        message: "Error",
        description: e.message,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="extend-wrapper h-screen overflow-auto bg-stone-100">
      <Card title="在线监测" className="m-2" hoverable>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={2}>csv file:</Col>
          <Col span={22}>
            <Button
              type="primary"
              className="mr-5 w-32"
              onClick={handleChooseCsvFile}
              icon={<UploadOutlined />}
            >
              CSV
            </Button>
            <div className="overflow-hidden text-ellipsis">{csvPath}</div>
          </Col>
        </Row>
        <ExtendCsv csvArray={csvArray} />
        <Row className="flex items-center mt-4 mb-4">
          <Col span={2}>stl path:</Col>
          <Col span={22}>
            <Button
              type="primary"
              className="mr-5 w-32"
              onClick={handleChooseStlFile}
              icon={<UploadOutlined />}
            >
              STL
            </Button>
            <div className="overflow-hidden text-ellipsis">{stlPath}</div>
          </Col>
        </Row>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={2}>stl:</Col>
          <Col span={22}>
            <div>{stlData}</div>
          </Col>
        </Row>
      </Card>
      <div className="box-border m-2 mt-0">
        <Button type="primary" block onClick={handleMonitor}>
          Monitor
        </Button>
      </div>
      <Card title="Output" className="m-2" hoverable>
        <div className="flex justify-center">
          {isLoading && <Spin />}
          {imgUrl && <img src={imgUrl} alt="Output" />}
        </div>
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}
