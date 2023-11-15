import React, { ReactElement } from 'react';
import { Layout } from 'antd';
import HeaderButton from './components/header';
import './App.less';
import SiderTree from './components/sider';

const { Header, Footer, Sider, Content } = Layout;


const siderStyle: React.CSSProperties = {
  backgroundColor: '#fff',
};

function App(): ReactElement {
  return (
    <Layout style={{ width: '100vw', height: '100vh' }}>
      <Header className='app-header'><HeaderButton /></Header>
      <Layout hasSider>
        <Sider style={siderStyle}><SiderTree /></Sider>
        <Content className='app-content'>Content</Content>
      </Layout>
      <Footer className='app-footer'>Footer</Footer>
    </Layout>
  );
}

export default App;
