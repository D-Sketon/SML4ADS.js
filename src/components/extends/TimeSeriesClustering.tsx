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
import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";
import AppContext from "../../store/context";

export default function TimeSeriesClustering(): ReactElement {
  const { state } = useContext(AppContext);
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
      await window.electronAPI.timeSeriesClustering(
        npyPath,
        k,
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
      <Card title="多维时序数据聚类" className="m-2" hoverable>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>time series file:</Col>
          <Col span={20}>
            <Button
              type="primary"
              className="mr-5 w-32"
              onClick={handleChooseNpyFile}
            >
              Choose File
            </Button>
            <span className="overflow-hidden text-ellipsis">{npyPath}</span>
          </Col>
        </Row>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>k:</Col>
          <Col span={20}>
            <InputNumber value={k} onChange={(e) => setK(e)} />
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
