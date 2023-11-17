import React, { ReactElement } from "react";
import { Layout } from "antd";
import HeaderButton from "./components/header";
import SiderTree from "./components/sider";
import AntdResizeableSidebar from "./components/common/AntdResizeableSidebar";
import ContentCore from "./components/content";

import "./App.less";

const { Header, Content } = Layout;

function App(): ReactElement {
  return (
    <Layout style={{ width: "100vw", height: "100vh" }}>
      <Header className="app-header">
        <HeaderButton />
      </Header>
      <Layout hasSider>
        <AntdResizeableSidebar theme="light" style={{ overflow: 'auto' }}>
          <SiderTree />
        </AntdResizeableSidebar>
        <Content className="app-content"><ContentCore /></Content>
      </Layout>
    </Layout>
  );
}

export default App;
