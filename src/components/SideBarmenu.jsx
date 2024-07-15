import { useState } from 'react';
import { Button, Layout, theme } from 'antd';
import { RiMenuUnfold3Fill, RiMenuUnfold4Fill } from "react-icons/ri";
import "./SideBarmenu.css";
import Logo from './Logo';
import Menulista from './Menulista';
import MapLeaflet from './MapLeaflet';

const { Header, Sider } = Layout;

const SidebarBarMenu = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer }, } = theme.useToken();

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider
                collapsed={collapsed}
                collapsible
                trigger={null}
                className="sidebar">
                <Logo />
                <Menulista />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type='text'
                        className='toggle'
                        onClick={() => setCollapsed(!collapsed)}
                        icon={collapsed ? <RiMenuUnfold3Fill /> : <RiMenuUnfold4Fill />} />
                </Header>
                
                <MapLeaflet />
                 
            </Layout>
        </Layout>
    )
}

export default SidebarBarMenu;
