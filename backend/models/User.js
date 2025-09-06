const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false }, // ✅ new
  otp: { type: String },                         // ✅ new
  otpExpiresAt: { type: Date }                   // ✅ new
});

module.exports = mongoose.model('User', userSchema);
