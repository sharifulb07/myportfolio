const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  balance: { type: Number, default: 0 },
  lastPaymentDate: { type: Date },
});

module.exports = mongoose.model('Customer', customerSchema);