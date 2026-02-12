import { useLocation } from 'react-router-dom';

import styles from './Sidebar.module.css';

import iconAccountMain from '@icons/icon-main-32.svg';
import iconAccountDetails from '@icons/icon-my-data-32.svg';
import iconAccountSecurity from '@icons/icon-shield-32.svg';

const Sidebar = () => {

    const location = useLocation();

    const menuItems = [
        { path: '/account/main/', label: 'Main', icon: iconAccountMain },
        { path: '/account/details/', label: 'My details', icon: iconAccountDetails },
        { path: '/account/security/', label: 'Security', icon: iconAccountSecurity },
    ];

    return ( 
        <nav className={styles.sidebarMenu}>

            <div className={styles.sidebarMenuItems}>

                {menuItems.map((item) => (
                    <div 
                        key={item.path}
                        className={`${styles.sidebarMenuItem} ${
                            location.pathname === item.path ? styles.active : null
                        }`}
                    >
                        <a href={item.path}>
                            <img src={item.icon} alt="Account" />
                            <span>{item.label}</span>
                        </a>
                    </div>
                ))}

            </div>                    

        </nav>
     );
}
 
export default Sidebar;