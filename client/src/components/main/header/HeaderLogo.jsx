import styles from './HeaderLogo.module.css';

import iconLogo from '@icons/logo-dark.svg';

const HeaderLogo = () => {
    return (
        <div className={styles.headerLogo}>
            <a href="/"><img src={iconLogo} alt="Account" /></a>
        </div>
    );
};

export default HeaderLogo;
