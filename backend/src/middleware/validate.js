// Request validation with express-validator.
// Usage in a route file:
//   const { body } = require('express-validator');
//   router.post('/', validate([ body('email').trim().isEmail().withMessage('Enter a valid email') ]), controller.create);
// After it passes, read the cleaned values with matchedData(req) so unexpected fields are dropped.
const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const result = validationResult(req);
    if (result.isEmpty()) return next();

    const errors = result.array({ onlyFirstError: true }).map((e) => ({ field: e.path, message: e.msg }));
    next(new ApiError(422, 'Please check the highlighted fields.', errors));
  },
];

module.exports = validate;
