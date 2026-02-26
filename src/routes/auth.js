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

module.exports = router;
