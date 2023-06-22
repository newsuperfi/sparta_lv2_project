const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const commentRouter = require('./comments');

const Post = require('../schemas/post.js');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

router.route('/')
  .get(async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    if (posts.length) {
      const results = posts.map((post) => {
        return {
          "_Id": post._id,
          "작성자": post.user,
          "제목": post.title,
          "작성일시": post.createdAt,
        };
      });
      res.json({ data: results })
    } else {
      res.json({ errorMessage: "포스트가 존재하지 않습니다." })
    }
  })
  .post(auth, (req, res) => {
    const { user, password, title, content } = req.body;
    userId = res.locals.user.userId;
    Post.create({ user, password, title, content, userId })
    res.json({ message: '게시글을 생성하였습니다.' });
  })

router.route('/:postId')
  .get(async (req, res) => {
    const postId = req.params.postId;
    if (ObjectId.isValid(postId)) {
      const post = await Post.findById(postId);
      if (post) {
        const results = {
          "_id": post._id,
          "writer": post.writer,
          "title": post.title,
          "content": post.content,
          "createdAt": post.createdAt
        }
        res.json({ data: results })
      } else if (post.userId !== userId) {
        res.json(400).json({ errorMessage: "권한이 없습니다."})
      }
      else {
        res.status(400).json({ errorMessage: "존재하지 않는 데이터입니다." });
      }
    } else {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
  })
  .put(auth, async (req, res) => {
    const { password, user, title, content } = req.body;
    const postId = req.params.postId;
    const { userId } = res.locals.user;
    if (ObjectId.isValid(postId)) {
      const post = await Post.findById(postId);
      console.log(post)
      if (post) {
        if (password !== post.password) {
          res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." })
        } else {
          await Post.updateOne(
            { _id: postId },
            { $set: { user: user, title: title, content: content } }
          )
          res.status(200).json({ success: true })
        }
      } else {
        res.status(400).json({ errorMessage: "글이 존재하지 않습니다." })
      };
    };
  })
  .delete(auth, async (req, res) => {
    const { password } = req.body;
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId })
    const userId = res.locals.user.userId;
    if (ObjectId.isValid(postId)) {
      if (post) {
        if (post.password !== password) {
          res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." })
        } else if (userId !== post.userId) {
          res.status(400).json({ errorMessage: "글 작성자가 아닙니다." })
        } else {
          await Post.deleteOne({ _id: postId });
          res.status(200).json({ success: true })
        }
      } else {
        res.status(400).json({ errorMessage: "글이 존재하지 않습니다." })
      }
    } else {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." })
    }
  })


module.exports = router;