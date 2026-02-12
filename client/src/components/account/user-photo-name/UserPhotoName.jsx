import styles from './UserPhotoName.module.css';

import imgUser from '@icons/user-photo.jpg';
import iconArrow from '@icons/icon-arrow-16.svg';

const UserPhotoName = ({name, onClick}) => {
    return ( 
        <div className={styles.userPhotoName} onClick={onClick}>
            <div className={styles.userPhotoNameContent}>
                <img src={imgUser} className={styles.imgUserPhoto} />
                <span>{name}</span>
            </div>
            <img src={iconArrow} className={styles.imgArrow} />                                
        </div> 
    );
}

const UserPhotoNameLarge = ({name}) => {
    return (        
        <div className={styles.userPhotoNameLarge}>
            <div className={styles.userPhotoNameContent}>
                <img src={imgUser} className={styles.imgUserPhoto} style={{width: '56px'}} />
                <span className={styles.userNameLarge}>{name}</span>
            </div>
        </div> 
    );
}
 
export { UserPhotoName, UserPhotoNameLarge }