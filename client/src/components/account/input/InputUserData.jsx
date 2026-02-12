import styles from './Input.module.css';

const Input = (props) => {

    const {isLabel, name, type, id, value, style, validationText, onChange} = props;

    return ( 
        <div className={styles.inputGroup}>
            {isLabel && 
                <label htmlFor={id}>{name}</label>
            }
            <div className={styles.inputElement} style={style}>
                <input 
                    type={type}
                    id={id}
                    placeholder={!isLabel ? name : ''} 
                    autoComplete="off" 
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                />
            </div>            

            {validationText.trim() !== "" &&
                <div className={styles.validation}><span>{validationText}</span></div>            
            }
            
        </div>
     );
}
 
export default Input;