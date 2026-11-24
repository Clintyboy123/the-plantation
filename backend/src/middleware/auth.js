// Protects admin routes. The session is a signed token in an httpOnly cookie, which page scripts
// cannot read. Hiding a button in React is not protection; this is.
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { Admin } = require('../models');
const ApiError = require('../utils/ApiError');

const COOKIE = 'plantation_admin';

const cookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  path: '/',
};

exports.COOKIE = COOKIE;

exports.setSession = (res, admin) => {
  const token = jwt.sign({ sub: admin.id }, env.jwtSecret, { expiresIn: `${env.sessionDays}d` });
  res.cookie(COOKIE, token, { ...cookieOptions, maxAge: env.sessionDays * 24 * 60 * 60 * 1000 });
};

exports.clearSession = (res) => res.clearCookie(COOKIE, cookieOptions);

exports.requireAuth = async (req, res, next) => {
  const token = req.cookies?.[COOKIE];
  if (!token) return next(new ApiError(401, 'Please sign in.'));
  try {
    const { sub } = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findByPk(sub);
    if (!admin) return next(new ApiError(401, 'Please sign in.'));
    req.admin = admin;
    return next();
  } catch {
    return next(new ApiError(401, 'Your session has ended. Please sign in again.'));
  }
};
