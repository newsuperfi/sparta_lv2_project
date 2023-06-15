const express = require('express');
const router = express.Router();

const postRouter = require('./posts.js');
const commentRouter = require('./comments.js');
const userRouter = require('./users.js');



router.use('/posts', postRouter);
router.use('/comments', commentRouter);
router.use('/users', userRouter);



module.exports = router;