import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios base URL
    axios.defaults.baseURL = '/api';

    useEffect(() => {
        // Check if user is logged in (verify token)
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Add token to headers
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    // Ideally call /users/me here to validate and get user details
                    const res = await axios.get('/users/me');
                    setUser(res.data);
                } catch (error) {
                    console.error("Auth check failed", error);
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('/auth/login', { email, password });
            const { access_token } = res.data;
            localStorage.setItem('token', access_token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            // Fetch user data
            const userRes = await axios.get('/users/me');
            setUser(userRes.data);
            return { success: true };
        } catch (error) {
            let errorMessage = 'Login failed';
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                errorMessage = typeof detail === 'string' ? detail : JSON.stringify(detail);
            }
            return { success: false, error: errorMessage };
        }
    };

    const signup = async (name, email, password) => {
        try {
            await axios.post('/auth/signup', { name, email, password });
            // Auto login after signup
            return await login(email, password);
        } catch (error) {
            let errorMessage = 'Signup failed';
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                errorMessage = typeof detail === 'string' ? detail : JSON.stringify(detail);
            }
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
