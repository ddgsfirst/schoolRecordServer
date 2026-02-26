const { admin } = require('../config/firebase');
const { syncUserFromFirebase, toPublicUser } = require('../auth/users');

/**
 * Authorization: Bearer <Firebase_ID_Token> 헤더로 Firebase JWT 검증 후 
 * req.user에 Firestore 사용자 정보 설정
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '인증이 필요합니다. Authorization: Bearer <Firebase_ID_Token>' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // 1. Firebase Admin SDK로 토큰 유효성 검증
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 2. 검증된 토큰의 uid를 기반으로 Firestore에서 유저 정보 동기화 및 가져오기 (가입/로그인 대체)
    const user = await syncUserFromFirebase(decodedToken);

    // 3. Request 객체에 담기
    req.user = toPublicUser(user);
    next();
  } catch (err) {
    console.error('[Auth Error]', err.code || err.message);
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: '토큰이 만료되었습니다. 다시 로그인해주세요.' });
    }
    return res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
}

module.exports = { authenticate };
