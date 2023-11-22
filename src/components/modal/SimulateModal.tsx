import { ReactElement, useContext, useState } from "react";
import { BaseModalProps } from "./types";
import { Modal, Radio, Space, RadioChangeEvent, InputNumber } from "antd";
import AppContext from "../../store/context";
import { FILE_SUFFIX } from "../../constants";

function SimulateModal(props: BaseModalProps): ReactElement {
  const { isModalOpen, handleCancel = () => {} } = props;

  const { state, dispatch } = useContext(AppContext);
  const { workspacePath, config, filePath } = state;
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
          <Radio
            value={1}
            style={{ height: 40, display: "flex", alignItems: "center" }}
          >
            Scene
            {value === 1 ? (
              <span style={{ display: "inline-block", marginLeft: 20 }}>
                Image number:{" "}
                <InputNumber
                  placeholder="integer"
                  style={{ width: 100, marginLeft: 10 }}
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

export default SimulateModal;
