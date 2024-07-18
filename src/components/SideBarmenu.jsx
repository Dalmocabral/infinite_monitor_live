// src/components/SidebarBarMenu.jsx
import { useState } from 'react';
import { Layout } from 'antd';
import { CSSTransition } from 'react-transition-group';
import './SideBarmenu.css';
import Logo from './Logo';
import Menulista from './Menulista';
import SessionMap from './SessionMap';
import StatisticsPanel from './StatisticsPanel';

const { Sider, Content } = Layout;

const sessions = {
  training: '45173539-5080-4c95-9b93-a24713d96ec8',
  casual: 'd01006e4-3114-473c-8f69-020b89d02884',
  expert: 'df2a8d19-3a54-4ce5-ae65-0b722186e44c'
};

const SidebarBarMenu = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [showStatistics, setShowStatistics] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleToggleInfoClick = () => {
    setShowStatistics(!showStatistics);
  };

  const handleSessionSelect = (key) => {
    setSelectedSession(sessions[key]);
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsed={collapsed} collapsible trigger={null} className="sidebar">
        <Logo />
        <Menulista onToggleInfoClick={handleToggleInfoClick} onSessionSelect={handleSessionSelect} />
      </Sider>
      <Layout>
        <Layout style={{ height: '100%' }}>
          <Content style={{ display: 'flex', flexGrow: 1 }}>
            <CSSTransition in={showStatistics} timeout={300} classNames="statistics" unmountOnExit>
              <StatisticsPanel />
            </CSSTransition>
            <SessionMap sessionId={selectedSession} style={{ flexGrow: 1 }} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SidebarBarMenu;
