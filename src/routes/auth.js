const express = require('express');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');
const { createUser, findUserByEmail, verifyPassword, toPublicUser } = require('../auth/users');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /auth/register - 회원가입
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email과 password는 필수입니다.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다.' });
    }
    const user = await createUser(email, password, displayName);
    if (!user) {
      return res.status(409).json({ error: '이미 등록된 이메일입니다.' });
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: jwtExpiresIn });
    res.status(201).json({
      user,
      token,
      expiresIn: jwtExpiresIn,
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/login - 로그인
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email과 password는 필수입니다.' });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: jwtExpiresIn });
    res.json({
      user: toPublicUser(user),
      token,
      expiresIn: jwtExpiresIn,
    });
  } catch (err) {
    next(err);
  }
});

// GET /auth/me - 로그인한 사용자 정보 (인증 필요)
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
