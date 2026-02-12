import { useRef, useEffect } from 'react';

import styles from "./CodeForm.module.css";

import { ButtonWhite, ButtonBlue } from '@components/auth/button/Button';
import Input from '@components/auth/input/Input';
import TimeCounter from '@components/auth/utils/TimeCounter';

import iconLogo from '@icons/logo-dark.svg';
import iconArrow16 from "@icons/icon-arrow-16.svg";

const codeForm = ({ onBack, onNext, email, code, onCodeChange, onCodeSubmit, validationText,
    timerActive, secondsLeft, onRestart }) => {

    const codeFormRef = useRef(null);

    useEffect(() => {
        if (codeFormRef.current) {
            codeFormRef.current.style.top = `${(window.innerHeight - 48 - 344) / 2}px`;
        }
    }, []);

    return ( 
        <div className={styles.codeForm} ref={codeFormRef}> 

            <div className={styles.codeLogo}>
                <div onClick={onBack} style={{ cursor: 'pointer' }}>
                    <img className={styles.arrowImg} src={iconArrow16} alt="" />
                </div>
                <div>
                    <a href="/"><img src={iconLogo} alt="Account" style={{width: "104px"}} /></a>
                </div>
                <div style={{width: "32px"}}></div>                
            </div>

            <div className={styles.codeTitle}>
                <div className={styles.codeTitle1}><span>Enter code from the message</span></div>                
                <div className={styles.codeTitle2}><span>Sent to {email}</span></div>
            </div>

            <div className={styles.elements}>
                <form data-csrf="{{csrf}}" noValidate>                   
                    <Input
                        isLabel={false}                         
                        name="Enter code" 
                        type="text"
                        id="id-code"
                        value={code}
                        validationText={validationText}
                        onChange={onCodeChange}
                    />

                    {timerActive && (
                        <TimeCounter secondsLeft={secondsLeft} onRestart={onRestart} />
                    )}                     
                    
                    <ButtonBlue type="submit" onClick={onCodeSubmit}>Continue</ButtonBlue> 
                </form>
                <p style={{fontSize: "18px"}}>or</p>        
                <ButtonWhite type="button" onClick={onNext}>Log in with your password</ButtonWhite>
            </div>           
                        
        </div>
     );
}
 
export default codeForm;