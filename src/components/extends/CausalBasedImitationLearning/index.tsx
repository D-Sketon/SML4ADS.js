import { ExperimentOutlined, LeftOutlined } from "@ant-design/icons";
import { FloatButton, Layout, Menu, MenuProps } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { ReactElement, useState } from "react";
import { useNavigate } from "react-router-dom";
import CausalityAcquisition from "./CausalityAcquisition";
import ImitationLearningTraining from "./ImitationLearningTraining";
import ImitationLearningResult from "./ImitationLearningResult";

const { Header, Content, Sider } = Layout;

export const meta = {
  title: "基于因果的模仿学习",
  description:
    "基于因果的模仿学习工具，通过对环境因果结构的建模，提高算法在分布外数据上的泛化性能，并增强模型的可解释性。",
};

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
  getItem("因果关系获取", "1", false, <ExperimentOutlined />),
  getItem("模仿学习训练", "2", false, <ExperimentOutlined />),
  getItem("模仿学习结果展示", "3", false, <ExperimentOutlined />),
];

export default function CausalBasedImitationLearning(): ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [key, _setKey] = useState("1");
  const [items, setItems] = useState(ITEMS);
  const navigate = useNavigate();

  const setKey = (key: string) => {
    setItems(
      ITEMS.map((item) => {
        return item;
      })
    );
    _setKey(key);
  };

  const handleSelectMenu = ({ key }: any) => {
    setKey(key);
    return false;
  };

  const switchRouter = () => {
    switch (key) {
      case "1":
        return <CausalityAcquisition />;
      case "2":
        return <ImitationLearningTraining />;
      case "3":
        return <ImitationLearningResult />;
      default:
        return <CausalityAcquisition />;
    }
  };

  return (
    <>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="imitation-learning">
          <Header
            style={{
              padding: "5px 10px",
              background: "#e8e8e8",
              height: "120px",
            }}
            className="flex items-center flex-col"
          >
            <Title level={3} className="text-center">
              基于因果的模仿学习
            </Title>
            <Paragraph>
              一个基于因果的模仿学习工具，通过对环境因果结构的建模，提高算法在分布外数据上的泛化性能，并增强模型的可解释性。
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
                selectedKeys={[key]}
              />
            </Sider>
            <Content
              style={{ overflow: "auto", height: "calc(100vh - 120px)" }}
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
