
import { Menu } from 'antd';
import { FaEarthAmericas, FaPlane, FaSatelliteDish, FaGear, FaRightFromBracket, FaServer } from "react-icons/fa6";


const Menulista = () => {
  return (
    <Menu theme='dark' mode='inline' className='menu-bar'>
       <Menu.SubMenu key='server' icon={<FaServer />} title='Serves'>
            <Menu.Item key="casual">
                Casual server
            </Menu.Item>
            <Menu.Item key="training">
                Training server
            </Menu.Item>
            <Menu.Item key="expert">
                Expert server
            </Menu.Item>
            </Menu.SubMenu> 
      <Menu.Item key="toogleinfo" icon={<FaEarthAmericas />}>
        Toogle Info
      </Menu.Item>
      <Menu.Item key="pilots" icon={<FaPlane />}>
        Pilots
      </Menu.Item>
      <Menu.Item key="atc" icon={<FaSatelliteDish />}>
        ATC
      </Menu.Item>
      <Menu.Item key="setting" icon={<FaGear />}>
        Settings
      </Menu.Item>
      <Menu.Item key="login" icon={<FaRightFromBracket />}>
        Login
      </Menu.Item>
    </Menu>
  );
}

export default Menulista;
