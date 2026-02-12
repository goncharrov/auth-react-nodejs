import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useClickOutside from '@hooks/useClickOutside';

import { useAuth } from '@http/useAuthAPI';

import styles from './HeaderUserAccount.module.css';

import imgUser from '@icons/user-photo.jpg';
import iconGear from '@icons/icon-gear.svg';
import iconExit from '@icons/icon-exit.svg';

const HeaderUserAccount = () => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [isUserAccount, setIsUserAccount] = useState(false);    
    const { user, logout } = useAuth();   

    const navigate = useNavigate();
    const location = useLocation();

    const selectorRef = useRef(null);
    useClickOutside(selectorRef, () => {
        if (isOpen) {
            toggleOpen();
        }
    });

    useEffect(() => {
        if (location.pathname.includes('account')) {
            setIsUserAccount(true);
        }
    }, [location]);    

    const handleAccount = () => {
        navigate('/account/main/');
    }
    
    const handleLogout = async () => {
        await logout();
        navigate('/auth/');
    };
    
    function toggleOpen() {
        setIsOpen((prev) => !prev);
    }
    
    return (
        <div
            ref={selectorRef}
            className={
                isOpen
                    ? `${styles.userAccountButtonWrapper} ${styles.active}`
                    : styles.userAccountButtonWrapper
            }
        >
            <div className={styles.userAccountButton}>
                <button
                    style={{ border: "none" }}
                    className={isOpen ? styles.active : null}
                    onClick={toggleOpen}
                >
                    <img
                        src={imgUser}
                        className={styles.userAccountButtonImg}
                        alt="Login"
                    />
                </button>

                <div
                    className={
                        isOpen
                            ? `${styles.userAccountDropdownMenu} ${styles.active}`
                            : styles.userAccountDropdownMenu
                    }
                >
                    <div className={styles.userAccountDropdownMenuUserData}>
                        <img src={imgUser} className={styles.userImg} />
                        <span className={styles.userNameLarge}>
                            {user?.preferredName}
                        </span>
                    </div>
                    <ul>
                        {!isUserAccount &&
                            <li>                            
                                <div onClick={handleAccount} className={styles.userAccountDropdownMenulistItem}>
                                    <img src={iconGear} className={styles.userAccountDropdownMenuListImg} />
                                    <span>Managing user profile</span>
                                </div>
                            </li>                            
                        }
                        <li>
                            <div onClick={handleLogout} className={styles.userAccountDropdownMenulistItem}>
                                <img src={iconExit} className={styles.userAccountDropdownMenuListImg} />
                                <span className={styles.logout}>Logout</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HeaderUserAccount;
