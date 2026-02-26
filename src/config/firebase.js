const admin = require('firebase-admin');
const { nodeEnv } = require('./env');

let db;

try {
    // Cloud Run 등 GCP 환경에서는 Default Service Account를 통해 자동으로 인증을 시도합니다.
    // 로컬 개발 환경의 경우 서비스 계정 키 파일의 경로를 GOOGLE_APPLICATION_CREDENTIALS 환경 변수에 설정하거나,
    // 또는 직접 환경 변수로 파싱하여 주입할 수 있습니다.

    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        // 만약 Base64 인코딩된 서비스 계정 키를 환경 변수로 넘겼다면 이를 파싱하여 사용
        const serviceAccount = JSON.parse(
            Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
        );
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } else {
        // 기본 자격 증명 사용 (Cloud Run 또는 GOOGLE_APPLICATION_CREDENTIALS 설정 시)
        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
    }

    db = admin.firestore();
    console.log(`[Firebase] Successfully initialized in ${nodeEnv} mode.`);
} catch (error) {
    console.error('[Firebase] Initialization error:', error);
}

module.exports = {
    admin,
    db
};
