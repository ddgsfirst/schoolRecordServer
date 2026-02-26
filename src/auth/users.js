const { admin, db } = require('../config/firebase');

/**
 * Firebase Auth에서 유저 정보를 가져오거나, 없다면 Firestore에 새로 등록합니다.
 * @param {Object} decodedToken - Firebase verifyIdToken()의 결과물
 */
async function syncUserFromFirebase(decodedToken) {
  const { uid, email, name, picture } = decodedToken;
  const userRef = db.collection('users').doc(uid);
  const doc = await userRef.get();

  let userData;

  if (!doc.exists) {
    // Firestore에 신규 가입 유저 등록
    userData = {
      uid,
      email,
      displayName: name || email.split('@')[0],
      photoURL: picture || null,
      role: 'user', // 기본 권한
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await userRef.set(userData);
  } else {
    // 기존 유저의 경우 마지막 로그인 시간만 갱신
    userData = doc.data();
    await userRef.update({
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return userData;
}

/**
 * Firestore에서 유저 ID(uid)로 사용자 정보를 가져옵니다.
 * @param {string} uid 
 */
async function getUserById(uid) {
  const userRef = db.collection('users').doc(uid);
  const doc = await userRef.get();
  if (!doc.exists) return null;
  return doc.data();
}

/**
 * 클라이언트 쪽에 내려줄 때 민감한 정보를 제외하는 헬퍼 함수
 * (Firestore 구조에서는 이미 민감정보가 없지만 일관성을 위해 유지)
 */
function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: user.role,
  };
}

module.exports = {
  syncUserFromFirebase,
  getUserById,
  toPublicUser,
};
