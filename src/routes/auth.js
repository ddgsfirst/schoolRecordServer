const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: 로그인한 사용자 정보 조회 및 동기화
 *     description: 프론트엔드에서 발급받은 Firebase ID Token을 Authorization 헤더에 Bearer 타입으로 전달하면, 유효성을 검증하고 Firestore 사용자 정보를 반환합니다. (자동 가입 및 갱신 포함)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 사용자 정보 반환 성공
 *       401:
 *         description: 유효하지 않은 토큰이거나 인증 헤더 누락
 */
router.get('/me', authenticate, (req, res) => {
  // 인증 미들웨어(authenticate) 통과 시, req.user 객체에 사용자 정보가 담깁니다.
  res.json({
    message: '인증 완료. 사용자 정보입니다.',
    user: req.user
  });
});

const { firebaseApiKey } = require('../config/env');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 이메일/비밀번호로 회원가입
 *     description: 서버 측에서 Firebase Auth REST API를 호출하여 신규 유저를 생성하고 Token을 반환합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 회원가입 성공 및 토큰 반환
 *       400:
 *         description: 잘못된 요청 또는 이미 존재하는 이메일
 */
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    res.json({ message: '회원가입 성공', token: data.idToken, expiresIn: data.expiresIn });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 이메일/비밀번호로 로그인
 *     description: 서버 측에서 Firebase Auth REST API를 호출하여 로그인을 수행하고 Token을 추출합니다.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공 및 토큰 반환
 *       400:
 *         description: 잘못된 계정 정보
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    res.json({ message: '로그인 성공', token: data.idToken, expiresIn: data.expiresIn });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
