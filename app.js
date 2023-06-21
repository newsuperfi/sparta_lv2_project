const express = require('express');
const app = express();
const port = 3000;
const connect = require('./schemas');
const cookieParser = require('cookie-parser');

connect();
const indexRouter = require('./routes/index.js');
app.use(express.json());
app.use(cookieParser());

app.use('/api', indexRouter);


app.listen(port, () => {
  console.log(port, '번 포트로 서버가 실행되었습니다.')
});