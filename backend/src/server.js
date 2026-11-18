// Starts the API, connects to the database (retrying while MySQL boots) and shuts down cleanly.
const env = require('./config/env');
const app = require('./app');
const { sequelize } = require('./models');

const connectWithRetry = async (attempt = 1) => {
  try {
    await sequelize.authenticate();
    console.log('[db] connected');
  } catch (error) {
    const wait = Math.min(attempt * 2, 15);
    console.error(`[db] connection failed (attempt ${attempt}): ${error.message}. Retrying in ${wait}s`);
    setTimeout(() => connectWithRetry(attempt + 1), wait * 1000).unref();
  }
};

const server = app.listen(env.port, () => {
  console.log(`[api] ${env.appName} listening on port ${env.port} (${env.nodeEnv})`);
  connectWithRetry();
});

const shutdown = (signal) => {
  console.log(`[api] ${signal} received, shutting down`);
  server.close(async () => {
    await sequelize.close().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
