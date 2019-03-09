const mongoose = require("mongoose");
passportLocalMong = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  firstName: String,
  lastName: String,
  email: String,
  isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMong);

module.exports = mongoose.model("User", UserSchema);
