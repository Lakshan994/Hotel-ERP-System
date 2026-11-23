const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
async function protect(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (!token) return next(new ApiError(401, 'Please log in'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user) return next(new ApiError(401, 'Account no longer exists'));
    req.user = user;
    next();
  } catch (err) { next(new ApiError(401, 'Session invalid or expired')); }
}
function allowRoles(...roles) {
  return (req, res, next) => req.user && roles.includes(req.user.role)
    ? next() : next(new ApiError(403, 'Insufficient permissions'));
}
module.exports = { protect, allowRoles };
