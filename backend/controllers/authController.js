const User = require('../models/User');
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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
