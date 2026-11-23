const mongoose = require('mongoose');
const billSchema = new mongoose.Schema({
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', unique: true, required: true },
  amount: { type: Number, min: 0, required: true },
  paidAmount: { type: Number, min: 0, default: 0 },
  paymentStatus: { type: String, enum: ['Pending', 'Partial', 'Paid'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Cash', 'Card', 'Bank Transfer', 'Not Selected'], default: 'Not Selected' }
}, { timestamps: true });
module.exports = mongoose.model('Bill', billSchema);
