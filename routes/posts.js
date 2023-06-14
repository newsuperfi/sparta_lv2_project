const express = require('express');
const router = express.Router();

const Post = require('../schemas/post.js');

router.route('/')
  .get(async (req, res) => {
    const posts = await Post.find();
    if (posts.length) {
      const results = posts.map((post) => {
        return {
          "postId": post._id,
          "user": post.user,
          "title": post.title,
          "createdAt": post.createdAt,
        };
      });
      res.json({ data: results })
    } else {      
      res.json({ errorMessage: "포스트가 존재하지 않습니다." })
    }

  })
  .post((req, res) => {
    const { user, password, title, content } = req.body;
    Post.create({ user, password, title, content })
    res.json({ message: '게시글을 생성하였습니다.' });
  })

router.route('/:postId')
  .get(async (req, res) => {
    const postId = req.params.postId;
    const post = await Post.find({ _id: postId });
    if (post.length === 0) {
      res.json({ errorMessage: "존재하지 않는 글입니다." })
    } else if (post.length !== 0) {
      const results = {
        "postId": postId,
        "user": post.user,
        "title": post.title,
        "content": post.content,
        "createdAt": post.createdAt
      }
      res.json({ data: results })
    }


  })
  .put(async (req, res) => {
    const { password, user, title, content } = req.body;
    const postId = req.params.postId;
    try {
      const post = await Post.findOne({ _id: postId })
      if (post.length === 0) {
        res.status(400).json({ errorMessage: "글이 존재하지 않습니다." })
      } else if (post.password !== password) {
        res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." })
      } else if (post.length !== 0) {
        await Post.updateOne(
          { _id: postId },
          { $set: { user: user, title: title, content: content } }
        )
        res.status(200).json({ success: true })
      }
    } catch (err) {
      console.error(err)
    }
    
  })
  .delete(async (req, res) => {
    const { password, user, title, content } = req.body;
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId })
    if (post.length) {
      await Post.deleteOne({ _id: postId });
      res.status(200).json({ success: true })
    } else if (post.password !== password) {
      res.status(400).json({ errorMessage: "비밀번호가 일치하지 않습니다." })
    } else {
      res.status(400).json({ errorMessage: "글이 존재하지 않습니다." })
    }

  })


module.exports = router;