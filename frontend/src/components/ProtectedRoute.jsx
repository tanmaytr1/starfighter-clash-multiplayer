import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Path to your AuthContext

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Show a loading indicator while the auth status is being checked
    if (loading) {
        return <div>Loading...</div>; // Or a more sophisticated spinner
    }

    // If the user is authenticated, render the children (the component)
    if (isAuthenticated) {
        return children;
    }

    // If not authenticated, redirect them to the login page
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;