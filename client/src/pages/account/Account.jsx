import { Fragment, useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from '@http/useAuthAPI';
import { useAccount } from '@http/useAccountAPI';

import styles from './Account.module.css';

import LoadingPage from "@pages/LoadingPage";

import Header from '@components/account/header/Header';
import Sidebar from '@components/account/sidebar/Sidebar';

import ErrorModal from '@components/account/error-modal/ErrorModal';

import { checkContactData } from "@utils/formValidation";
import { contactInformation } from "@data/userData";

const VALID_SUBROUTES = ["main", "details", "security", "rentals"];

const Account = () => {    
    
    // Manage modal error window
    const [errorModal, setErrorModal] = useState({
        isOpen: false,
        title: 'Error',
        reason: '',
        explanation: '',
        example: ''
    });

    // Function to open a modal window with an error
    const showError = (reason, explanation, example) => {
        setErrorModal({
        isOpen: true,
        title: 'Error',
        reason,
        explanation,
        example
        });
    };

    const { 
        getUserVerificationCode, 
        checkUserVerificationCode,
        checkUserContactData,
        writeNewUserContactData,
        checkUserPassword,
        writeNewUserPassword,
        deleteUserAccount } = useAccount();

    // Function to close a modal window
    const closeError = () => {
        setErrorModal(prev => ({ ...prev, isOpen: false }));
    };

    //////////////////////////////////////////
    // Manage add new user data

    const [currentForm, setCurrentForm] = useState('MainForm');
    const [formHistory, setFormHistory] = useState([]);

    const [step, setStep] = useState('');     
    
    // For contact data 
    // stepOne - check contact verification code for current contact data
    // stepTwo - get new user contact data
    // stepThree - check contact verification code for new contact data
    
    // For security
    // stepOne - check current password
    // stepTwo - check contact verification code if user forget password
    // stepThree - set new password

    const [currentContactInfo, setCurrentContactInfo] = useState([]);
    
    const [userData, setUserData] = useState({
        currentValue: '',
        valueStepOne: '',
        valueStepTwo: '',
        valueStepThree: ''
    });

    const { user, setUser, isAuthenticated, loading } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const subpath = location.pathname.replace("/account/", "").split("/")[0];
        if (subpath && !VALID_SUBROUTES.includes(subpath)) {
            navigate("/account/main/", { replace: true });
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        if (!loading && isAuthenticated === false) {
            navigate("/");
        }
    }, [isAuthenticated, loading, navigate]); 

    // contact data manage
    const handleManageUserData = (event) => {
        
        const value = event.target.value;
        
        if (step === 'stepOne') {
            setUserData(prev => ({ ...prev, valueStepOne: value })); 
        } else if (step === 'stepTwo') {
            setUserData(prev => ({ ...prev, valueStepTwo: value }));
        } else if (step === 'stepThree') {
            setUserData(prev => ({ ...prev, valueStepThree: value }));
        };

    }

     // Form manage     
    const goToDataEntryPlaceholderForm = async (currentContactInfo) => {

        setUserData({ 
            currentValue: '', 
            valueStepOne: '', 
            valueStepTwo: '', 
            valueStepThree: '' }); 
        
        if (currentContactInfo.type === 'email' || currentContactInfo.type === 'phone') {
            
            const currentContactValue = user[currentContactInfo.type];

            setUserData(prev => ({ ...prev, currentValue: currentContactValue }));
                
            const context = {
                type: currentContactInfo.type,
                isNewValue: false,
                newValue: null
            };

            try {
                const result = await getUserVerificationCode(context);

                if (result.isContactDataEmpty) {
                    setStep('stepTwo');
                } else {
                    if (result.isCodeWritten) {
                        setStep('stepOne');
                    } else {
                        return;
                    }
                }           
            } catch (error) {
                console.log("Error:", error);
                return;
            };        
        
        } else if (currentContactInfo.type === 'password') {
            setStep('stepOne'); 
            setUserData((prev) => ({...prev, currentValue: user.email }));           
        } else if (currentContactInfo.type === 'deleteAccount') {
            setStep('stepOne');
        }

        setCurrentContactInfo(currentContactInfo);
        setFormHistory([...formHistory, currentForm]);
        setCurrentForm('DataEntryPlaceholder');

    }

    const manageDataEntryPlaceholderForm = async (event, nextStep, currentContactInfo) => {
       
        event.preventDefault(); 
        
        if (currentContactInfo.type === 'email' || currentContactInfo.type === 'phone') {
 
            if (step === 'stepOne') {
                if (userData.valueStepOne.trim() === "") {
                    showError('Enter verification code', `Sent to ${userData.currentValue}`, null);
                    return;
                }
                try {
                    const result = await checkUserVerificationCode(userData.valueStepOne.trim());
                    if (!result.success) {
                        showError(null, result.error, null);
                        return;
                    }
                } catch (error) {
                    showError(null, error.message, null);
                    return;
                };
            } else if (step === 'stepTwo') {
    
                const isContactDataValid = checkContactData(currentContactInfo.type, userData.valueStepTwo.trim());
                if (!isContactDataValid.isValid) {
                    showError(isContactDataValid.reason, isContactDataValid.explanation, isContactDataValid.example); 
                    return;               
                };

                const context = {
                    type: currentContactInfo.type,
                    value: isContactDataValid.value               
                }

                try {
                    const result = await checkUserContactData(context);
                    if (!result.success) {
                        showError(null, result.error, null);
                        return;
                    }
                } catch (error) {
                    showError(null, error.message, null);
                    return;
                };
                
            } else if (step === 'stepThree') {
                if (userData.valueStepThree.trim() === "") {
                    showError('Enter verification code', `Sent to ${userData.valueStepTwo}`, null);
                    return;
                }

                const context = {
                    type: currentContactInfo.type,
                    value: userData.valueStepTwo.trim(),
                    code: userData.valueStepThree.trim()
                };

                try {
                    const result = await writeNewUserContactData(context);
                    if (!result.success) {
                        showError(null, result.error, null);
                        return;
                    };
                    setUser(result.user); 
                    backToMainPage();
                    return;
                } catch (error) {
                    showError(null, error.message, null);
                    return;
                };
            }

        } else if (currentContactInfo.type === 'password') {            

            if (step === 'stepOne') {

                if (nextStep === "stepThree") {
                    if (userData.valueStepOne === "") {
                        showError(null, "Please enter your password", null);
                        return;
                    }
                    try {
                        const result = await checkUserPassword(
                            userData.valueStepOne,
                        );

                        if (result.success) {
                            nextStep === "stepThree";    
                        } else {
                            showError(null, result.error, null);
                            return;
                        }                        
                    } catch (error) {
                        showError(null, error.message, null);
                        return;
                    }
                } else if (nextStep === "stepTwo") {                    

                    const context = {
                        type: 'email',
                        isNewValue: false,
                        newValue: null
                    };
                    
                    try {
                        const result = await getUserVerificationCode(context);                        
                        if (result.success) {
                            setStep("stepTwo");
                        } else {
                            showError(null, result.error, null);
                            return;
                        };
                    } catch (error) {
                        console.log("Error:", error);
                        return;
                    }                   
                } 
            } else if (step === 'stepTwo') {
                if (userData.valueStepTwo.trim() === "") {
                    showError('Enter verification code', `Sent to ${userData.currentValue}`, null);
                    return;
                }
                try {
                    const result = await checkUserVerificationCode(userData.valueStepTwo.trim());
                    if (!result.success) {
                        showError(null, result.error, null);
                        return;
                    }
                } catch (error) {
                    showError(null, error.message, null);
                    return;
                };
            } else if (step === 'stepThree') {
                if (userData.valueStepThree === "") {
                    showError(null, "Please enter new password", null);
                    return;
                };
                try {
                    const result = await writeNewUserPassword(userData.valueStepThree);
                    if (!result.success) {
                        showError(null, result.error, null);
                        return;
                    };
                    backToMainPage();
                    return;
                } catch (error) {
                    showError(null, error.message, null);
                    return;
                };
            };     
        } else if (currentContactInfo.type === 'deleteAccount') {
            if (step === 'stepOne') {
                if (userData.valueStepOne === "") {
                    showError(null, "Please enter your password", null);
                    return;
                };
                try {
                    const result = await deleteUserAccount(userData.valueStepOne);
                    if (!result.success) {
                        showError(null, result.error, null);
                        return;
                    };
                    navigate('/');
                    return;
                } catch (error) {
                    showError(null, error.message, null);
                    return;
                };
            } else {
                backToMainPage();
                return;
            }

        };

        if (nextStep !== 'finish') {
            setStep(nextStep);        
            setFormHistory([...formHistory, currentForm]);            
            setCurrentForm('DataEntryPlaceholder');
        }
                
    };

    const backToMainPage = () => {        
        setUserData({
            currentValue: "",
            valueStepOne: "",
            valueStepTwo: "",
            valueStepThree: "",
        });
        setStep("");
        setFormHistory([]);
        setCurrentForm("MainForm");
    }

    const goBack = (nextStep) => {

        if ( currentContactInfo.type === "email" || currentContactInfo.type === "phone" ) {
            if (nextStep === "stepOne" || nextStep === "stepThree") {
                backToMainPage();
                return;
            } else if (nextStep === "stepTwo") {
                setUserData((prev) => ({...prev, valueStepTwo: "", valueStepThree: "" }));
                setStep(nextStep);
            }            
        } else if (currentContactInfo.type === "password" || currentContactInfo.type === "deleteAccount") {
            backToMainPage();
            return;
        }

        if (formHistory.length > 0) {
            const lastForm = formHistory[formHistory.length - 1];
            const newHistory = formHistory.slice(0, -1);
            setFormHistory(newHistory);
            setCurrentForm(lastForm);
        }        
        
    };

    if (loading || isAuthenticated === undefined) {
        return (
            <LoadingPage />
        );
    };

    return ( 
        <Fragment> 

            <Header />          

            <div className={styles.mainWrapper}>
                <div className={styles.formContainer}>
                    <div className={styles.formContent}>

                        <Sidebar />

                        <main className={styles.mainContent}>
                        
                            <div className={styles.contentSection}>
                                <Outlet context={{
                                    user,
                                    setUser, 
                                    contactInformation,
                                    userData,
                                    currentContactInfo,
                                    currentForm,                  
                                    step,
                                    goToDataEntryPlaceholderForm,
                                    manageDataEntryPlaceholderForm,
                                    goBack,
                                    handleManageUserData                                       
                                }}/>
                            </div>

                        </main>

                    </div>
                </div>
            </div>

            <ErrorModal 
                isOpen={errorModal.isOpen}
                onClose={closeError}
                title={errorModal.title}
                reason={errorModal.reason}
                explanation={errorModal.explanation}
                example={errorModal.example}
            />

        </Fragment>
    );
}
 
export default Account;