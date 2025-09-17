import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// ============================
// Create a Context for Authentication
// ============================
// This allows us to share auth state (like user info & login status)
// across all components without passing props manually.
export const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    loading: true,
    // Provide empty functions to avoid crashes
    setIsAuthenticated: () => { },
    setUser: () => { },
    logout: () => { }
});


// ============================
// Create a Provider Component
// ============================
// This component will wrap your app and provide auth info to children.
export const AuthProvider = ({ children }) => {
    // Track whether the user is logged in
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Store the logged-in user's information
    const [user, setUser] = useState(null);
    // Track loading state while checking auth status
    const [loading, setLoading] = useState(true);

    // ============================
    // Check if the user is already logged in on component mount
    // ============================
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('http://localhost:4000/api/auth/status', {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setIsAuthenticated(true);
                    setUser(res.data.user);
                }
            } catch (err) {
                if (err.response?.status === 401) {
                    // User not logged in → not an actual error, just set state
                    setIsAuthenticated(false);
                    setUser(null);
                } else {
                    // Only log unexpected errors
                    console.error('Unexpected auth check error:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);


    // ============================
    // Logout function
    // ============================
    const logout = async () => {
        try {
            // Call backend logout API (destroys session)
            await axios.post('http://localhost:4000/api/auth/logout', {}, { withCredentials: true });
            // Clear frontend auth state
            setIsAuthenticated(false);
            setUser(null);
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    // ============================
    // Provide auth info and functions to all child components
    // ============================
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated, // true/false
                user,            // user info object
                loading,         // loading state
                setIsAuthenticated, // function to manually update login status
                setUser,            // function to manually update user info
                logout              // logout function
            }}
        >
            {children} {/* Render all child components */}
        </AuthContext.Provider>
    );
};

// ============================
// Custom Hook to use AuthContext
// ============================
// Makes it easier to access auth state in any component
export const useAuth = () => {
    return useContext(AuthContext);
};