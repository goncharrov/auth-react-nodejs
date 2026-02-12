import { useNavigate } from 'react-router-dom';

import styles from './HeaderUserAuth.module.css';
import iconUserEmpty from '@icons/icon-user-24.svg';

const HeaderUserAuth = () => {

     const navigate = useNavigate();

     const handleAuth = () => {
         navigate("/auth/");
     };

    return (
        <div className={styles.headerAuth}>
            <button className={styles.headerAuthButton} onClick={handleAuth}>
                <img
                    src={iconUserEmpty}
                    className={styles.headerAuthSvg}
                    alt="Authorization"
                />
            </button>
        </div>
    );
};

export default HeaderUserAuth;
