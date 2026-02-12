import styles from './ContactData.module.css';

import iconArrow from '@icons/icon-arrow-16.svg';

const ContactData = (props) => {

    const {onNext, typeEditBtn, contactInformation, user} = props;

    return ( 
        <div>                               
                    
            <div className={styles.userContactElement} onClick={() => onNext(contactInformation.phone)}>
                <div className={styles.userContactCategory}>
                    <img src={contactInformation.phone.icon} />
                    <div className={styles.userContactContent}>
                        <div className={styles.contactTitle}>Phone</div>
                        <div 
                            className={styles.contactValue}>
                            {user.phone !== null ? user.phone : ' - - - - - - '}
                        </div>                                            
                    </div>
                </div>                                    
                {(typeEditBtn==='arrow') ? (
                    <img src={iconArrow} className={styles.imgArrow} />
                ) : (
                    <div className={styles.userContactEdit}>
                        <span>Edit</span>
                    </div>
                )}

            </div>

            <div className={styles.userContactElement} onClick={() => onNext(contactInformation.email)}>
                <div className={styles.userContactCategory}>
                    <img src={contactInformation.email.icon} />
                    <div className={styles.userContactContent}>
                        <div className={styles.contactTitle}>E-mail</div>
                        <div 
                            className={styles.contactValue}>
                            {user.email}                           
                        </div>                                            
                    </div>
                </div>                                    
                {(typeEditBtn==='arrow') ? (
                    <img src={iconArrow} className={styles.imgArrow} />
                ) : (
                    <div className={styles.userContactEdit}>
                        <span>Edit</span>
                    </div>
                )}
            </div>                                

        </div>
     );
}
 
export default ContactData;