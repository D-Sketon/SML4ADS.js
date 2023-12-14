import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Menu, MenuProps, notification } from "antd";
import "./index.less";
import AppContext from "../../store/context";
import { FILE_SUFFIX } from "../../constants";
import { MModel } from "../../model/Model";
import { MTree } from "../../model/Tree";
import { refreshTree, setSaveFilePath } from "../../store/action";
import VerifyModal from "../modal/VerifyModal";
import ParametricStlModal from "../modal/ParametricStlModal";
import SimulateModal from "../modal/SimulateModal";
import { checkTree } from "../content/tree/utils/check";
import { checkModel } from "../content/model/utils/check";
import ParametricStlMonitorModal from "../modal/ParametricStlMonitorModal";
import {
  ApartmentOutlined,
  CarOutlined,
  LineChartOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";

function HeaderButton(): ReactElement {
  const { state, dispatch } = useContext(AppContext);
  const { filePath, workspacePath, saveFilePath } = state;
  const activatedFile = filePath.find((file) => file.isActive);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [parametricStlModalVisible, setParametricStlModalVisible] =
    useState(false);
  const [
    ParametricStlMonitorModalVisible,
    setParametricStlMonitorModalVisible,
  ] = useState(false);
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
                activatedFile!.path,
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
            dispatch(refreshTree());
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
  const handlePstlMonitor = () => {
    if (activatedFile && activatedFile.ext === FILE_SUFFIX.MODEL) {
      dispatch(setSaveFilePath(activatedFile.path));
      setParametricStlMonitorModalVisible(true);
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

  const items: MenuProps["items"] = [
    {
      label: "Modeling",
      key: "modeling",
      icon: <ApartmentOutlined />,
      children: [
        {
          label: "preprocess",
          key: "preprocess",
        },
      ],
    },
    {
      label: "Verification",
      key: "verification",
      icon: <ReconciliationOutlined />,
    },
    {
      label: "Monitoring",
      key: "monitoring",
      icon: <LineChartOutlined />,
      children: [
        {
          type: "group",
          label: "STL",
          children: [
            {
              label: "PSTL",
              key: "pstl",
            },
            {
              label: "STL Monitor",
              key: "stlMonitor",
            },
          ],
        },
      ],
    },
    {
      label: "Simulation",
      key: "simulation",
      icon: <CarOutlined />,
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "preprocess":
        handlePreprocess();
        break;
      case "verification":
        handleVerify();
        break;
      case 'simulation':
        handleSimulate()
        break
      case 'pstl':
        handlePstl()
        break
      case 'stlMonitor':
        handlePstlMonitor()
        break
      default:
    }
  };

  return (
    <>
      <div>
        <Menu
          onClick={onClick}
          selectedKeys={[]}
          mode="horizontal"
          items={items}
          selectable={false}
        />
      </div>
      <VerifyModal
        isModalOpen={verifyModalVisible}
        handleCancel={() => setVerifyModalVisible(false)}
      />
      <ParametricStlModal
        isModalOpen={parametricStlModalVisible}
        handleCancel={() => setParametricStlModalVisible(false)}
      />
      <ParametricStlMonitorModal
        isModalOpen={ParametricStlMonitorModalVisible}
        handleCancel={() => setParametricStlMonitorModalVisible(false)}
      />
      <SimulateModal
        isModalOpen={simulateModalVisible}
        handleCancel={() => setSimulateModalVisible(false)}
      />
    </>
  );
}

export default HeaderButton;
