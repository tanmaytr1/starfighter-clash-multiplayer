const express = require('express');
const app = express();
const dotenv = require('dotenv'); //
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile'); 
const cors = require('cors');

// 🆕 Import the modularized database and passport config
const connectDB = require('./config/db');
const passportConfig = require('./config/passportConfig');

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport with the configuration
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes); // Use the new protected route


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});