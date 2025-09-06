import React, { useState } from "react";
import axios from "axios";

const OtpModal = ({ email, onVerified }) => {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");

    const handleVerify = async () => {
        try {
            // Call the new verification endpoint
            const res = await axios.post("http://localhost:4000/api/auth/verify-and-create-user", { email, otp });
            setMessage(res.data.message);
            
            // Redirect after successful verification
            onVerified();
        } catch (err) {
            setMessage(err.response?.data?.message || "Verification failed");
        }
    };

    return (
        <div className="otp-modal">
            <h3>Enter OTP</h3>
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
            />
            <button onClick={handleVerify}>Verify</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default OtpModal;