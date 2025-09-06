const User = require('../models/User');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");

const tempUsers = new Map();

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = Date.now() + 5 * 60 * 1000;

        // Temporarily store user data with OTP. DO NOT save to database yet.
        tempUsers.set(email, {
            username,
            password,
            otp,
            otpExpiresAt,
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Email",
            text: `Your OTP is ${otp}. It expires in 5 minutes.`
        });

        res.status(200).json({ message: "OTP sent! Check your email to verify." });

    } catch (error) {
        console.error("Registration error:", error);
        tempUsers.delete(email); 
        res.status(500).json({ message: "Server error. Could not send verification email." });
    }
};

exports.verifyAndCreateUser = async (req, res) => {
    const { email, otp } = req.body; // email is available here from the request body
    try {
        const tempUserData = tempUsers.get(email);
        
        if (!tempUserData) {
            return res.status(400).json({ message: "Session expired or user not found. Please register again." });
        }
        if (tempUserData.otp !== otp || tempUserData.otpExpiresAt < Date.now()) {
            tempUsers.delete(email); 
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(tempUserData.password, salt);

        const newUser = new User({ 
            username: tempUserData.username,
            email: email, // <--- Use the 'email' from req.body
            password: hashedPassword, 
            isVerified: true
        });

        await newUser.save();
        
        tempUsers.delete(email);

        res.status(201).json({ message: "Account created and verified successfully!" });

    } catch (err) {
        console.error("Verification error:", err);
        res.status(500).json({ message: "Server error during verification." });
    }
};

exports.login = (req, res,next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err){
            return res.status(500).json({message: 'Server error'});
        }
        if(!user){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        req.logIn(user, (err) => {
            if(err){
                return res.status(500).json({message: 'Server error'});
            }
            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: user._id,
                    username: user.username, 
                    email: user.email}
                }
            );
        });
    })(req, res, next);  
}

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ msg: 'Logout failed.' });
        }
        res.status(200).json({ msg: 'Logged out successfully.' });
    });
};

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
        }

        user.otp = otp;
        user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // 5 min
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It expires in 5 minutes.`,
        });

        res.json({ message: "OTP sent to email" });
    } catch (err) {
        res.status(500).json({ message: "Error sending OTP", error: err });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });
        if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        if (user.otpExpiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });

        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;
        await user.save();

        res.json({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error verifying OTP", error: err });
    }
};