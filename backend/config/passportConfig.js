// Import Passport's LocalStrategy, bcrypt for password comparison, and the User model
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function(passport) {

  // ============================
  // Passport Local Strategy
  // ============================
  // This defines how Passport will check user credentials during login
  passport.use(new LocalStrategy({
      usernameField: 'username', // Tells Passport to look for req.body.username
  }, 
  async (username, password, done) => { // Callback function called on login attempt
    try {
      // 1️⃣ Find the user in the database by email OR username
      //    $or allows login using either email or username
      const user = await User.findOne({
        $or: [{ email: username }, { username: username }]
      });

      // 2️⃣ If user not found, login fails
      //    done(null, false) tells Passport authentication failed
      if (!user) {
        return done(null, false, { message: 'Incorrect username or email' });
      }

      // 3️⃣ Compare the entered password with the hashed password stored in DB
      //    bcrypt.compare returns true if passwords match
      const isMatch = await bcrypt.compare(password, user.password);

      // 4️⃣ If password does not match, login fails
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      // 5️⃣ If everything matches, login succeeds
      //    done(null, user) tells Passport authentication succeeded
      return done(null, user); 

    } catch (err) {
      // 6️⃣ If any error occurs (DB error, etc.), pass it to Passport
      return done(err);
    }
  }));

  // ============================
  // Serialize user
  // ============================
  // Called once when user logs in successfully
  // Stores only user.id in the session (not the whole user object)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // ============================
  // Deserialize user
  // ============================
  // Runs on every request after login
  // Fetches full user object from DB using the ID stored in session
  // Attaches it to req.user so routes know who is logged in
  passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
};
