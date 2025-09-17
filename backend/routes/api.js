const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

const ensureAuthenticated = (req, res, next) => {
    // This is a placeholder for your actual authentication check
    if (req.isAuthenticated()) { 
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

// Route to get a specific room by its ID
// This is the correct route for your design
router.get('/rooms/:roomId', ensureAuthenticated, apiController.findRoomById);

// Route to create a new game room
router.post('/rooms/create', ensureAuthenticated, apiController.createRoom);

// Route to join an existing game room
router.post('/rooms/join', ensureAuthenticated, apiController.joinRoom);

// Route to get the user's profile information
router.get('/profile', ensureAuthenticated, apiController.getProfile);

module.exports = router;