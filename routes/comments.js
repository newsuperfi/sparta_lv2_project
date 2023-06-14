const express = require('express');
const router = express.Router();
const Comment = require('../schemas/comment.js')

router.route('/:_postId')
  .get(async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comment.find({ postId: postId })
    console.log(comments)
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
      res.json({ message: "데이터 형식이 올바르지 않습니다" })
    }

  })
  .post(async (req, res) => {
    const postId = req.params.postId;
    const { user, password, content } = req.body;
    Comment.create({ postId, user, password, content });
    res.json({ message: '댓글이 작성되었습니다.' })
  })

router.route('/:_commentId')
  .put(async (req, res) => {
    const commentId = req.params.commentId;
    const { password, content } = req.body;
    const comment = await Comment.findOne({ _id: commentId })
    if (comment.length) {
      if (comment.password === password) {
        await Comment.updateOne(
          { _id: commentId },
          { $set: { content: content } })
      }
    }
  })
  .delete(async (req, res) => {
    const commentId = req.paramsms.commentId;
    const password = req.body.password;
    const comment = await Comment.findOne({ _id: commentId });
    if (comment) {
      await Comment.deleteOne({ _id: commentId})
      res.json({ message: "댓글이 삭제되었습니다."})
    }
  })
// router.delete('/:_commentId')


module.exports = router;