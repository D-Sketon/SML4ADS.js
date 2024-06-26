import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import {
  Modal,
  Radio,
  Space,
  RadioChangeEvent,
  InputNumber,
  notification,
  Col,
  Input,
  Row,
  Switch,
} from "antd";
import AppContext from "../../store/context";
import { FILE_SUFFIX } from "../../constants";
import SimulationResultModal from "./SimulationResultModal";

export default function SimulateModal({
  isModalOpen,
  handleCancel = () => {},
}: BaseModalProps): ReactElement {
  const { state } = useContext(AppContext);
  const { config, filePath } = state;
  const activatedFile = filePath.find((file) => file.isActive);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [value, setValue] = useState(1);
  const [imageNumber, setImageNumber] = useState(null);

  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [extraInfo, setExtraInfo] = useState({
    acc: [],
    vel: [],
  });

  const [simulationName, setSimulationName] = useState("");
  const [generateVideo, setGenerateVideo] = useState(true);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    // Simulate
    const params: Record<string, any> = {};
    if (value === 1) {
      params["scene"] = imageNumber;
    }
    const adsmlPath = activatedFile!.path.replace(
      new RegExp(FILE_SUFFIX.MODEL + "$", "g"),
      FILE_SUFFIX.ADSML
    );
    params["path"] = adsmlPath;
    params["simulationName"] = simulationName;
    params["generateVideo"] = generateVideo;
    try {
      const extraInfo = await window.electronAPI.simulate(
        params,
        config.simulationPort
      );
      if (extraInfo) {
        setExtraInfo(extraInfo.info);
        setIsResultModalOpen(true);
      }
      notification.success({
        message: "Success",
        description:
          "Simulation completed successfully. Please check Simulation Result for more information.",
      });
    } catch (e: any) {
      notification.error({
        message: "Error",
        description: e.message,
      });
    }
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <>
      <Modal
        title="Configurations"
        confirmLoading={confirmLoading}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row className="flex items-center mt-4 mb-4">
          <Col span={6} style={{ fontWeight: 500 }}>Simulation Name:</Col>
          <Col span={18}>
            <Input
              placeholder="Optional"
              value={simulationName}
              onChange={(e) => setSimulationName(e.target.value)}
            />
          </Col>
        </Row>
        <Radio.Group onChange={onChange} value={value}>
          <Space direction="vertical">
            <Radio value={1} className="flex items-center h-10">
              Scene
              {value === 1 ? (
                <span className="inline-block ml-6">
                  Image number:{" "}
                  <InputNumber
                    placeholder="integer"
                    className="w-24 ml-3"
                    value={imageNumber}
                    // @ts-ignore
                    onChange={(e) => setImageNumber(e)}
                  />
                </span>
              ) : null}
            </Radio>
            <Radio value={2}>Scenario</Radio>
          </Space>
        </Radio.Group>
        {value === 2 ? (
          <Row className="flex items-center mt-4 mb-4">
            <Col span={6}>Generate Video:</Col>
            <Col span={18}>
              <Switch defaultChecked onChange={setGenerateVideo} />
            </Col>
          </Row>
        ) : (
          <></>
        )}
      </Modal>
      <SimulationResultModal
        isModalOpen={isResultModalOpen}
        handleCancel={() => {
          setIsResultModalOpen(false);
          setExtraInfo({
            acc: [],
            vel: [],
          });
        }}
        extraInfo={extraInfo}
      />
    </>
  );
}
