const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true, trim: true },
  roomType: { type: String, required: true, enum: ['Single', 'Double', 'Deluxe', 'Suite'] },
  pricePerNight: { type: Number, required: true, min: 0 },
  capacity: { type: Number, required: true, min: 1, default: 2 },
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  description: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Room', roomSchema);
