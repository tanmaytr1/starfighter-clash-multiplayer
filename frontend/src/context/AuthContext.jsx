import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// ============================
// Create a Context for Authentication
// ============================
// This allows us to share auth state (like user info & login status)
// across all components without passing props manually.
const AuthContext = createContext();

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
                // Send a GET request to the backend to verify session
                const res = await axios.get('http://localhost:4000/api/auth/status', { 
                    withCredentials: true // Include cookies (session info)
                });
                
                if (res.status === 200) {
                    // If backend says the user is logged in:
                    setIsAuthenticated(true); // Mark user as logged in
                    setUser(res.data.user);   // Store user info
                }
            } catch (err) {
                // If request fails (not logged in or session expired):
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                // Stop the loading spinner / state
                setLoading(false);
            }
        };

        checkAuth(); // Run the function when component mounts
    }, []); // Empty dependency array = run only once

    // ============================
    // Logout function
    // ============================
    const logout = async () => {
        try {
            // Call backend logout API (destroys session)
            await axios.get('http://localhost:4000/api/auth/logout', { withCredentials: true });
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
                logout             // logout function
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
