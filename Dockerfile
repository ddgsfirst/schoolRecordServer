# Build stage는 필요 시 추가 (지금은 단순 실행만)
FROM node:20-alpine

WORKDIR /app

# 패키지 파일만 먼저 복사 (캐시 활용)
COPY package.json ./
RUN npm install --omit=dev

# 소스 복사
COPY src ./src

# 기본 포트 (Lightsail/Cloud에서 PORT 오버라이드 가능)
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/index.js"]
