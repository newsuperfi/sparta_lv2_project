const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const Post = require('../schemas/post.js');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

router.route('/')
  .get(async (req, res) => {
    const posts = await Post.find().sort({createdAt: -1});
    if (posts.length) {
      const results = posts.map((post) => {
        return {
          "postId": post._id,
          "user": post.userId,
          "title": post.title,
          "createdAt": post.createdAt,
        };
      });
      res.json({ data: results })
    } else {
      res.json({ errorMessage: "포스트가 존재하지 않습니다." })
    }
  })
  .post(auth, (req, res) => {
    const { user, password, title, content } = req.body;
    Post.create({ user, password, title, content })
    res.json({ message: '게시글을 생성하였습니다.' });
  })

router.route('/:postId')
  .get(async (req, res) => {
    const postId = req.params.postId;
    if (ObjectId.isValid(postId)) {
      const post = await Post.findById(postId);
      if (post) {
        const results = {
          "postId": postId,
          "writer": post.writer,
          "title": post.title,
          "content": post.content,
          "createdAt": post.createdAt
        }
        res.json({ data: results })
      } else {
        res.status(400).json({ errorMessage: "존재하지 않는 데이터입니다." });
      }
    } else {
      res.status(400).json({ errorMessage: "데이터 형식이 올바르지 않습니다." });
    }
  })
  .put(async (req, res) => {
    const { password, user, title, content } = req.body;
    const postId = req.params.postId;
    if (ObjectId.isValid(postId)) {
      const post = await Post.findById(postId);
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
  .delete(async (req, res) => {
    const { password } = req.body;
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId })
    if (ObjectId.isValid(postId)) {
      if (post) {
        if (post.password !== password) {
          res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." })
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