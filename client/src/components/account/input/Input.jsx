import { useState } from "react";
import styles from './Input.module.css';

import iconCloseEye from "@icons/icon-close-eye.svg";
import iconEye from "@icons/icon-eye.svg";

const Input = (props) => {

    const {type, value, style, onChange} = props;

    return ( 
        <div className={styles.inputGroup}>

            <div className={styles.inputElement} style={style}>
                <input 
                    type={type}
                    autoComplete="off" 
                    value={value}
                    onChange={(event) => onChange(event)}
                />
            </div>            
            
        </div>
    );
}

const InputPassword = (props) => {

    const {value, style, onChange} = props;
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const changeInputType = () => {
        setIsPasswordVisible((isPasswordVisible) => !isPasswordVisible)
    };

    return ( 
        <div className={styles.inputGroup}>

            <div className={styles.inputElement} style={style}>
                <input 
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete="off" 
                    value={value}
                    onChange={(event) => onChange(event)}
                />
                <div className={styles.inputElementIcon} onClick={changeInputType}>
                    {!isPasswordVisible ? (
                        <img src={iconCloseEye} className={styles.iconCloseEye} alt="" />
                    ) : (
                        <img src={iconEye} className={styles.iconEye} alt="" />    
                    )}                   
                </div>
            </div>

        </div>
     );

}
 
export { Input, InputPassword };