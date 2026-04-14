const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  paymentType: { type: String, enum: ['cash', 'credit'], required: true },
  customerName: { type: String },
  customerPhone: { type: String },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sale', saleSchema);