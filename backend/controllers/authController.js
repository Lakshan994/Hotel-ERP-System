const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const publicUser = user => ({ id: user._id, fullName: user.fullName, email: user.email, role: user.role });
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new ApiError(401, 'Invalid email or password');
  const token = jwt.sign({ sub: String(user._id) }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  res.json({ success: true, token, user: publicUser(user) });
};
exports.register = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ fullName, email, passwordHash, role: role || 'Receptionist' });
  res.status(201).json({ success: true, data: publicUser(user) });
};
exports.profile = async (req, res) => { res.json({ success: true, data: publicUser(req.user) }); };
