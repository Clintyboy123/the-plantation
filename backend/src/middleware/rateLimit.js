// Rate limits, per visitor IP.
const { rateLimit } = require('express-rate-limit');

const build = (windowMinutes, limit, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message },
  });

// Applied to the whole API.
const apiLimiter = build(15, 300, 'Too many requests. Please slow down and try again shortly.');

// Public forms (contact, enquiries): router.post('/', formLimiter, ...)
const formLimiter = build(60, 10, 'Too many attempts. Please try again later.');

// Sign-in. Kept separate from formLimiter: each limiter counts on its own, so if both shared one,
// sending a few test enquiries from your own connection could lock you out of the admin.
const loginLimiter = build(15, 10, 'Too many sign-in attempts. Please wait 15 minutes and try again.');

module.exports = { apiLimiter, formLimiter, loginLimiter };
