const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');


// 회원가입 
router.post('/signup', async (req, res) => {

  const { userId, nickname, email, password, confirmPassword } = req.body;
  const existingUser = await User.find({
    $or: [
      { userId: userId },
      { email: email },
      { nickname: nickname }
    ]
  })
  console.log(existingUser.length)
  if (existingUser.length !== 0) {
    return res.status(409).json({ errMessage: "이미 존재하는 회원입니다." })
  } else if (password !== confirmPassword) {
    return res.status(409).json({ errMessage: "비밀번호를 확인하여 주십시오." })
  }

  const result = await User.create({ userId, nickname, email, password })
  console.log(result)
  res.status(201).json({
    message: "회원 가입에 성공하였습니다.",
    data: result
  })
})

// 로그인

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId: userId })
  if (!user) {
    return res.status(409).json({ errMessage: "가입되지 않은 회원입니다."});
  } else if (password !== user.password) {
    return res.status(409).json({ errMessage: "비밀번호를 확인하여 주십시오."});
  }

  const token = jwt.sign({
    userId: user.userId
  }, "customized-secret-key");
  res.cookie("Authorization", `Bearer ${token}`);
  return res.json({message: "로그인 완료"})

})



module.exports = router;