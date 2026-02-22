const bcrypt = require('bcrypt');

// 기본 로그인용 인메모리 사용자 저장소 (재시작 시 초기화됨)
const users = new Map();

const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

async function createUser(email, password, displayName) {
  if (users.has(email)) {
    return null;
  }
  const hashed = await hashPassword(password);
  const user = {
    id: String(users.size + 1),
    email,
    passwordHash: hashed,
    displayName: displayName || email.split('@')[0],
    createdAt: new Date().toISOString(),
  };
  users.set(email, user);
  return { id: user.id, email: user.email, displayName: user.displayName, createdAt: user.createdAt };
}

async function findUserByEmail(email) {
  return users.get(email) || null;
}

function getUserById(id) {
  for (const u of users.values()) {
    if (u.id === id) return u;
  }
  return null;
}

function toPublicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
  };
}

module.exports = {
  createUser,
  findUserByEmail,
  getUserById,
  verifyPassword,
  toPublicUser,
};
