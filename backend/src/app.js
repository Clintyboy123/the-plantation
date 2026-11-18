// The Express app: security, logging, body parsing, routes, error handling. No listening here (see server.js).
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimit');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', env.trustProxy);
app.disable('x-powered-by');

app.use(helmet());
app.use(
  morgan(env.isProduction ? 'combined' : 'dev', {
    skip: (req) => req.originalUrl === '/api/health', // Docker checks this every 30s; keep the logs readable
  })
);
app.use(express.json({ limit: '100kb' }));

const isHealthCheck = (req) => req.path === '/health';
app.use('/api', (req, res, next) => (isHealthCheck(req) ? next() : apiLimiter(req, res, next)), routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
