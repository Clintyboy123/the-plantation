// An error that is safe to show to the visitor. Throw it from services and controllers:
//   throw new ApiError(404, 'Booking not found');
class ApiError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors; // optional list of { field, message }
  }
}

module.exports = ApiError;
