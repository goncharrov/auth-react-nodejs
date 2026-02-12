import { Fragment } from "react";
import { useOutletContext } from "react-router-dom";

import styles from './Account.module.css';

import stylesUserData from '@components/account/user-data-elements/UserDataElements.module.css';
import DataEntryPlaceholder from "@components/account/user-data-entry-placeholder/DataEntryPlaceholder";

import iconArrow from '@icons/icon-arrow-16.svg';
import iconKey from '@icons/icon-key-32.svg';

const AccountSecurity = () => {

    const { 
        contactInformation,
        userData,
        currentContactInfo,
        currentForm,                  
        step,
        goToDataEntryPlaceholderForm,
        manageDataEntryPlaceholderForm,
        goBack,
        handleManageUserData } = useOutletContext();  

    return (
        
        <Fragment>

            {currentForm === 'MainForm' &&
            
                <div className={styles.sectionGroup}>

                    <div className={styles.title}>
                        <span>Password</span>
                    </div>
                        
                    <div className={stylesUserData.userDataElement} onClick={() => goToDataEntryPlaceholderForm(contactInformation.password)}>
                        <div className={stylesUserData.userDataValue}>
                            <img src={iconKey} />
                            <span>Change password</span>
                        </div>
                        <img src={iconArrow} className={stylesUserData.imgArrow} />
                    </div>

                </div>

            }

            {currentForm === 'DataEntryPlaceholder' &&
                <DataEntryPlaceholder 
                    onBack={goBack} 
                    onNext={(event, step, currentContactInfo) => manageDataEntryPlaceholderForm(event, step, currentContactInfo)}
                    onManageUserData={handleManageUserData}
                    currentContactInfo={currentContactInfo}
                    newContactData={userData}
                    step={step}
                />            
            }     

        </Fragment>        
        
    );
}
 
export default AccountSecurity;