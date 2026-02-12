import { Fragment, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@http/useAuthAPI';

import "../../main.css";
import styles from "./Auth.module.css";

import LoadingPage from "@pages/LoadingPage";

import LoginForm from "@components/auth/LoginForm";
import PassForm from "@components/auth/PassForm";
import CodeForm from "@components/auth/CodeForm";
import Footer from "@components/auth/footer/Footer";

const Auth = () => {      

    const [currentForm, setCurrentForm] = useState('LoginForm');
    const [formHistory, setFormHistory] = useState([]);

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Timer to receive code
    const [timerActive, setTimerActive] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    const { 
        loginWithPassword, 
        loginWithCode, 
        checkEmail, 
        sendNewEmailCode, 
        isAuthenticated,
        loading: authLoading } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && isAuthenticated === true) {
            navigate("/");
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (!timerActive || secondsLeft <= 0) return;

        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timerActive, secondsLeft]);

    const handleStartTimer = () => {        
        setSecondsLeft(59);
        setTimerActive(true);        
    };

    const handleRestart = async () => {

        setError("");

        if (email.trim() === "") {
            setError("Enter the e-mail address");
            return;
        };
       
        try {
            const result = await sendNewEmailCode(email.trim());
            if (result.codeIsWritten) {
                setSecondsLeft(59);
            } else {
                setError("Error sending code. Login with email.");
            }
        } catch {
            setError("Error sending code. Login with email.")
        }
        
    };

    // Form manage    
    const goToForm = async (event, nameForm) => {
        event.preventDefault();
        setFormHistory([...formHistory, currentForm]);
        setCurrentForm(nameForm);        
    };

    const goBack = () => {
        if (formHistory.length > 0) {            
            
            setError('');
            
            if (currentForm == 'PassForm') {
                setPassword("");
            } else if (currentForm == 'CodeForm') {
                setCode("");
                setTimerActive(false);
                setSecondsLeft(0);
            };
            
            const lastForm = formHistory[formHistory.length - 1];
            const newHistory = formHistory.slice(0, -1); 
            setFormHistory(newHistory);
            setCurrentForm(lastForm); 
                                  
        }
    };

    // Email manage
    const handleEmailChange = (event) => {

        const { value } = event.target;

        setEmail(value);

        if (value.trim() !== "") {
            setError("");    
        }

    };

    const handleEmailSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (email.trim() === "") {
            setError("Enter the e-mail address");
            return;
        };

        setLoading(true);
        try {
            const result = await checkEmail(email.trim());
            if (result.exists) {
                setFormHistory([...formHistory, currentForm]);
                if (result.loginWithCode) {
                    handleStartTimer();
                    setCurrentForm('CodeForm');
                } else {
                    setCurrentForm('PassForm');    
                }
            } else {
                setError("User with this email not found");
            }
        } catch (err) {
            console.log(err.message);
        } finally {
            setLoading(false);
        };        
        
    };

     // Code manage
    const handleCodeChange = (event) => {

        const { value } = event.target; 

        setCode(value);

        if (value.trim() !== "") {
            setError("");    
        }

    };

    const handleCodeSubmit = async (event) => {
        event.preventDefault();
        
        setError("");

        if (code.trim() === "") {
            setError("Enter code from e-mail");
            return;
        }
        
        setLoading(true);
        try {
            const result = await loginWithCode(email.trim(), code.trim());
            if (result.success) {
                setTimerActive(false);
                setSecondsLeft(0);
                navigate('/');
            }
        } catch (err) {
            setError(err.message);  
        } finally {
            setLoading(false);
        }

    }

    // Password manage
    const handlePasswordChange = (event) => {

        const { value } = event.target;
        
        setPassword(value);

        if (value.trim() !== "") {
            setError("");    
        }

    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (password.trim() === "") {
            setError("Enter password");
            return;
        }

        setLoading(true);
        try {
            const result = await loginWithPassword(email.trim(), password);
            if (result.success) {
                setTimerActive(false);
                setSecondsLeft(0);
                navigate('/');
            }
        } catch (err) {
            setError("The password you entered is incorrect");  
        } finally {
            setLoading(false);
        }
    }

    if (authLoading || isAuthenticated === undefined) {
        return (
            <LoadingPage />
        );
    }

    return (
        <Fragment>
            
            <div className={styles.container}>
                
                {currentForm == 'LoginForm' && 
                    <LoginForm 
                        onNext={(event) => handleEmailSubmit(event)} 
                        email={email}
                        onEmailChange={handleEmailChange}
                        validationText={error}
                        loading={loading}   
                    />
                }
                
                {currentForm == 'CodeForm' && 
                    <CodeForm
                        onBack={goBack}
                        onNext={(event) => goToForm(event,'PassForm')}
                        email={email}
                        code={code}
                        onCodeChange={handleCodeChange}
                        onCodeSubmit={handleCodeSubmit}
                        validationText={error}
                        timerActive={timerActive}
                        secondsLeft={secondsLeft} 
                        onRestart={handleRestart} 
                    />
                }
                
                {currentForm == 'PassForm' && 
                    <PassForm 
                        onBack={goBack} 
                        email={email}
                        password={password}
                        onPasswordChange={handlePasswordChange}
                        onPasswordSubmit={handlePasswordSubmit}
                        validationText={error}
                        loading={loading}
                    />
                }

            </div>

            <Footer />

        </Fragment>
    );
};

export default Auth;
