const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String },
  description: String,
  price: { type: Number },
 
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('Product', productSchema);
