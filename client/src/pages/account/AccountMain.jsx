import { Fragment } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import styles from './Account.module.css';

import { UserPhotoName } from "@components/account/user-photo-name/UserPhotoName";
import ContactData from "@components/account/user-data-contacts/ContactData";

import DataEntryPlaceholder from "@components/account/user-data-entry-placeholder/DataEntryPlaceholder";

const AccountMain = () => {

    const navigate = useNavigate();

    const handleUserDetails = () => {
        navigate('/account/details/');
    }

    const {
        user, 
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

                <Fragment>

                    <div className={styles.sectionGroup}>
                        <UserPhotoName name={user.preferredName} onClick={handleUserDetails}/>      
                    </div>

                    <div className={styles.sectionGroup}>

                        <div className={styles.title}>
                            <span>Contact details</span>
                        </div>

                        <ContactData                            
                            onNext={(currentContactInfo) => goToDataEntryPlaceholderForm(currentContactInfo)} 
                            typeEditBtn={'arrow'}
                            contactInformation={contactInformation}
                            user={user}
                        />
                        
                    </div>

                </Fragment>                

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
    )
}

export default AccountMain;