const Bill = require('../models/Bill');
const Reservation = require('../models/Reservation');
const ApiError = require('../utils/ApiError');
const populate = query => query.populate({ path: 'reservationId', populate: [{ path: 'customerId', select: 'firstName lastName' }, { path: 'roomId', select: 'roomNumber' }] });
exports.list = async (req, res) => res.json({ success: true, data: await populate(Bill.find().sort({ createdAt: -1 })) });
exports.get = async (req, res) => {
  const data = await populate(Bill.findById(req.params.id));
  if (!data) throw new ApiError(404, 'Bill not found');
  res.json({ success: true, data });
};
exports.create = async (req, res) => {
  const reservation = await Reservation.findById(req.body.reservationId);
  if (!reservation) throw new ApiError(404, 'Reservation not found');
  if (reservation.status === 'Cancelled') throw new ApiError(409, 'Cannot bill a cancelled reservation');
  if (await Bill.exists({ reservationId: reservation.id })) throw new ApiError(409, 'Bill already exists for this reservation');
  const bill = await Bill.create({ reservationId: reservation.id, amount: reservation.totalPrice });
  res.status(201).json({ success: true, data: await populate(Bill.findById(bill.id)) });
};
exports.payment = async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) throw new ApiError(404, 'Bill not found');
  const payment = Number(req.body.paymentAmount);
  if (!Number.isFinite(payment) || payment <= 0) throw new ApiError(400, 'Payment amount must be positive');
  if (!['Cash','Card','Bank Transfer'].includes(req.body.paymentMethod)) throw new ApiError(400, 'Choose a valid payment method');
  const remainingCents = Math.round((bill.amount - bill.paidAmount) * 100);
  const paymentCents = Math.round(payment * 100);
  if (paymentCents > remainingCents) throw new ApiError(409, 'Payment exceeds outstanding balance');
  bill.paidAmount = Math.round((bill.paidAmount + payment) * 100) / 100;
  bill.paymentStatus = bill.paidAmount >= bill.amount ? 'Paid' : 'Partial';
  bill.paymentMethod = req.body.paymentMethod;
  await bill.save();
  res.json({ success: true, data: await populate(Bill.findById(bill.id)) });
};
exports.remove = async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  if (!bill) throw new ApiError(404, 'Bill not found');
  if (bill.paidAmount > 0) throw new ApiError(409, 'Paid bills cannot be deleted');
  await bill.deleteOne();
  res.json({ success: true, message: 'Unpaid bill removed' });
};
