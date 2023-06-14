const express = require('express');
const app = express();
const port = 3000;
const connect = require('./schemas');

connect();
const postsRouter = require('./routes/posts.js');
const commentsRouter = require('./routes/comments.js');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello node.js server')
})
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
// app.use((req, res, next) => {
//   res.status(404).send('Not Found');
// })

// app.use((err,req,res, next) => {
// console.error(err);
// res.status(500).send(err.message)
// })

app.listen(port, () => {
  console.log(port, '번 포트로 서버가 실행되었습니다.')
});