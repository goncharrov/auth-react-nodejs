import styles from './DataEntryPlaceholder.module.css';

import { Input, InputPassword } from '@components/account/input/Input';
import { BlueButton } from '@components/account/button/Button';

import iconArrow from '@icons/icon-arrow-32.svg';

const DataEntryPlaceholder = (props) => {

    const {
        onBack, 
        onNext,
        onManageUserData, 
        currentContactInfo,
        newContactData,
        step} = props;
    
    const isContactData = currentContactInfo.type === 'email' || currentContactInfo.type === 'phone';
    const showForgotPassword = (step === 'stepOne' && currentContactInfo.type === 'password'); 
    
    let nextStep = '';
    let backToStep = '';    
    let value = null;
    let inputType = '';
   
    if (step === 'stepOne') {
        if (isContactData) {
            nextStep = 'stepTwo';
        } else {
            nextStep = 'stepThree';
        }        
        backToStep = '';        
        value = newContactData.valueStepOne;
        inputType = currentContactInfo.inputTypeStepOne;
    } else if (step === 'stepTwo') {
        nextStep = 'stepThree';
        backToStep = 'stepOne';        
        value = newContactData.valueStepTwo;
        inputType = currentContactInfo.inputTypeStepTwo;
    } else if (step === 'stepThree') {
        nextStep = 'finish';
        backToStep = 'stepTwo';        
        value = newContactData.valueStepThree;
        inputType = currentContactInfo.inputTypeStepThree;    
    }    

    return (
        
        <div className={styles.contactDataField}>

            <div 
                className={styles.contactDataButtonBack} 
                onClick={() => onBack(backToStep)}
                >
                <img src={iconArrow} alt="" />                                         
            </div>
        
            <div className={styles.contactDataFieldIcon}>
                <img src={currentContactInfo.icon} alt="" />
            </div>
        
            <div className={styles.contactDataFieldTitle}>
                {step === 'stepOne' && 
                    <span>{currentContactInfo.titleStepOne}</span>
                }
                {step === 'stepTwo' && 
                    <span>{currentContactInfo.titleStepTwo}</span>
                }
                {step === 'stepThree' && 
                    <span>{currentContactInfo.titleStepThree}</span>
                }                 
            </div>
        
            <div className={styles.contactDataFieldDescription}>
                
                {/* Change Contact data description */}

                {isContactData && step === 'stepOne' && 
                    <span>{currentContactInfo.descriptionStepOne} {newContactData.currentValue}</span>
                }

                {isContactData && step === 'stepTwo' && 
                    <span>{currentContactInfo.descriptionStepTwo}</span>
                } 

                {isContactData && step === 'stepThree' && 
                    <span>{currentContactInfo.descriptionStepThree} {newContactData.valueStepTwo}</span>
                }     
                
                {/* Change password description */}

                {!isContactData && step === 'stepOne' && 
                    <span>{currentContactInfo.descriptionStepOne}</span>
                }

                 {!isContactData && step === 'stepTwo' &&
                    <span>{currentContactInfo.descriptionStepTwo} {newContactData.currentValue}</span>
                }
                
                {!isContactData && step === 'stepThree' &&
                    <span>{currentContactInfo.descriptionStepThree}</span>
                }

            </div>

            <form onSubmit={(event) => onNext(event, nextStep, currentContactInfo)} noValidate>            

                { inputType === 'password' ? (
                    <InputPassword   
                        value={value}
                        style={{width: '232px', margin: '8px auto 16px auto'}}                            
                        onChange={onManageUserData}
                    />

                ) : ( 
                    <Input
                        type={inputType}                    
                        value={value}
                        style={{width: '232px', margin: '8px auto 16px auto'}}
                        onChange={onManageUserData}
                    />
                )}

                {showForgotPassword &&
                    <div 
                        onClick={(event) => onNext(event, 'stepTwo', currentContactInfo)}
                        className={styles.forgotPassword}>
                        <span>Forgot password ?</span>
                    </div>                
                }                              

                <BlueButton type="submit" style={{width:'136px'}}>Continue</BlueButton>
            
            </form>           
 
        </div>

    );
}
 
export default DataEntryPlaceholder;