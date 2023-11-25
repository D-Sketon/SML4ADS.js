import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Button, notification } from "antd";
import "./index.less";
import AppContext from "../../store/context";
import { FILE_SUFFIX } from "../../constants";
import { MModel } from "../../model/Model";
import { MTree } from "../../model/Tree";
import { setSaveFilePath } from "../../store/action";
import VerifyModal from "../modal/VerifyModal";
import ParametricStlModal from "../modal/ParametricStlModal";
import SimulateModal from "../modal/SimulateModal";
import { checkTree } from "../content/tree/utils/check";
import { checkModel } from "../content/model/utils/check";

function HeaderButton(): ReactElement {
  const { state, dispatch } = useContext(AppContext);
  const { filePath, workspacePath, saveFilePath } = state;
  const activatedFile = filePath.find((file) => file.isActive);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [parametricStlModalVisible, setParametricStlModalVisible] =
    useState(false);
  const [simulateModalVisible, setSimulateModalVisible] = useState(false);

  // data flow: "" => realPath => $$\ua265SAVE\ua265$$ => ""
  useEffect(() => {
    const asyncFn = async () => {
      if (saveFilePath === "$$\ua265SAVE\ua265$$") {
        dispatch(setSaveFilePath(""));
        try {
          const modelContent = await window.electronAPI.readFile(
            activatedFile!.path
          );
          if (modelContent) {
            const model: MModel = JSON.parse(modelContent);
            checkModel(model);
            for (const car of model.cars) {
              const absolutePath = await window.electronAPI.getAbsolutePath(
                workspacePath,
                car.treePath
              );
              const treeContent = await window.electronAPI.readFile(
                absolutePath
              );
              if (treeContent) {
                const tree: MTree = JSON.parse(treeContent);
                checkTree(tree);
                car.mTree = tree;
              } else {
                throw new Error("Read tree file failed.");
              }
            }
            // change absolutePath's suffix from model to adsml
            const adsmlPath = activatedFile!.path.replace(
              new RegExp(FILE_SUFFIX.MODEL + "$", "g"),
              FILE_SUFFIX.ADSML
            );
            await window.electronAPI.writeJson(adsmlPath, model);
          } else {
            throw new Error("Read model file failed.");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activatedFile, filePath, saveFilePath, workspacePath]);

  const handlePreprocess = async () => {
    if (activatedFile && activatedFile.ext === FILE_SUFFIX.MODEL) {
      dispatch(setSaveFilePath(activatedFile.path));
    } else {
      notification.error({
        message: "Error",
        description: "Please select a model file first.",
      });
    }
  };
  const handleVerify = () => {
    if (activatedFile && activatedFile.ext === FILE_SUFFIX.MODEL) {
      dispatch(setSaveFilePath(activatedFile.path));
      setVerifyModalVisible(true);
    } else {
      notification.error({
        message: "Error",
        description: "Please select a model file first.",
      });
    }
  };
  const handlePstl = () => {
    if (activatedFile && activatedFile.ext === FILE_SUFFIX.MODEL) {
      dispatch(setSaveFilePath(activatedFile.path));
      setParametricStlModalVisible(true);
    } else {
      notification.error({
        message: "Error",
        description: "Please select a model file first.",
      });
    }
  };
  const handleSimulate = () => {
    if (activatedFile && activatedFile.ext === FILE_SUFFIX.MODEL) {
      dispatch(setSaveFilePath(activatedFile.path));
      setSimulateModalVisible(true);
    } else {
      notification.error({
        message: "Error",
        description: "Please select a model file first.",
      });
    }
  };
  return (
    <>
      <div className="header-wrapper">
        <Button onClick={handlePreprocess}>Preprocess</Button>
        <Button onClick={handleVerify}>Verify</Button>
        <Button onClick={handlePstl}>PSTL</Button>
        <Button type="primary" onClick={handleSimulate}>
          Simulate
        </Button>
      </div>
      <VerifyModal
        isModalOpen={verifyModalVisible}
        handleCancel={() => setVerifyModalVisible(false)}
      />
      <ParametricStlModal
        isModalOpen={parametricStlModalVisible}
        handleCancel={() => setParametricStlModalVisible(false)}
      />
      <SimulateModal 
        isModalOpen={simulateModalVisible}
        handleCancel={() => setSimulateModalVisible(false)}
      />
    </>
  );
}

export default HeaderButton;
