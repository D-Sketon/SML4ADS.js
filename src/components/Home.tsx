import React, { ReactElement } from "react";
import { Layout } from "antd";

import "./Home.less";
import AntdResizeableSidebar from "./common/AntdResizeableSidebar";
import LogicalContent from "./content/LogicalContent";
import HeaderMenu from "./header";
import SiderTree from "./sider";
import { Routes, Route } from "react-router-dom";

const { Header, Content } = Layout;

export default function Home(): ReactElement {
  return (
    <Layout className="w-screen h-screen">
      <Header className="home-header">
        <HeaderMenu />
      </Header>
      <Layout hasSider>
        <Routes>
          <Route
            path="/logical"
            element={
              <>
                <AntdResizeableSidebar theme="light" className="overflow-auto">
                  <SiderTree />
                </AntdResizeableSidebar>
                <Content className="home-content">
                  <LogicalContent />
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
