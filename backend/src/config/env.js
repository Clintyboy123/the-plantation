// Single place where environment variables are read. Nothing else touches process.env.
const path = require('path');

// Local runs read the project-root .env. In Docker, Compose injects the values and this does nothing.
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env'), quiet: true });

const nodeEnv = process.env.NODE_ENV || 'development';

const env = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  appName: process.env.APP_NAME || 'Website',
  port: Number(process.env.PORT || process.env.BACKEND_PORT || 3000),

  // How many proxies sit in front of the API. On the VPS that is 2
  // (VPS Nginx -> frontend Nginx -> here). Needed so rate limiting sees
  // each visitor's real IP instead of treating everyone as one person.
  trustProxy: Number(process.env.TRUST_PROXY || 2),

  // Enquiry email. Optional: without SMTP_HOST, enquiries are saved but nobody is emailed.
  mail: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.MAIL_FROM || 'The Plantation website <no-reply@theplantation.co.za>',
    to: process.env.MAIL_TO || '',
    toBoma: process.env.MAIL_TO_BOMA || '',
    toChurch: process.env.MAIL_TO_CHURCH || '',
  },

  // Admin sign-in. JWT_SECRET signs the session cookie; ADMIN_EMAIL / ADMIN_PASSWORD are read only by
  // the admin seeder, which creates (or resets) the venue's login.
  jwtSecret: process.env.JWT_SECRET || '',
  sessionDays: 7,
  admin: {
    email: (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD || '',
  },

  // Specials expire on South African dates, whatever the server's own time zone.
  timeZone: 'Africa/Johannesburg',

  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || process.env.MYSQL_DATABASE,
    user: process.env.DB_USER || process.env.MYSQL_USER,
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD,
  },
};

const missing = Object.entries({
  'DB_NAME / MYSQL_DATABASE': env.db.name,
  'DB_USER / MYSQL_USER': env.db.user,
  'DB_PASSWORD / MYSQL_PASSWORD': env.db.password,
  JWT_SECRET: env.jwtSecret,
})
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill it in.`);
}

module.exports = env;
