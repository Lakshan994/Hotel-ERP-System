const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  nightlyRate: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'], default: 'Confirmed' },
  notes: { type: String, default: '' }
}, { timestamps: true });
reservationSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1, status: 1 });
module.exports = mongoose.model('Reservation', reservationSchema);
