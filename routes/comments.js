const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const router = express.Router();
const Comment = require('../schemas/comment.js')

router.route('/:postId')
  .get(async (req, res) => {
    const postId = req.params.postId;
    if (ObjectId.isValid(postId)) {
      const comments = await Comment.find({ postId: postId })
      if (comments.length) {
        const data = comments.map((comment) => {
          return {
            commentId: comment._id,
            user: comment.user,
            content: comment.content,
            createdAt: comment.createdAt
          }
        })
        res.json({ data: data })
      } else {
        res.json({ message: "댓글이 없습니다." })
      }
    } else {
      res.json({ message: "데이터 형식이 올바르지 않습니다" })
    }
  })
  .post(async (req, res) => {
    const postId = req.params.postId;
    const { user, password, content } = req.body;
    Comment.create({ postId, user, password, content });
    res.json({ message: '댓글이 작성되었습니다.' })
  })

router.route('/:commentId')
  .put(async (req, res) => {
    const commentId = req.params.commentId;
    const { password, content } = req.body;
    if(ObjectId.isValid(commentId)){
      const comment = await Comment.findById(commentId)
      if (comment) {
        if(comment.password === password) {
          await Comment.updateOne(
            { _id: commentId },
            { $set: { content: content } })
            res.json({ Message: "수정이 완료되었습니다." })
        } else {
          res.status(400).json({ errorMessage: "비밀번호가 다릅니다."})
        };
      } else {
        res.status(400).json({ errorMessage: "존재하지 않는 댓글입니다."})
      };
    } else {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다."});
    };
  })
  .delete(async (req, res) => {
    const commentId = req.params.commentId;
    const password = req.body.password;
    if (ObjectId.isValid(commentId)) {
      const comment = await Comment.findById(commentId);
      if (comment) {
        if (comment.password === password) {
          await Comment.deleteOne({ _id: commentId })
          res.json({ message: "댓글이 삭제되었습니다." })
        } else {
          res.status(404).json({ errorMessage: "비밀번호가 다릅니다."})
        }
      } else {
        res.status(400).json({ errorMessage: "존재하지 않는 댓글입니다."})
      }
    } else {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다."})
    }
  })


module.exports = router;