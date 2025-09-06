const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const deleteAllUsers = async () => {
  await connectDB();
  await User.deleteMany({});
  console.log("All users deleted!");
  mongoose.connection.close();
};

deleteAllUsers();
