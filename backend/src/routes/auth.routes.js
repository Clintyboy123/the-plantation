const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { loginLimiter } = require('../middleware/rateLimit');
const { requireAuth } = require('../middleware/auth');
const controller = require('../controllers/auth.controller');

router.post(
  '/login',
  loginLimiter,
  validate([
    body('email').trim().toLowerCase().isEmail().withMessage('Enter your email address').isLength({ max: 254 }),
    body('password').isString().notEmpty().withMessage('Enter your password').isLength({ max: 200 }),
  ]),
  controller.login
);
router.post('/logout', controller.logout);
router.get('/me', requireAuth, controller.me);

module.exports = router;
