import React, { useState } from 'react';
import { Layout } from 'antd';
import './SideBarmenu.css';
import Logo from './Logo';
import Menulista from './Menulista';
import SessionMap from './SessionMap';
import StatisticsPanel from './StatisticsPanel';
import AtcInfoSidebar from './AtcInfoSidebar';
import UserInfoSidebar from './UserInfoSidebar';

const { Sider, Content } = Layout;

const sessions = {
  training: { id: '45173539-5080-4c95-9b93-a24713d96ec8', name: 'Training Server' },
  casual: { id: 'd01006e4-3114-473c-8f69-020b89d02884', name: 'Casual Server' },
  expert: { id: 'df2a8d19-3a54-4ce5-ae65-0b722186e44c', name: 'Expert Server' }
};

const SidebarBarMenu = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedSession, setSelectedSession] = useState(sessions.expert);
  const [selectedAtc, setSelectedAtc] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleToggleInfoClick = () => {
    setCollapsed(!collapsed);
  };

  const handleSessionSelect = (key) => {
    setSelectedSession(sessions[key]);
  };

  const handleSessionChange = (sessionId) => {
    setSelectedSession(sessionId);
    setSelectedAtc(null);
    setSelectedFlight(null);
  };

  const handleAtcSelect = (atc) => {
    setSelectedAtc(atc);
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
  };

  const handleBackToStatistics = () => {
    setSelectedAtc(null);
  };

  const handleClickOutside = () => {
    setSelectedFlight(null);
    setSelectedAtc(null); // Adicionado para limpar a seleção do ATC ao clicar fora
  };

  return (
    <Layout style={{ height: '100vh' }} onClick={handleClickOutside}>
      <Sider
        collapsed={true} // Menu sempre retraído
        collapsible
        trigger={null}
        className="sidebar"
        onClick={(e) => e.stopPropagation()} // Prevent sidebar clicks from hiding the UserInfoSidebar
      >
        <Logo />
        <Menulista onToggleInfoClick={handleToggleInfoClick} onSessionSelect={handleSessionSelect} />
      </Sider>
      <Layout>
        <Layout style={{ height: '100%' }}>
          <Content style={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
            <StatisticsPanel sessionId={selectedSession.id} sessionName={selectedSession.name} selectedAtc={selectedAtc} collapsed={collapsed} />
            <SessionMap sessionId={selectedSession.id} setSelectedAtc={handleAtcSelect} setSelectedFlight={handleFlightSelect} />

            {selectedFlight && (
              <UserInfoSidebar flight={selectedFlight} sessionId={selectedSession.id} />
            )}
            {selectedAtc && (
              <AtcInfoSidebar atc={selectedAtc} sessionId={selectedSession.id} />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SidebarBarMenu;
