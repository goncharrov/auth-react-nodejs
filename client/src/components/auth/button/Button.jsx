import styles from './Button.module.css';

const ButtonWhite = ({children, onClick, type}) => {
    return ( 
        <button onClick={onClick} className={`${styles.button} ${styles.buttonWhite}`} type={type}>{children}</button>    
    );
}

const ButtonBlue = ({children, type, disabled, onClick }) => {
   
    return ( 
        <button 
            onClick={onClick}
            disabled={disabled} 
            className={`${styles.button} ${styles.buttonBlue}`} 
            type={type}
            >
            {children}
        </button>   
    );
}

export {ButtonWhite, ButtonBlue}
