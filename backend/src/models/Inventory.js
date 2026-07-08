const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  nama_barang: {
    type: String,
    required: true,
    trim: true
  },
  stok_sisa: {
    type: Number,
    required: true,
    default: 0
  },
  harga_jual: {
    type: Number,
    required: true
  },
  limit_stok: {
    type: Number,
    required: true,
    default: 5
  },
  satuan: {
    type: String,
    default: 'pcs'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inventory', inventorySchema);
