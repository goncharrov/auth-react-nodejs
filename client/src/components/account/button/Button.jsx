import styles from './Button.module.css';

const BlueButton = ({children, type, style, onClick}) => {

    return ( 
        <button onClick={onClick} type={type} className={styles.blueButton} style={style}>{children}</button>
    );
}
 

const SaveButton = ({children, disabled, type, style, onClick}) => {

    return ( 
        <button onClick={onClick} disabled={disabled} type={type} className={styles.saveButton} style={style}>{children}</button>
    );
}

export { BlueButton, SaveButton };