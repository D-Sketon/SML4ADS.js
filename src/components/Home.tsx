import React, { ReactElement } from "react";
import { Layout } from "antd";

import "./Home.less";
import AntdResizeableSidebar from "./common/AntdResizeableSidebar";
import ContentCore from "./content";
import HeaderButton from "./header";
import SiderTree from "./sider";
import { Routes, Route } from "react-router-dom";

const { Header, Content } = Layout;

function Home(): ReactElement {
  return (
    <Layout style={{ width: "100vw", height: "100vh" }}>
      <Header className="home-header">
        <HeaderButton />
      </Header>
      <Layout hasSider>
        <Routes>
          <Route
            path="/logical"
            element={
              <>
                <AntdResizeableSidebar
                  theme="light"
                  style={{ overflow: "auto" }}
                >
                  <SiderTree />
                </AntdResizeableSidebar>
                <Content className="home-content">
                  <ContentCore />
                </Content>
              </>
            }
          ></Route>
          <Route path="functional" element={<></>}></Route>
        </Routes>
      </Layout>
    </Layout>
  );
}

export default Home;
