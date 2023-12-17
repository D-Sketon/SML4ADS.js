import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import { Modal, Radio, Space, RadioChangeEvent, InputNumber } from "antd";
import AppContext from "../../store/context";
import { FILE_SUFFIX } from "../../constants";

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
    await window.electronAPI.simulate(params, config.simulationPort);
    setConfirmLoading(false);
    handleCancel(e);
  };

  return (
    <Modal
      title="Configurations"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
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
    </Modal>
  );
}
