const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

// ObjectId.prototype.valueOf = function () {
// 	return this.toString();
// };

const postSchema = new mongoose.Schema({
  postId: {
    type: ObjectId
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  title: {
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

module.exports = mongoose.model("Post", postSchema);