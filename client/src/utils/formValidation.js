import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function isEmpty(value) {
    if (value === null || value === undefined) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }

    return false;
};

export function isEmailValid(email) {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return EMAIL_REGEXP.test(email);
};

export function checkContactData(userDataType, userDataValue) {

    const result = {isValid : true, reason : '', explanation: '', example: '', value: userDataValue};
    if (userDataType === 'email') {
        
        if (isEmpty(userDataValue)) {
            result.isValid = false;
            result.reason = 'E-mail is not specified';           
        } else {
            if (!isEmailValid(userDataValue)) {
                result.isValid = false;
                result.reason = 'Invalid e-mail';
            }
        }

        if (result.isValid===false) {
            result.explanation = 'Please enter the e-mail in correct format';
            result.example = 'Example: name@mail.com';
        }

    } else if (userDataType === 'phone') {

        const phone = parsePhoneNumberFromString(userDataValue);

        if (!phone || !phone.isValid()) {
            result.isValid = false;
            result.reason = 'Phone is not specified';
            result.explanation = 'Please enter the number in international format';
            result.example = 'Example: +77 (ХХХ) ХХХ-ХХ-ХХ';
        } else {
            result.value = phone.formatInternational();            
        }
    };

    return result;

}