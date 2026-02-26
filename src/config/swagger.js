const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { port } = require('./env');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DDGS School Record Server API',
            version: '1.0.0',
            description: 'API documentation for DDGS School Record Server built with Express.',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Local Development Server',
            },
            // 추후 Cloud Run 도메인이 나오면 여기에 추가할 수 있습니다.
            {
                url: 'https://lighthouse-schoolrecord-schoolrecordserver-992533621276.asia-northeast3.run.app',
                description: 'Production Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // 주석으로 명세된 파일들의 경로를 지정합니다. 
    // 여기서는 routes 폴더 안의 모든 파일과 src/index.js (혹은 라우터가 포함된 곳)을 대상으로 합니다.
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`[Swagger] Docs available at http://localhost:${port}/api-docs`);
};

module.exports = swaggerDocs;
