const ApiError = require('../utils/ApiError');
function notFound(req, res, next) { next(new ApiError(404, `Route not found: ${req.originalUrl}`)); }
function errorHandler(err, req, res, next) {
  let status = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map(e => e.message).join('; '); }
  if (err.name === 'CastError') { status = 400; message = 'Invalid resource ID'; }
  if (err.code === 11000) { status = 409; message = `Duplicate value: ${Object.keys(err.keyValue || {}).join(', ')}`; }
  if (status >= 500) console.error(err);
  res.status(status).json({ success: false, message: status >= 500 ? 'Unexpected server error' : message });
}
module.exports = { notFound, errorHandler };
