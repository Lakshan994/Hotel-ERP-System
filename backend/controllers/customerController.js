const Customer = require('../models/Customer');
const Reservation = require('../models/Reservation');
const ApiError = require('../utils/ApiError');
exports.list = async (req, res) => {
  const q = String(req.query.search || '').trim().slice(0, 80);
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const filter = q ? { $or: ['firstName', 'lastName', 'phone', 'email'].map(k => ({ [k]: { $regex: escaped, $options: 'i' } })) } : {};
  res.json({ success: true, data: await Customer.find(filter).sort({ createdAt: -1 }) });
};
exports.get = async (req, res) => {
  const data = await Customer.findById(req.params.id);
  if (!data) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, data });
};
exports.create = async (req, res) => {
  const { firstName, lastName, email, phone, address } = req.body;
  res.status(201).json({ success: true, data: await Customer.create({ firstName, lastName, email, phone, address }) });
};
exports.update = async (req, res) => {
  const allowed = ['firstName', 'lastName', 'email', 'phone', 'address'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const data = await Customer.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!data) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, data });
};
exports.remove = async (req, res) => {
  if (await Reservation.exists({ customerId: req.params.id })) throw new ApiError(409, 'Customer has reservation history');
  const data = await Customer.findByIdAndDelete(req.params.id);
  if (!data) throw new ApiError(404, 'Customer not found');
  res.json({ success: true, message: 'Customer deleted' });
};
