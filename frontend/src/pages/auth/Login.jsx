import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    // State to hold the form input data
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    // State to display a message to the user (e.g., success or error)
    const [message, setMessage] = useState('');
    // Hook to programmatically navigate to different routes
    const navigate = useNavigate();

    // Destructure formData for easier access
    const { username, password } = formData;

    // Handle input changes and update the state
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a POST request to the backend's login endpoint
            // withCredentials: true is crucial for sending the session cookie
            const res = await axios.post('http://localhost:4000/api/auth/login', formData, { withCredentials: true });
            setMessage(res.data.message);
            // Redirect the user to the dashboard upon successful login
            navigate('/starscreen'); 
        } catch (err) {
            // Display the error message from the backend if the request fails
            setMessage(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username or Email"
                    value={username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Log In</button>
            </form>
            {message && (
                <p>{message}</p>
            )}
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
