const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware

router.get('/', auth, (req, res) => {
    // This route is only accessible if the user is authenticated
    res.status(200).json({
        msg: 'Welcome to your private profile!',
        user: req.user
    });
});

module.exports = router;