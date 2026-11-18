// Database settings, shared by the app and by sequelize-cli (migrations and seeders).
const env = require('./env');

const settings = {
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  host: env.db.host,
  port: env.db.port,
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true, // created_at, user_id ... in the database; camelCase in the code
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
};

module.exports = {
  development: settings,
  test: settings,
  production: settings,
};
