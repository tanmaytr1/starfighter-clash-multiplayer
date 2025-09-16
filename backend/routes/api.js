const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

router.get('/profile', apiController.getProfile);
router.get('/rooms', apiController.getActiveRooms);

module.exports = router;