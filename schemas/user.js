const mongoose = require('mongoose');

// ID, email, password, confirmPassword 
const userSchema = new mongoose.Schema({
  userId: { 
    type:String,
    required: true,
    unique: true
  },
  nickname: {
    type:String,
    required:true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("User", userSchema);