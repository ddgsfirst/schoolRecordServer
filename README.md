# 제1기 등대건설 | 생기부 분석 파트 서버

Express 기반 API 서버입니다. 기본 로그인(회원가입·로그인·JWT 인증)을 지원합니다.

## 기술 스택

- **Node.js** + **Express 4**
- **JWT** (jsonwebtoken) · **bcrypt** (비밀번호 해시)
- **CORS** · **morgan** · **dotenv**

## 요구 사항

- Node.js 18 이상

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정 (.env.example 참고)
cp .env.example .env
# .env에서 JWT_SECRET 등 값 수정

# 개발 모드 (파일 변경 시 자동 재시작)
npm run dev

# 프로덕션 실행
npm start
```

기본 포트: **3000** → `http://localhost:3000`

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `PORT` | 서버 포트 | `3000` |
| `NODE_ENV` | 실행 환경 | `development` |
| `JWT_SECRET` | JWT 서명 비밀키 (운영 시 반드시 변경) | - |
| `JWT_EXPIRES_IN` | 토큰 유효 기간 | `7d` |

## API 엔드포인트

### 공개

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/` | API 정보 |
| GET | `/health` | 헬스 체크 |
| POST | `/auth/register` | 회원가입 |
| POST | `/auth/login` | 로그인 |

### 인증 필요 (Authorization: Bearer \<token\>)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/auth/me` | 로그인한 사용자 정보 |

### 예시

**회원가입**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","displayName":"홍길동"}'
```

**로그인**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**내 정보 조회**
```bash
curl http://localhost:3000/auth/me -H "Authorization: Bearer <받은_token>"
```

## 프로젝트 구조

```
src/
├── index.js          # 서버 진입점
├── app.js            # Express 앱 설정
├── config/
│   └── env.js        # 환경 변수
├── auth/
│   └── users.js      # 사용자 저장소 (인메모리)
├── middleware/
│   └── auth.js       # JWT 인증 미들웨어
└── routes/
    ├── index.js      # 기본 라우트
    └── auth.js       # 인증 라우트
```

## Docker

```bash
docker build -t ddgs-school-record-server .
docker run -p 3000:3000 --env-file .env ddgs-school-record-server
```

## 배포

AWS Lightsail 인스턴스 또는 컨테이너 배포 방법은 [docs/DEPLOY_LIGHTSAIL.md](docs/DEPLOY_LIGHTSAIL.md)를 참고하세요.

## 라이선스

ISC
