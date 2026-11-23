const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const ApiError = require('../utils/ApiError');
exports.list = async (req, res) => {
  const rooms = await Room.find().sort({ roomNumber: 1 });
  res.json({ success: true, data: rooms });
};
exports.get = async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) throw new ApiError(404, 'Room not found');
  res.json({ success: true, data: room });
};
exports.create = async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json({ success: true, data: room });
};
exports.update = async (req, res) => {
  const allowed = ['roomNumber', 'roomType', 'pricePerNight', 'capacity', 'status', 'description'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  const room = await Room.findById(req.params.id);
  if (!room) throw new ApiError(404, 'Room not found');
  if (updates.status && updates.status !== 'Occupied' && await Reservation.exists({ roomId: room.id, status: 'CheckedIn' })) {
    throw new ApiError(409, 'Cannot change a checked-in room to Available or Maintenance');
  }
  Object.assign(room, updates);
  await room.save();
  res.json({ success: true, data: room });
};
exports.remove = async (req, res) => {
  if (await Reservation.exists({ roomId: req.params.id })) throw new ApiError(409, 'Room has reservation history; keep it instead of deleting');
  const room = await Room.findByIdAndDelete(req.params.id);
  if (!room) throw new ApiError(404, 'Room not found');
  res.json({ success: true, message: 'Room deleted' });
};
