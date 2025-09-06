// Middleware to protect routes
module.exports = function(req, res, next) {
  if (req.isAuthenticated()) {
    // User is logged in
    return next();
  } else {
    // User is not logged in
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
