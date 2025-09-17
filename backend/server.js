const express = require('express');
const app = express();
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api'); 
const cors = require('cors');
const http = require('http');

const connectDB = require('./config/db');
const passportConfig = require('./config/passportConfig');
const socketConfig = require('./config/socket'); // 🆕 Import the new config file

dotenv.config();
const PORT = process.env.PORT || 4000;

connectDB();

const server = http.createServer(app);

// 🆕 Call the socket config function to set up and get the Socket.IO instance
const io = socketConfig(server);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend's URL
  credentials: true, // Allow cookies to be sent
}));

// Set up session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'lax', // Use 'lax' for development to be more secure
        // No secure flag for development!
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));




app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Routes
app.use('/api/auth', authRoutes);
// 🆕 Pass the 'io' instance to your API routes
app.use('/api', (req, res, next) => {
    req.io = io;
    next();
}, apiRoutes);


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});