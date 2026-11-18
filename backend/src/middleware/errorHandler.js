// Every error in the API ends up here. Visitors get a clean JSON message;
// the full detail goes to the container log only.
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let status = 500;
  let message = 'Something went wrong. Please try again.';
  let errors;

  if (err instanceof ApiError) {
    ({ status, message, errors } = err);
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'The request could not be read.';
  } else if (err.type === 'entity.too.large') {
    status = 413;
    message = 'The request is too large.';
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    message = 'That already exists.';
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'SequelizeValidationError') {
    status = 422;
    message = 'Please check the highlighted fields.';
    errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
  }

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(status).json({ success: false, message, ...(errors ? { errors } : {}) });
};
