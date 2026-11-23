const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true, default: '' },
  phone: { type: String, required: true, trim: true },
  address: { type: String, default: '' }
}, { timestamps: true });
module.exports = mongoose.model('Customer', customerSchema);
