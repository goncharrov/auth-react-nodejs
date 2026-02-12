import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from "@components/auth/input/Input";
import InputPassword from "@components/auth/input/InputPassword";

import { useAuth } from '@http/useAuthAPI';

import styles from './RegForm.module.css';
import iconLogo from '@icons/logo-dark.svg';

import { isEmailValid } from "@utils/formValidation";

const RegForm = () => {   

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { registration } = useAuth();

    //

    const navigate = useNavigate();
    
    const handleClickSignIn = () => {
        navigate('/auth/');
    };

    //

    const validateField = (name, value) => {

        const newErrors = { ...errors };
        let isValid = false; 

        if (name === "firstName" || name === "lastName") {
            if (value.trim() !== "") {
               isValid = true;
            }
        } else if (name === "email") {
            if (isEmailValid(value.trim())) {
                isValid = true;
            }
        } else if (name === "password") {
            if (value.trim().length >= 8) {
                isValid = true;                
            }
        };
        if (isValid) {
            delete newErrors[name];
            setErrors(newErrors);
        };

    }; 

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.trim()
        }));
        validateField(name, value);
    };

    const validateFormData = () => {

        const newErrors = {};

        if (formData.firstName.trim() === "") {
            newErrors.firstName = "Enter your first name"; 
        }
        if (formData.lastName.trim() === "") {
            newErrors.lastName = "Enter your last name";
        }
        if (formData.email.trim() == "") {
            newErrors.email = "Enter the e-mail address";  
        } else {
            if (!isEmailValid(formData.email.trim())) {
                newErrors.email = "The e-mail is incorrect";
            }
        }
        if (formData.password.trim().length < 8 ) {
            newErrors.password = "Must contain at least 8 characters";
        }
       
        setErrors(newErrors);
        
        return Object.keys(newErrors).length === 0;

    }

    const handleRegSubmit = async (event) => {
        event.preventDefault();

        validateFormData();

        if (!validateFormData()) {
            return;
        };

        setLoading(true);
        try {
            await registration(formData);
            navigate("/");
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <div className={styles.registrationForm} >

            <div className={styles.logo}>
                <a href="/"><img src={iconLogo} alt="Account" style={{width: '104px'}}/></a>
            </div>
            <p className={styles.title}>Create account</p>

            <form onSubmit={handleRegSubmit} noValidate>

                <div className={styles.doubleInputGroup}>

                    <div className={styles.doubleInputElement}>
                        <Input 
                            label="First name" 
                            name="firstName" 
                            type="text" 
                            id="id-first-name"
                            value={formData.firstName}
                            validationText={errors.firstName ? errors.firstName : ''}
                            onChange={handleChange}
                        />
                    </div>
                
                    <div className={styles.doubleInputElement}>
                        <Input 
                            label="Last name"
                            name="lastName" 
                            type="text"
                            id="id-last-name"
                            value={formData.lastName} 
                            validationText={errors.lastName ? errors.lastName : ''}
                            onChange={handleChange}
                        />
                    </div>

                </div>

                <Input 
                    label="E-mail" 
                    name="email" 
                    type="email"
                    id="id-email"
                    value={formData.email} 
                    validationText={errors.email ? errors.email : ''}
                    onChange={handleChange}
                />
                <InputPassword 
                    label="Password"
                    id="id-password"
                    name="password"
                    value={formData.password}
                    validationText={errors.password ? errors.password : ''}
                    onChange={handleChange}
                />

                <button 
                    className={styles.buttonRegistration} 
                    type="submit"
                    disabled={loading}
                    >
                    Continue
                </button>
            
            </form>            
            
            <p style={{fontSize: '18px'}}>or</p>
            
            <div className={styles.thereIsAccount}>
                <span style={{textAlign: 'left'}}>Already have an account? </span>
                <div className={styles.switchToSignForm} onClick={handleClickSignIn}>Sign in</div>
            </div>            
        
        </div>
     );
}
 
export default RegForm;