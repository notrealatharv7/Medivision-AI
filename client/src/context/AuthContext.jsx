import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || '/api';
    axios.defaults.baseURL = API_URL;

    useEffect(() => {
        if (!auth) {
            console.error("Firebase Auth is not initialized. Registration and login will not work.");
            setLoading(false);
            return;
        }

        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Get a fresh ID token
                    const idToken = await firebaseUser.getIdToken();
                    axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

                    // Exchange Firebase token for user profile from our backend
                    const res = await axios.post('/auth/firebase', { id_token: idToken });
                    setUser(res.data);
                } catch (error) {
                    console.error('Auth state check failed:', error);
                    setUser(null);
                    delete axios.defaults.headers.common['Authorization'];
                }
            } else {
                setUser(null);
                delete axios.defaults.headers.common['Authorization'];
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        if (!auth || !googleProvider) {
            return { success: false, error: "Authentication system is not configured. Please check your environment variables." };
        }
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

            // Register/login user in our backend
            const res = await axios.post('/auth/firebase', { id_token: idToken });
            setUser(res.data);
            return { success: true };
        } catch (error) {
            console.error('Google Sign-In error:', error);
            let errorMessage = 'Google Sign-In failed. Please try again.';
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Sign-in popup was closed. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup was blocked by the browser. Please allow popups for this site.';
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            }
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        signInWithGoogle,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
