import { useState, useRef } from 'react';
import styles from './SelectorDate.module.css';
import iconArrow from '@icons/icon-arrow-16.svg';

import useClickOutside from '@hooks/useClickOutside';

const SelectorDateItem = ({ itemStyle, value, options, onChange }) => {

    const [isOpen, setIsOpen] = useState(false);
    const selected = options.find((option) => option.id === value);
    const selectedLabel = selected ? selected.label : '';

    const selectorRef = useRef(null);

    useClickOutside(selectorRef, () => {
        if (isOpen) {
            toggleOpen();
        }
    });
    
    function toggleOpen() {
        setIsOpen((prev) => !prev);
    }

    function handleSelect(item) {
        onChange(item)
        setIsOpen(false);
    }
    
    return (
        
         <div
            ref={selectorRef} 
            className={ isOpen & options.length > 0 ? ( 
                `${styles.selectorGroup} ${itemStyle} ${styles.open}` 
                ) : ( 
                `${styles.selectorGroup} ${itemStyle}` )
            }>                                        
            <div className={styles.selectorField} data-type="selector" onClick={toggleOpen}>
                <span className={styles.selectorData} data-type="selector">{selectedLabel}</span>
                <img src={iconArrow} className={styles.selectorArrow} data-type="selector" alt="" />
            </div>

            {isOpen && options.length > 0 &&
                <ul className={styles.selectorMenu}>
                    {options.map((option) => (
                        <li 
                            key={option.id} 
                            onClick={() => handleSelect(option)}
                            >
                            {option.label}
                        </li>
                    ))                
                    }
                </ul>
            }

        </div>

    );
}
 

export default SelectorDateItem;