import { useCsrf } from '@http/useCsrfAPI';
import { useAuth } from '@http/useAuthAPI';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL;

export function useAccount() {

    const { csrfToken, error, refreshCsrfToken, updateCsrfToken } = useCsrf();
    const { setUser } = useAuth();

    const saveUserData = async (userData) => {

        if (error) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        }
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/account/save-user-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (data.success) {
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return { success: true, user: data.user };
            } else {
                throw new Error(data.error || 'Error during saving user data');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during save user data';
            throw new Error(errorMessage);
        }

    }

    const getUserVerificationCode = async (context) => {

        if (error) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/account/get-user-verification-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(context)
            });

            const data = await response.json();

            if (data.success) {
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return data;
            } else {
                throw new Error(data.error || 'Error during writing verification code');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during writing verification code';
            throw new Error(errorMessage);            
        }

    }

    const checkUserVerificationCode = async (code) => {

        if (error) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/account/check-user-verification-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({code})
            });

            const data = await response.json();

            if (data.success) {
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return data;
            } else {
                throw new Error(data.error || 'Error during check verification code');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during check verification code';
            throw new Error(errorMessage);
        }

    }

    const checkUserContactData = async (context) => {

        if (error) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/account/check-user-contact-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(context)
            });

            const data = await response.json();

            if (data.success) {
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return data;
            } else {
                throw new Error(data.error || 'Error during check verification code');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during check verification code';
            throw new Error(errorMessage);
        }

    }

    const writeNewUserContactData = async (context) => {

        if (error) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/account/write-new-user-contact-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify(context)
            });

            const data = await response.json();

            if (data.success) {
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return data;
            } else {
                throw new Error(data.error || 'Error during writing new user contact data');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during writing new user contact data';
            throw new Error(errorMessage);            
        }

    }

    const checkUserPassword = async (password) => {

        if (error) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {

            const response = await fetch(`${API_URL}/api/account/check-user-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({password})
            });

            const data = await response.json();

            if (data.success) {
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return data;
            } else {
                throw new Error(data.error || 'Error during writing new user contact data');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during writing new user contact data';
            throw new Error(errorMessage);
        }

    }

    const writeNewUserPassword = async (password) => {

        if (error) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/account/write-new-user-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({password})
            });

            const data = await response.json();

            if (data.success) {
                // Update the CSRF token from the response, if there is one.
                if (data.csrfToken) {
                    updateCsrfToken(data.csrfToken);
                } else {
                    await refreshCsrfToken();
                }
                return data;
            } else {
                throw new Error(data.error || 'Error during writing new user password');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Error during writing new user password';
            throw new Error(errorMessage);     
        }

    }

    const deleteUserAccount = async (password) => {

        if (error) {
            throw new Error(`Error loading CSRF token: ${csrfError.message}`);
        };
        if (!csrfToken) {
            throw new Error('CSRF token not loaded');
        };

        try {
            const response = await fetch(`${API_URL}/api/account/delete-user-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                },
                credentials: 'include',
                body: JSON.stringify({password})
            });

            const data = await response.json();

            if (data.success) {
                setUser(null);
                await refreshCsrfToken();
                return data;
            } else {
                throw new Error(data.error || 'Error during deleting user account');
            }

        } catch (err) {
            console.error('Error during deleting user account:', err);
        }

    }
 
    return { 
        saveUserData, 
        getUserVerificationCode, 
        checkUserVerificationCode,
        checkUserContactData,
        writeNewUserContactData,
        checkUserPassword,
        writeNewUserPassword,
        deleteUserAccount
    };

}