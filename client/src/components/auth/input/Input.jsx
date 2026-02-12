import styles from './Input.module.css';

const Input = ({label, name, type, id, value, validationText, onChange}) => {

    return ( 
        <div className={styles.inputGroup}>
            {label && 
                <label htmlFor={id}>{label}</label>
            }
            <div className={styles.inputElement}>
                <input 
                    type={type}
                    id={id}
                    name={name}
                    placeholder={!label ? label : ''} 
                    autoComplete="off" 
                    value={value}
                    onChange={(event) => onChange(event)}
                />
            </div>            
            {validationText.trim() !== "" &&
                <div className={styles.validation}><span>{validationText}</span></div>            
            }
            
        </div>
     );
}
 
export default Input;