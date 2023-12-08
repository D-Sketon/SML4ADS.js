import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Col, FloatButton, Row, Spin, notification } from "antd";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";

function IntervalizedWFA(): ReactElement {
  const [csvPath, setCsvPath] = useState("");
  const [rnnPath, setRnnPath] = useState("");
  const [pklPath, setPklPath] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseCsvFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.CSV]);
    if (res.filePaths.length) {
      setCsvPath(res.filePaths[0]);
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
    await window.electronAPI.intervalizedWFA(csvPath, rnnPath, pklPath);
    setIsLoading(false);
  };

  return (
    <div
      style={{ backgroundColor: "#f6f6f6", height: "100vh", overflow: "auto" }}
      className="extend-wrapper"
    >
      <Card title="Input" style={{ margin: "10px" }} hoverable>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>time series file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseCsvFile}
            >
              Choose File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {csvPath}
            </span>
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>rnn file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseRnnFile}
            >
              Choose File
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
            >
              Choose File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {pklPath}
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

export default IntervalizedWFA;
