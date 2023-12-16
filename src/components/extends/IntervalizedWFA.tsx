import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, FloatButton, Row, Spin, notification } from "antd";
import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";
import ExtendCsv from "./common/ExtendCsv";
import Papa from "papaparse";
import AppContext from "../../store/context";

function IntervalizedWFA(): ReactElement {
  const { state } = useContext(AppContext);
  const [csvPath, setCsvPath] = useState("");
  const [rnnPath, setRnnPath] = useState("");
  const [pklPath, setPklPath] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [csvArray, setCsvArray] = useState<string[][]>([]);

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

  const handleChooseRnnFile = async () => {
    const res = await window.electronAPI.chooseFile([]);
    if (res.filePaths.length) {
      setRnnPath(res.filePaths[0]);
    }
  };

  const handleChoosePklFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.PKL]);
    if (res.filePaths.length) {
      setPklPath(res.filePaths[0]);
    }
  };

  const handleProcess = async () => {
    if (!csvPath) {
      notification.error({
        message: "Error",
        description: "Please choose csv file",
      });
      return;
    }
    if (!rnnPath) {
      notification.error({
        message: "Error",
        description: "Please choose rnn file",
      });
      return;
    }
    if (!pklPath) {
      notification.error({
        message: "Error",
        description: "Please choose pkl file",
      });
      return;
    }
    setIsLoading(true);
    try {
      await window.electronAPI.intervalizedWFA(
        csvPath,
        rnnPath,
        pklPath,
        state.config.simulationPort
      );
      notification.success({
        message: "Success",
        description: "Process Success",
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
      <Card title="抽象自动机" className="m-2" hoverable>
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
        <ExtendCsv csvArray={csvArray} />
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>rnn file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              className="mr-5 w-32"
              onClick={handleChooseRnnFile}
              icon={<UploadOutlined />}
            >
              RNN
            </Button>
            <span className="overflow-hidden text-ellipsis">{rnnPath}</span>
          </Col>
        </Row>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>pkl file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              className="mr-5 w-32"
              onClick={handleChoosePklFile}
              icon={<UploadOutlined />}
            >
              PKL
            </Button>
            <span className="overflow-hidden text-ellipsis">{pklPath}</span>
          </Col>
        </Row>
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

export default IntervalizedWFA;
