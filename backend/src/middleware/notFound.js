const ApiError = require('../utils/ApiError');

// Any request that matched no route ends up here and gets a JSON 404.
module.exports = (req, res, next) => {
  next(new ApiError(404, 'Not found'));
};
