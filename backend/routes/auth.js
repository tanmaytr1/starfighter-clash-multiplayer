const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post("/verify-and-create-user", authController.verifyAndCreateUser);
router.get('/status', (req, res) => {
//   console.log('Session ID on status check:', req.sessionID);
//   console.log('User on status check:', req.user); // if you are using passport
  if (req.isAuthenticated()) { // or check for req.session.user
    return res.status(200).json({ user: req.user });
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
});



module.exports = router;
