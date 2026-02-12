import { Fragment, useState, useEffect } from 'react';

import { useAccount } from '@http/useAccountAPI';

import { genders } from "@data/userData";

import styles from './UserData.module.css';

import Input  from '@components/account/input/InputUserData.jsx';
import Selector from '@components/account/selector/Selector';
import SelectorDate from '@components/account/selector-date/SelectorDate';
import { SaveButton } from "@components/account/button/Button";

const UserData = ({ user, setUser }) => {

    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        preferredName: '',
        gender: null,
        birthday: null
    });

    const [errors, setErrors] = useState({});

    const { saveUserData } = useAccount();

    useEffect(() => {

        let userBirthday = null;

        if (user && user?.birthday) {
            userBirthday = new Date(user.birthday);
        }

        setFormData({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            preferredName: user?.preferredName || '',
            gender: genders.find(item => item.label === user?.gender),
            birthday: userBirthday
        });

    }, [user])

    // validation

    const validateField = (name, value) => {

        const newErrors = { ...errors };
        let isValid = false; 

        if (name === "firstName" || name === "lastName") {
            if (value.trim() !== "") {
               isValid = true;
            }
        };

        if (isValid) {
            delete newErrors[name];
            setErrors(newErrors);
        };

    }; 

    const validateFormData = () => {

        const newErrors = {};

        if (formData.firstName.trim() === "") {
            newErrors.firstName = "Enter your first name"; 
        }
        if (formData.lastName.trim() === "") {
            newErrors.lastName = "Enter your last name";
        }

        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;

    }

    // handles

    const handleInputChange = (value, name) => {
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    }

    const handleSelectorChange = (value, name) => {
        if (name === 'gender') {
            setFormData(prevData => ({
                ...prevData,
                gender: {id: value.id, label: value.label }
            }))
        }        
    }

    const handleSelectorDateChange = (newDate) => {
        setFormData(prevData => ({
            ...prevData,
            birthday: newDate
        }))
    }

    // Save user data

    const handleUserDataSubmit = async (event) => {
        event.preventDefault();

        if (!validateFormData()) {
            return;
        };

        const context = { ...formData };
        if (!isNaN(context.birthday.getTime())) {
            context.birthday = context.birthday.toISOString();
        };
       
        setIsSaving(true);
        try {
            const result = await saveUserData(context);
            if (result.success) {
                
                setFormData(prevData => ({
                    ...prevData,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    preferredName: result.user.preferredName
                }));

                setUser(prevData => ({
                    ...prevData,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                    preferredName: result.user.preferredName,
                    gender: result.user.gender,
                    birthday: result.user.birthday
                }));

            } 
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsSaving(false);
        }
        
    }

    return (
        <Fragment>
            <form noValidate>
                <div className={styles.userDataItems}>
                    <div className={styles.userDataItem}>
                        <Input
                            isLabel={true}
                            name="First name"
                            type="text"
                            id="id-first-name"
                            value={formData.firstName}
                            style={null}
                            validationText={errors.firstName ? errors.firstName : ''}
                            onChange={(event) =>
                                handleInputChange(event, "firstName")
                            }
                        />
                    </div>

                    <div className={styles.userDataItem}>
                        <Input
                            isLabel={true}
                            name="Last name"
                            type="text"
                            id="id-last-name"
                            value={formData.lastName}
                            style={null}
                            validationText={errors.lastName ? errors.lastName : ''}
                            onChange={(event) =>
                                handleInputChange(event, "lastName")
                            }
                        />
                    </div>

                    <div className={styles.userDataItem}>
                        <Input
                            isLabel={true}
                            name="Preferred name"
                            type="text"
                            id="id-preferred-name"
                            value={formData.preferredName}
                            style={null}
                            validationText=""
                            onChange={(event) =>
                                handleInputChange(event, "preferredName")
                            }
                        />
                    </div>

                    <div className={styles.userDataItem}>
                        <SelectorDate 
                            label="Date of birth"
                            dateValue={formData.birthday}
                            onDateChange={(newDate) => handleSelectorDateChange(newDate)}
                        />
                    </div>

                    <div className={styles.userDataItem}>
                        <Selector
                            label="Gender"
                            options={genders}
                            value={formData.gender?.id}
                            onChange={(value) =>
                                handleSelectorChange(value, "gender")
                            }
                        />
                    </div>
                </div>

                <div className={styles.userDataButtonSubmit}>
                    <SaveButton
                        disabled={isSaving} 
                        type="submit" 
                        style={{ width: "136px" }} 
                        onClick={handleUserDataSubmit}
                        >
                        Save
                    </SaveButton>
                </div>
            </form>
        </Fragment>
    );
}
 
export default UserData;