import { LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  FloatButton,
  InputNumber,
  Row,
  Spin,
  notification,
} from "antd";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";

function TimeSeriesClustering(): ReactElement {
  const [npyPath, setNpyPath] = useState("");
  const [k, setK] = useState<number | null>(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseNpyFile = async () => {
    const res = await window.electronAPI.chooseFile([FILE_SUFFIX.NPY]);
    if (res.filePaths.length) {
      setNpyPath(res.filePaths[0]);
    }
  };

  const handleProcess = async () => {
    if (!npyPath) {
      notification.error({
        message: "Error",
        description: "Please choose time series file",
      });
      return;
    }
    if (!k) {
      notification.error({
        message: "Error",
        description: "Please input k",
      });
      return;
    }
    setIsLoading(true);
    try {
      await window.electronAPI.timeSeriesClustering(npyPath, k);
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
      <Card title="多维时序数据聚类" style={{ margin: "10px" }} hoverable>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>time series file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              style={{ marginRight: "20px", width: 120 }}
              onClick={handleChooseNpyFile}
            >
              Choose File
            </Button>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {npyPath}
            </span>
          </Col>
        </Row>
        <Row
          style={{ display: "flex", alignItems: "center", margin: "15px 0" }}
        >
          <Col span={4}>k:</Col>
          <Col span={20}>
            <InputNumber value={k} onChange={(e) => setK(e)} />
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

export default TimeSeriesClustering;
