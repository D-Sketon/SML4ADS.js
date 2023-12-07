import { Button, Card, Col, FloatButton, Row, Spin } from "antd";
import { ReactElement, useState } from "react";
import { FILE_SUFFIX } from "../../constants";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


function OnlineMonitor(): ReactElement {
  const [csvPath, setCsvPath] = useState("");
  const [stlPath, setStlPath] = useState("");
  const [stlData, setStlData] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  
  async function handleChooseCsvFile(): Promise<void> {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.CSV]);
    if (res.filePaths.length) {
      setCsvPath(res.filePaths[0]);
    }
  }

  async function handleChooseStlFile(): Promise<void> {
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
  }

  const handleMonitor = async () => {
    setIsLoading(true);
    const base64 = await window.electronAPI.pstlMonitor(csvPath, stlData, true);
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    setIsLoading(false);
    setImgUrl(URL.createObjectURL(blob));
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
          <Col span={2}>csv path:</Col>
          <Col span={22}>
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
          <Col span={2}>stl path:</Col>
          <Col span={22}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseStlFile}
            >
              Choose File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {stlPath}
            </span>
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={2}>stl:</Col>
          <Col span={22}>
            <div>{stlData}</div>
          </Col>
        </Row>
      </Card>
      <div style={{ padding: "0 10px 10px 10px", boxSizing: "border-box" }}>
        <Button type="primary" block onClick={handleMonitor}>
          Monitor
        </Button>
      </div>
      <Card title="Output" style={{ margin: "10px" }} hoverable>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {isLoading && <Spin />}
          {imgUrl && <img src={imgUrl} alt="Output" />}
        </div>
      </Card>
      <FloatButton
        icon={<LeftOutlined />}
        onClick={() => navigate("/")}
      />
    </div>
  );
}

export default OnlineMonitor;
