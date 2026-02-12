import { Fragment, useState, useEffect, useRef } from "react";

import styles from './SelectorDate.module.css';

// import useClickOutside from '@hooks/useClickOutside';

import SelectorDateItem from '@components/account/selector-date/SelectorDateItem';

import { months } from '@data/userData';

function getListDaysInMonth(date) {

    if (!date) {
        date = new Date();        
    }

    const month = date.getMonth();
    const year = date.getFullYear();
    const days = new Date(year, month + 1, 0).getDate();

    const list = [];
    for (let i = 1; i <= days; i++) {
        list.push({ label: String(i), id: i });
    };
    return list;   
 
}

function getListYears() {
    
    const lastYear = new Date().getFullYear() - 16;
    const list = [];

    for (let i = lastYear; i >= 1901; i--) {
        list.push({ label: String(i), id: i });
    }
    return list;
}

const SelectorDate = ({ label, dateValue, onDateChange }) => {
 
    const [day, setDay] = useState(null);
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);

    const [options, setOptions] = useState({days: [], months: [], years: []})

    const [isNewDate, setIsNewDate] = useState(false);

    useEffect(() => {

        let date = null;
        if (dateValue === null) {
            date = new Date();
        } else {
            date = new Date(dateValue);
        };

        if (isNaN(date.getTime())) {
            return;
        }

        if ((dateValue !== null)) {
            setDay(date.getDate());
            setMonth(months.find(item => item.id === date.getMonth()).id);
            setYear(date.getFullYear());
        };        

        setOptions({
            days: getListDaysInMonth(date),
            months: months,
            years: getListYears()

        });

    }, [dateValue] );

    useEffect(() => {

        if (year === null || month === null || day === null) {
            return;
        };
        
        if (isNewDate) {
            const newDate = new Date(year, month, day);              
            if (!isNaN(newDate.getTime())) {
                onDateChange(newDate);
                setIsNewDate(false);
            };
        };               

    },[ day, month, year ]);

    const checkDay = (checkedMonth, checkedYear) => {

        // Setting the number of days in a month
        const checkedDate = new Date(checkedYear, checkedMonth, 1);
        const daysList = getListDaysInMonth(checkedDate);   

        if (!day) {
            setOptions(prevData => ({
                ...prevData,
                days: daysList
            }));
            return;
        };

        // Checking the selected day

        const isDay = daysList.find(item => item.id === day);

        if (!isDay) {
            setDay(null);
            setOptions(prevData => ({
                ...prevData,
                days: daysList
            }));
        } else {
            setOptions(prevData => ({
                ...prevData,
                days: daysList
            }));
        };

    }

    const handleSelectorChange = (value, name) => {

        if (name === 'day') {
            setDay(options.days.find(item => item.id === value.id).id);
        } else if (name === 'month') {
            setMonth(options.months.find(item => item.id === value.id).id);
            if (value.id >=0 && year > 0) {
                checkDay(value.id, year);
            };
        } else if (name === 'year') {
            setYear(options.years.find(item => item.id === value.id).id);
            if (month >=0 && value.id > 0) {
                checkDay(month, value.id);
            }; 
        }; 
        
        setIsNewDate(true);
        
    }

    return (
        <Fragment>
            <div className={styles.selectorLabel}>{label}</div>                                    
            <div className={styles.dateOfBirth}>

                <SelectorDateItem 
                    itemStyle={styles.birthDate}
                    value={day}
                    options={options.days}
                    onChange={(value) =>
                        handleSelectorChange(value, "day")
                    }
                />
                <SelectorDateItem 
                    itemStyle={styles.birthMonth}
                    value={month}
                    options={options.months}
                    onChange={(value) =>
                        handleSelectorChange(value, "month")
                    }
                />
                <SelectorDateItem 
                    itemStyle={styles.birthYear}
                    value={year}
                    options={options.years}
                    onChange={(value) =>
                        handleSelectorChange(value, "year")
                    } 
                />               

            </div>

        </Fragment>
     );
}
 
export default SelectorDate;