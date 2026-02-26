const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns the API base status
 *     tags: [General]
 *     responses:
 *       200:
 *         description: A successful response with API status.
 */
router.get('/', (req, res) => {
  res.json({ message: 'DDGS School Record API', status: 'ok' });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Indicates the server is healthy.
 */
router.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

module.exports = router;
