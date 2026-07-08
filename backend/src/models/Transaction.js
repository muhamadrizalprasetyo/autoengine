const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false
  },
  items_dibeli: [{
    inventory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    nama_barang: String,
    jumlah: Number,
    harga_satuan: Number,
    subtotal: Number
  }],
  jasa_dikerjakan: [{
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    nama_jasa: String,
    harga: Number
  }],
  total_bayar: {
    type: Number,
    required: true
  },
  metode_pembayaran: {
    type: String,
    enum: ['Tunai', 'BCA', 'BRI', 'QRIS'],
    required: true
  },
  status_pembayaran: {
    type: String,
    enum: ['Lunas', 'DP', 'Pending', 'Batal'],
    default: 'Lunas'
  },
  bukti_pembayaran: {
    type: String,
    default: null
  },
  invoice_number: {
    type: String,
    unique: true,
    required: true
  },
  kasir_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  is_walk_in: {
    type: Boolean,
    default: false
  },
  walk_in_customer: {
    nama: String,
    no_wa: String,
    no_pelat: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
