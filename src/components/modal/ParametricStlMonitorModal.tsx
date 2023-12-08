import { Modal, Row, Col, notification, Input } from "antd";
import { ReactElement, useContext, useEffect, useState } from "react";
import AppContext from "../../store/context";
import { BaseModalProps } from "./types";
import { setSaveFilePath } from "../../store/action";
import { checkModel } from "../content/model/utils/check";
import { MModel } from "../../model/Model";

function ParametricStlMonitorModal(props: BaseModalProps): ReactElement {
  const { isModalOpen, handleCancel = () => {} } = props;

  const { state, dispatch } = useContext(AppContext);
  const { filePath, saveFilePath, config } = state;
  const activatedFile = filePath.find((file) => file.isActive);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [parameters, setParameters] = useState<string[][]>([]);
  const [parametricStls, setParametricStls] = useState<string[]>([]);
  const [parametersMap, setParametersMap] = useState<Record<string, string>>(
    {}
  );

  // onMounted
  useEffect(() => {
    const asyncFn = async () => {
      if (isModalOpen && saveFilePath === "$$\ua265SAVE\ua265$$") {
        dispatch(setSaveFilePath(""));
        try {
          const modelContent = await window.electronAPI.readFile(
            activatedFile!.path
          );
          if (modelContent) {
            const model: MModel = JSON.parse(modelContent);
            checkModel(model);
            const source = model.parameters.map((p) => p.split(" "));
            setParameters(source ?? []);
            setParametricStls(model.parametricStls ?? []);
            const map: Record<string, string> = {};
            [...new Set(source.flat())]
              .filter((i) => i)
              .forEach((parameter) => {
                map[parameter] = "";
              });
            setParametersMap(map);
          }
        } catch (error: any) {
          console.error(error);
          notification.error({
            message: "Error",
            description: error.message,
          });
        }
      }
    };
    asyncFn();
  }, [activatedFile, dispatch, isModalOpen, saveFilePath]);

  const handleOk = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setConfirmLoading(true);
    for (const [key, value] of Object.entries(parametersMap)) {
      if (!value) {
        notification.error({
          message: "Error",
          description: `Please input ${key}.`,
        });
        setConfirmLoading(false);
        return;
      }
    }
    // replace pstl params
    const replacedParametricStls = parametricStls.map((pstl, index) => {
      let replacedPstl = pstl;
      for (const p of parameters[index]) {
        replacedPstl = replacedPstl.replace(
          new RegExp(p, "g"),
          parametersMap[p] ?? ""
        );
      }
      return replacedPstl;
    });
    await window.electronAPI.onlineMonitor(
      "signal1.csv",
      replacedParametricStls[0],
      false,
      config.simulationPort
    );
    setConfirmLoading(false);
    handleCancel(e);
  };

  const handleInput = (key: string, value: string) => {
    setParametersMap((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal
      title="Monitor"
      confirmLoading={confirmLoading}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {[...new Set(parameters.flat())]
        .filter((i) => i)
        .map((parameter, index) => {
          return (
            <Row
              style={{
                display: "flex",
                alignItems: "center",
                margin: "15px 0",
              }}
              key={index}
            >
              <Col span={6}>{parameter}:</Col>
              <Col span={18}>
                <Input
                  value={parametersMap[parameter] ?? ""}
                  onChange={(e) => {
                    handleInput(parameter, e.target.value);
                  }}
                />
              </Col>
            </Row>
          );
        })}
    </Modal>
  );
}

export default ParametricStlMonitorModal;
