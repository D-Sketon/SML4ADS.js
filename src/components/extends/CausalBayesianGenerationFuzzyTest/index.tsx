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
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("创建新项目", "1", <FileOutlined />),
  getItem("构建CBN", "2", <DesktopOutlined />, [
    getItem("上传文件", "3"),
    getItem("字段筛选", "4"),
    getItem("先验知识", "5"),
    getItem("因果发现", "6"),
    getItem("关系确认", "7"),
    getItem("反驳", "8"),
    getItem("模型学习", "9"),
  ]),
  getItem("场景生成", "10", <ExperimentOutlined />),
  getItem("模糊测试", "11", <ExperimentOutlined />),
];

export default function CausalBayesianGenerationFuzzyTest(): ReactElement {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [workspaceModalVisible, setWorkspaceModalVisible] = useState(false);
  const [workspacePath, setWorkspacePath] = useState("");

  useEffect(() => {
    // setWorkspaceModalVisible(true);
  }, []);

  const handleWorkspaceModalCancel = async () => {
    setWorkspaceModalVisible(false);
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
          <Header style={{ padding: "5px 10px", background: "#e8e8e8", height: '140px' }} className="flex items-center flex-col">
            <Title level={3} className="text-center">
              基于因果贝叶斯的自动驾驶场景生成与模糊测试平台
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
                defaultSelectedKeys={["1"]}
                mode="inline"
                items={items}
                selectable={false}
              />
            </Sider>
            <Content style={{ overflow: 'auto', height: 'calc(100vh - 140px)' }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 360,
                }}
              >
                <Rebuttal />
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
      <FloatButton icon={<LeftOutlined />} onClick={() => navigate("/")} />
    </>
  );
}
