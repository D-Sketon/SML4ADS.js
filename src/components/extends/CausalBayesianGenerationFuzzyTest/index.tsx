import {
  DesktopOutlined,
  ExperimentOutlined,
  FileOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { FloatButton, Layout, Menu, MenuProps } from "antd";
import Title from "antd/es/typography/Title";
import { ReactElement, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paragraph from "antd/es/typography/Paragraph";

import "./index.less";
import WorkspaceModal from "./WorkspaceModal";
import Project from "./Project";
import Upload from "./Upload";
import FieldFiltering from "./FieldFiltering";
import PriorKnowledge from "./PriorKnowledge";
import CausalDiscovery from "./CausalDiscovery";
import RelationshipConfirmation from "./RelationshipConfirmation";
import Rebuttal from "./Rebuttal";
import ScenarioGeneration from "./ScenarioGeneration";
import FuzzyTest from "./FuzzyTest";
import ModelLearning from "./ModelLearning";

export const meta = {
  title: "基于因果贝叶斯的场景生成与模糊测试",
  description:
    "支持CBN的构建、自动驾驶风险场景生成、以及对用户自定义的自动驾驶系统进行测试",
};

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  disabled: boolean,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    disabled,
  } as MenuItem;
}

const ITEMS = [
  getItem("创建新项目", "1", false, <FileOutlined />),
  getItem("构建CBN", "2", false, <DesktopOutlined />, [
    getItem("上传文件", "3", true),
    getItem("字段筛选", "4", true),
    getItem("先验知识", "5", true),
    getItem("因果发现", "6", true),
    getItem("关系确认", "7", true),
    getItem("反驳", "8", true),
    getItem("模型学习", "9", true),
  ]),
  getItem("基于CBN的场景生成", "10", false, <ExperimentOutlined />),
  getItem("模糊测试", "11", false, <ExperimentOutlined />),
];

export interface ProjectType {
  csvPath: string;
  csvArray: string[][];
  selectedColumns: string[];
  discovery: {
    algorithm: string;
    test: string;
    score: string;
    gfci: {
      conditioningSet: number;
      graphDegree: number;
      discriminatingLength: number;
      timeLag: number;
      FCIRuleSetUsed: boolean;
      discriminatingRuleDone: boolean;
      msepSearchDone: boolean;
      verboseOutputPrinted: boolean;
    };
    bdeuScore: {
      sampleSize: number;
      coefficient: number;
    };
    gSquareTest: {
      values: number;
    };
    bootStrapping: {
      bootstrapsNumber: number;
      resampleSizePercentage: number;
      seed: number;
      addingOriginalDataset: boolean;
      samplingWithReplacement: boolean;
      individualBootstrappingSaved: boolean;
    };
  };
  rebuttal: string;
  knowledgeEdge: any[];
  confirmationEdge: any[];
}

export const defaultProjectData = () => {
  return {
    csvPath: "点击上传csv文件",
    csvArray: [],
    selectedColumns: [],
    discovery: {
      algorithm: "GFCI",
      test: "CG-LRT",
      score: "BDeu Score",
      gfci: {
        conditioningSet: -1,
        graphDegree: 1000,
        discriminatingLength: -1,
        timeLag: 0,
        FCIRuleSetUsed: true,
        discriminatingRuleDone: true,
        msepSearchDone: true,
        verboseOutputPrinted: true,
      },
      bdeuScore: {
        sampleSize: 10,
        coefficient: 1,
      },
      gSquareTest: {
        values: 0.01,
      },
      bootStrapping: {
        bootstrapsNumber: 0,
        resampleSizePercentage: 100,
        seed: -1,
        addingOriginalDataset: true,
        samplingWithReplacement: true,
        individualBootstrappingSaved: true,
      },
    },
    rebuttal: "PTR",
    knowledgeEdge: [],
    confirmationEdge: [],
  };
};

export default function CausalBayesianGenerationFuzzyTest(): ReactElement {
  const [items, setItems] = useState(ITEMS);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [key, _setKey] = useState("1");

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [workspaceModalVisible, setWorkspaceModalVisible] = useState(false);
  const [workspacePath, setWorkspacePath] = useState("");

  const [projectData, setProjectData] = useState<ProjectType>(
    defaultProjectData()
  );

  useEffect(() => {
    // setWorkspaceModalVisible(true);
  }, []);

  const handleWorkspaceModalCancel = async () => {
    setWorkspaceModalVisible(false);
  };

  const setKey = (key: string) => {
    setItems(
      // @ts-ignore
      ITEMS.map((item) => {
        if (item === null) return null;
        if (item.key === "2") {
          return {
            ...item,
            // @ts-ignore
            children: item.children?.map((child) => {
              if (child.key === key) {
                return {
                  ...child,
                  disabled: false,
                };
              }
              return {
                ...child,
                disabled: true,
              };
            }),
          };
        }
        return item;
      })
    );
    if (key === "1" || key === "10" || key === "11") {
      setOpenKeys([]);
    } else {
      setOpenKeys(["2"]);
    }
    _setKey(key);
  };

  const handleSelectMenu = ({ key }: any) => {
    setKey(key);
    return false;
  };

  const switchRouter = () => {
    switch (key) {
      case "1":
        return <Project setKey={setKey} setProjectData={setProjectData} />;
      case "3":
        return (
          <Upload
            setKey={setKey}
            projectData={projectData}
            setProjectData={setProjectData}
          />
        );
      case "4":
        return (
          <FieldFiltering
            setKey={setKey}
            projectData={projectData}
            setProjectData={setProjectData}
          />
        );
      case "5":
        return (
          <PriorKnowledge
            setKey={setKey}
            projectData={projectData}
            setProjectData={setProjectData}
          />
        );
      case "6":
        return (
          <CausalDiscovery
            setKey={setKey}
            projectData={projectData}
            setProjectData={setProjectData}
          />
        );
      case "7":
        return (
          <RelationshipConfirmation
            setKey={setKey}
            projectData={projectData}
            setProjectData={setProjectData}
          />
        );
      case "8":
        return (
          <Rebuttal
            setKey={setKey}
            projectData={projectData}
            setProjectData={setProjectData}
          />
        );
      case "9":
        return <ModelLearning setKey={setKey} projectData={projectData} />;
      case "10":
        return <ScenarioGeneration setKey={setKey} />;
      case "11":
        return <FuzzyTest setKey={setKey} />;
      default:
        return <Project setKey={setKey} setProjectData={setProjectData}/>;
    }
  };

  return (
    <>
      <WorkspaceModal
        isModalOpen={workspaceModalVisible}
        handleCancel={handleWorkspaceModalCancel}
        workspacePath={workspacePath}
        setWorkspacePath={setWorkspacePath}
      />
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="bayesian">
          <Header
            style={{
              padding: "5px 10px",
              background: "#e8e8e8",
              height: "140px",
            }}
            className="flex items-center flex-col"
          >
            <Title level={3} className="text-center">
              基于因果贝叶斯的自动驾驶场景生成与模糊测试
            </Title>
            <Paragraph>
              RGFuzzer是一个基于因果贝叶斯网络（CBN）的自动驾驶风险场景生成和模糊测试工具。该工具支持CBN的构建、自动驾驶风险场景生成、以及对用户自定义的自动驾驶系统进行测试
            </Paragraph>
          </Header>
          <Layout>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <Menu
                theme="dark"
                mode="inline"
                items={items}
                onSelect={handleSelectMenu}
                onOpenChange={(keys) => setOpenKeys(keys)}
                openKeys={openKeys}
                selectedKeys={
                  key === "1" || key === "10" || key === "11"
                    ? [key]
                    : ["2", key]
                }
              />
            </Sider>
            <Content
              style={{ overflow: "auto", height: "calc(100vh - 140px)" }}
            >
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                }}
              >
                {switchRouter()}
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </>
  );
}
