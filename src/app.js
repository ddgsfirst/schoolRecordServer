const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { nodeEnv } = require('./config/env');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (nodeEnv !== 'test') {
  app.use(morgan(nodeEnv === 'development' ? 'dev' : 'combined'));
}

// Routes
app.use('/', indexRouter);
app.use('/auth', authRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(nodeEnv === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
