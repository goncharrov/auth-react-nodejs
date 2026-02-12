import { useRef, useEffect } from 'react';

import styles from './PassForm.module.css';

import InputPassword from "@components/auth/input/InputPassword";
import { ButtonBlue } from '@components/auth/button/Button';

import iconLogo from '@icons/logo-dark.svg';
import iconArrow16 from "@icons/icon-arrow-16.svg";

const PassForm = ({
    onBack, 
    email, 
    password, 
    onPasswordChange, 
    onPasswordSubmit, 
    validationText, 
    loading}) => {
    
    const passFormRef = useRef(null);
    
    useEffect(() => {
        if (passFormRef.current) {
            passFormRef.current.style.top = `${(window.innerHeight - 48 - 344) / 2}px`;
        }
    }, []);  

    return ( 
        <div className={styles.passForm} ref={passFormRef}> 

            <div className={styles.passLogo}>
                <div onClick={onBack} style={{ cursor: 'pointer' }} >
                    <img className={styles.arrowImg} src={iconArrow16} alt="" />
                </div>
                <div>
                    <a href="/"><img src={iconLogo} alt="Account" style={{width: "104px"}} /></a>
                </div>
                <div style={{width: "32px"}}></div>                
            </div>

            <div className={styles.passTitle}>
                <div className={styles.passTitle1}><span>Enter password to sign in to</span></div>                
                <div className={styles.passTitle2}><span>{email}</span></div>
            </div>

            <div className={styles.elements}>

                <form data-csrf="{{csrf}}" noValidate>                   
                    <InputPassword 
                        isLabel={false}
                        id="id-password" 
                        value={password}
                        validationText={validationText}
                        onChange={onPasswordChange}
                    />
                    <ButtonBlue 
                        type="submit"
                        loading={loading}
                        onClick={onPasswordSubmit}
                        >
                        Continue
                    </ButtonBlue>                
                </form>
                
            </div>           
                        
        </div>
     );
}
 
export default PassForm;