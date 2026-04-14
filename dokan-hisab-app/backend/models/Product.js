const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchasePrice: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  stock: { type: Number, default: 0 },
});

module.exports = mongoose.model('Product', productSchema);