import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Card, Col, FloatButton, Row, Spin, notification } from "antd";
import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";
import Papa from "papaparse";
import ExtendCsv from "./common/ExtendCsv";
import AppContext from "../../store/context";

function AdversarialAttack(): ReactElement {
  const { state } = useContext(AppContext);
  const [csvPath, setCsvPath] = useState("");
  const [rnnPath, setRnnPath] = useState("");
  const [pklPath, setPklPath] = useState("");
  const [weightPath, setWeightPath] = useState("");
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

  const handleChooseWeightFile = async () => {
    const res = await window.electronAPI.chooseFile([]);
    if (res.filePaths.length) {
      setWeightPath(res.filePaths[0]);
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
    if (!weightPath) {
      notification.error({
        message: "Error",
        description: "Please choose causal weight file",
      });
      return;
    }
    setIsLoading(true);
    try {
      await window.electronAPI.adversarialAttack(
        csvPath,
        rnnPath,
        pklPath,
        weightPath,
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
    <div
      style={{ backgroundColor: "#f6f6f6", height: "100vh", overflow: "auto" }}
      className="extend-wrapper"
    >
      <Card title="对抗攻击" style={{ margin: "10px" }} hoverable>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>time series file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseCsvFile}
              icon={<UploadOutlined />}
            >
              Time Series
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {csvPath}
            </span>
          </Col>
        </Row>
        <ExtendCsv csvArray={csvArray} />
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>rnn file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseRnnFile}
              icon={<UploadOutlined />}
            >
              RNN
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {rnnPath}
            </span>
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>pkl file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChoosePklFile}
              icon={<UploadOutlined />}
            >
              PKL
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {pklPath}
            </span>
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>causal weight file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseWeightFile}
              icon={<UploadOutlined />}
            >
              Weight
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {weightPath}
            </span>
          </Col>
        </Row>
      </Card>
      <div style={{ padding: "0 10px 10px 10px", boxSizing: "border-box" }}>
        <Button type="primary" block onClick={handleProcess}>
          Process
        </Button>
      </div>
      <Card title="Output" style={{ margin: "10px" }} hoverable>
        {isLoading && <Spin />}
      </Card>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </div>
  );
}

export default AdversarialAttack;
