const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const { getUserById, toPublicUser } = require('../auth/users');

/**
 * Authorization: Bearer <token> 헤더로 JWT 검증 후 req.user에 사용자 정보 설정
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증이 필요합니다. Authorization: Bearer <token>' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = getUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    req.user = toPublicUser(user);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '토큰이 만료되었습니다.' });
    }
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
}

module.exports = { authenticate };
