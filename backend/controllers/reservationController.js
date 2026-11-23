const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const Customer = require('../models/Customer');
const Bill = require('../models/Bill');
const ApiError = require('../utils/ApiError');
const { asUtcDate, calculateNights } = require('../utils/reservationUtils');
const activeStatuses = ['Pending', 'Confirmed', 'CheckedIn'];
async function findConflict(roomId, start, end, excludeId) {
  const filter = { roomId, status: { $in: activeStatuses }, checkInDate: { $lt: end }, checkOutDate: { $gt: start } };
  if (excludeId) filter._id = { $ne: excludeId };
  return Reservation.exists(filter);
}
const populate = query => query.populate('roomId', 'roomNumber roomType pricePerNight status').populate('customerId', 'firstName lastName phone email');
exports.list = async (req, res) => {
  const rows = await populate(Reservation.find().sort({ createdAt: -1 }));
  res.json({ success: true, data: rows });
};
exports.get = async (req, res) => {
  const reservation = await populate(Reservation.findById(req.params.id));
  if (!reservation) throw new ApiError(404, 'Reservation not found');
  res.json({ success: true, data: reservation });
};
exports.create = async (req, res) => {
  const { customerId, roomId, checkInDate, checkOutDate, notes } = req.body;
  const start = asUtcDate(checkInDate);
  const end = asUtcDate(checkOutDate);
  const nights = calculateNights(start, end);
  const [room, customer] = await Promise.all([Room.findById(roomId), Customer.findById(customerId)]);
  if (!room) throw new ApiError(404, 'Room not found');
  if (!customer) throw new ApiError(404, 'Customer not found');
  if (room.status === 'Maintenance') throw new ApiError(409, 'Room is under maintenance');
  if (await findConflict(roomId, start, end)) throw new ApiError(409, 'Room already reserved for those dates');
  const reservation = await Reservation.create({ customerId, roomId, checkInDate: start, checkOutDate: end, nightlyRate: room.pricePerNight, totalPrice: nights * room.pricePerNight, notes });
  res.status(201).json({ success: true, data: await populate(Reservation.findById(reservation.id)) });
};
exports.update = async (req, res) => {
  const item = await Reservation.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Reservation not found');
  if (!['Pending', 'Confirmed'].includes(item.status)) throw new ApiError(409, 'Only pending/confirmed reservations can be edited');
  if (await Bill.exists({ reservationId: item.id })) throw new ApiError(409, 'Reservation already has a bill');
  const roomId = req.body.roomId || String(item.roomId);
  const customerId = req.body.customerId || String(item.customerId);
  const start = asUtcDate(req.body.checkInDate || item.checkInDate.toISOString().slice(0, 10));
  const end = asUtcDate(req.body.checkOutDate || item.checkOutDate.toISOString().slice(0, 10));
  const nights = calculateNights(start, end);
  const [room, customer] = await Promise.all([Room.findById(roomId), Customer.findById(customerId)]);
  if (!room || !customer) throw new ApiError(404, 'Room or customer not found');
  if (room.status === 'Maintenance') throw new ApiError(409, 'Room is under maintenance');
  if (await findConflict(roomId, start, end, item.id)) throw new ApiError(409, 'Room already reserved for those dates');
  Object.assign(item, { roomId, customerId, checkInDate: start, checkOutDate: end, nightlyRate: room.pricePerNight, totalPrice: nights * room.pricePerNight });
  if (req.body.notes !== undefined) item.notes = req.body.notes;
  await item.save();
  res.json({ success: true, data: await populate(Reservation.findById(item.id)) });
};
exports.changeStatus = async (req, res) => {
  const item = await Reservation.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Reservation not found');
  const nextStatus = req.body.status;
  const transitions = { Pending: ['Confirmed', 'Cancelled'], Confirmed: ['CheckedIn', 'Cancelled'], CheckedIn: ['CheckedOut'], CheckedOut: [], Cancelled: [] };
  if (!transitions[item.status].includes(nextStatus)) throw new ApiError(409, `Cannot change ${item.status} to ${nextStatus}`);
  const room = await Room.findById(item.roomId);
  if (!room) throw new ApiError(404, 'Room not found');
  if (nextStatus === 'CheckedIn') {
    if (room.status !== 'Available') throw new ApiError(409, 'Room is not ready for check-in');
    const other = await Reservation.exists({ roomId: item.roomId, status: 'CheckedIn', _id: { $ne: item.id } });
    if (other) throw new ApiError(409, 'Another guest is checked in');
    room.status = 'Occupied';
  }
  if (nextStatus === 'CheckedOut') room.status = 'Available';
  if (nextStatus === 'Cancelled' && await Bill.exists({ reservationId: item.id })) {
    throw new ApiError(409, 'Remove the unpaid bill before cancelling this reservation');
  }
  // Prototype note: production workflows should use MongoDB transactions to update both documents atomically.
  await room.save();
  item.status = nextStatus;
  await item.save();
  res.json({ success: true, data: await populate(Reservation.findById(item.id)) });
};
exports.cancel = async (req, res) => {
  req.body.status = 'Cancelled';
  return exports.changeStatus(req, res);
};
