import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

const StarScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading, logout } = useAuth(); // Make sure to destructure 'loading' too

  // This useEffect hook will log the authentication status
  useEffect(() => {
    console.log("Authentication status:", isAuthenticated);
    console.log("User data:", user);
    console.log("Loading status:", loading);
  }, [isAuthenticated, user, loading]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20%' }}>
      <h1>STARFIGHTER CLASH</h1>
      {loading ? (
        // Show a loading message while the authentication status is being checked
        <p>Loading...</p>
      ) : isAuthenticated ? (
        // Content for Authenticated Users
        <>
          <p>Welcome back, {user?.username || 'user'}!</p>
          <Link to="/dashboard">Click here to start</Link>
          <div style={{ marginTop: '20px' }}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : (
        // Content for Unauthenticated Users (Guests)
        <>
          <p>Ready to play?</p>
          <Link to="/login">Click here to start</Link> {/* Redirect to login for guests */}
          <div style={{ marginTop: '20px' }}>
            <Link to="/login">Login</Link> | <Link to="/signup">Register</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default StarScreen;