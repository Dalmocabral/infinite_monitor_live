import { useState } from 'react';
import { Layout } from 'antd';
import { CSSTransition } from 'react-transition-group';
import './SideBarmenu.css';
import Logo from './Logo';
import Menulista from './Menulista';
import MapLeaflet from './MapLeaflet';
import StatisticsPanel from './StatisticsPanel';

const { Sider, Content } = Layout;

const SidebarBarMenu = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [showStatistics, setShowStatistics] = useState(true);

    const handleToggleInfoClick = () => {
        setShowStatistics(!showStatistics);
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider
                collapsed={collapsed}
                collapsible
                trigger={null}
                className="sidebar">
                <Logo />
                <Menulista onToggleInfoClick={handleToggleInfoClick} />
            </Sider>
            <Layout>
                <Layout style={{ height: '100%' }}>
                    <Content style={{ display: 'flex', flexGrow: 1 }}>
                        <CSSTransition
                            in={showStatistics}
                            timeout={300}
                            classNames="statistics"
                            unmountOnExit
                        >
                            <StatisticsPanel />
                        </CSSTransition>
                        <MapLeaflet style={{ flexGrow: 1 }} />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default SidebarBarMenu;
