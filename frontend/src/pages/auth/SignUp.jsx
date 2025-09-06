import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const { username, email, password } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:4000/api/auth/register', formData);
            setMessage(res.data.message);
            navigate('/login');

        } catch (err) {
            setMessage(err.response?.data?.message || 'Something went wrong.');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={email}
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
                <button type="submit">Register</button>
            </form>
            {message && (
                <p>{message}</p>
            )}
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
};

export default Signup;
