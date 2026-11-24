const { matchedData } = require('express-validator');
const auth = require('../services/auth.service');
const { setSession, clearSession } = require('../middleware/auth');
const ApiError = require('../utils/ApiError');

exports.login = async (req, res) => {
  const { email, password } = matchedData(req, { locations: ['body'] });
  const admin = await auth.signIn(email, password);
  // One message for a wrong email or a wrong password, so the form doesn't reveal which accounts exist.
  if (!admin) throw new ApiError(401, 'That email and password don’t match. Please try again.');
  setSession(res, admin);
  res.json({ success: true, data: auth.publicAdmin(admin) });
};

exports.logout = (req, res) => {
  clearSession(res);
  res.json({ success: true, message: 'Signed out.' });
};

exports.me = (req, res) => res.json({ success: true, data: auth.publicAdmin(req.admin) });
