import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import OtpModal from "../../components/OtpModal";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const navigate = useNavigate();
  const [emailForOtp, setEmailForOtp] = useState("");

  const { username, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", formData);
      setMessage(res.data.message);
      
      // On successful registration, show the OTP modal
      setEmailForOtp(email);
      setShowOtpModal(true);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
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
      {message && <p>{message}</p>}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

      {/* Conditional rendering of the OTP modal */}
      {showOtpModal && (
        <OtpModal
          email={emailForOtp}
          onVerified={() => {
            setShowOtpModal(false);
            navigate("/dashboard"); // Redirect after successful verification
          }}
        />
      )}
    </div>
  );
};

export default Signup;