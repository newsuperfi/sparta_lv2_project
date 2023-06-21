const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model("Comment", commentsSchema);