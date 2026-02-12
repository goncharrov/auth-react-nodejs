import { useState, useEffect } from 'react';

// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.PROD ? '' : import.meta.env.VITE_API_URL;

export function useCsrf() {

    const [csrfToken, setCsrfToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getCsrfToken = async() => {
        
        try {

            setLoading(true);
            setError(null);

            const response = await fetch(`${API_URL}/api/csrf-token`, {
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

            if (data.success && data.csrfToken) {
                setCsrfToken(data.csrfToken);
            }

        } catch (err) {
            console.error('Error fetching CSRF token:', err);
            setError(err);
        } finally {
            setLoading(false);
        }

    }

    // Getting CSRF token
    useEffect(() => {
        const fetchCsrfToken = async () => {
            await getCsrfToken()    
        };
        fetchCsrfToken();
    }, []);

    // Refreshing the CSRF token after operations
    const refreshCsrfToken = async () => {
        await getCsrfToken();
    };

    // Refreshing the token from the server response
    const updateCsrfToken = (token) => {
        if (token) {
            setCsrfToken(token);
            setError(null);
        }
    }; 

    return { csrfToken, loading, error, refreshCsrfToken, updateCsrfToken };

}