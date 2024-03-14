import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  FloatButton,
  Input,
  Row,
  Spin,
  notification,
} from "antd";
import { ReactElement, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FILE_SUFFIX } from "../../constants";
import Papa from "papaparse";
import ExtendCsv from "./common/ExtendCsv";
import AppContext from "../../store/context";

export const meta = {
  title: "因果推理",
  description: "从时间序列数据中挖掘因果关系，以提高模型的鲁棒性和可解释性。"
};

export default function CausalInference(): ReactElement {
  const { state } = useContext(AppContext);
  const [csvPath, setCsvPath] = useState("");
  const [params, setParams] = useState<Record<string, any>>({});
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

  const handleProcess = async () => {
    if (!csvPath) {
      notification.error({
        message: "Error",
        description: "Please choose csv file",
      });
      return;
    }
    setIsLoading(true);
    try {
      await window.electronAPI.causalInference(
        csvPath,
        params,
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
      <Card title="因果推理" className="m-2" hoverable>
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
          <Col span={4}>intensity threshold:</Col>
          <Col span={20}>
            <Input
              onChange={(e) => {
                setParams({
                  ...params,
                  intensityThreshold: e.target.value,
                });
              }}
              className="w-32"
            />
          </Col>
        </Row>
        <Row className="flex items-center mt-4 mb-4">
          <Col span={4}>window size:</Col>
          <Col span={20}>
            <Input
              onChange={(e) => {
                setParams({
                  ...params,
                  windowSize: e.target.value,
                });
              }}
              className="w-32"
            />
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
