import { useState, useEffect } from 'react';
import { useCsrf } from '@http/useCsrfAPI';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL;

export function useAuth() {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const { 
        csrfToken, 
        loading: csrfLoading, 
        error: csrfError, 
        refreshCsrfToken, updateCsrfToken } = useCsrf();   

    // Getting current user
    useEffect(() => {

        if (csrfLoading) {
            return;
        }

        const fetchUser = async () => {
            try {
                setUserLoading(true);
                const response = await fetch(`${API_URL}/api/auth/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }

            } catch (err) {
                console.error('Error fetching user:', err);
                setUser(null);
            } finally {
                setUserLoading(false);
                setIsInitialized(true);
            }
        };

        fetchUser();
    }, [csrfLoading]);

    const loginWithPassword = async (email, password) => {

        if (csrfError) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };

        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/login-with-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({email, password})
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return { success: true, user: data.user };
            } else {           
                throw new Error(data.error || 'Error during login');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during login';
            throw new Error(errorMessage);
        };
        
    };

    const loginWithCode = async (email, code) => {

        if (csrfError) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };

        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/login-with-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({ email, code })
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);                
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return { success: true, user: data.user };
            } else {           
                throw new Error(data.error || 'Error during login');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during login';
            throw new Error(errorMessage);
        }

    }    

    const registration = async (formData) => {
        
        if (csrfError) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return { success: true, user: data.user };
            } else {
                throw new Error(data.error || 'Error during registration');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during registration';
            throw new Error(errorMessage);
        }

    };

    const checkEmail = async (email) => {

        if (csrfError) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };

        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                }
                return data;
            } else {
                throw new Error(data.error || 'Error during email checking');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during email checking';
            throw new Error(errorMessage);
        }

    };

    const sendNewEmailCode = async (email) => {

        if (csrfError) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/send-new-login-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

             if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (data.csrfToken) {
                updateCsrfToken(data.csrfToken);
            };

            return data;

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error sending code. Login with email';
            throw new Error(errorMessage);
        }

    }

    const logout = async () => {

        if (csrfError) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };

        if (!csrfToken) {
            setUser(null);
            return;
        }

        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include'
            });
        } catch (err) {
            console.error('Error during logout:', err);
        } finally {
            setUser(null);
            await refreshCsrfToken();
        }
    }

    const isAuthenticated = isInitialized ? !!user : undefined;

    const loading = csrfLoading || userLoading;

    return {
        user,
        setUser,
        isAuthenticated,
        loading,
        loginWithPassword,
        loginWithCode,
        registration, 
        checkEmail,
        sendNewEmailCode,
        logout         
    };

}