const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  no_pelat: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  jenis_mobil: {
    type: String,
    required: true
  },
  merek_mobil: {
    type: String,
    required: true
  },
  layanan: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  tanggal: {
    type: Date,
    required: true
  },
  status_pengerjaan: {
    type: String,
    enum: ['Menunggu', 'Sedang Dikerjakan', 'Menunggu Pembayaran', 'Dibayar', 'Selesai'],
    default: 'Menunggu'
  },
  foto_mobil: {
    type: String,
    default: null
  },
  catatan: {
    type: String,
    default: ''
  },
  estimasi_harga: {
    type: Number,
    default: 0
  },
  dp_amount: {
    type: Number,
    default: 0
  },
  metode_pembayaran_booking: {
    type: String,
    enum: ['Lunas Nanti', 'DP', 'Full Payment'],
    default: 'Lunas Nanti'
  },
  items_tambahan: [{
    inventory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    nama_barang: String,
    jumlah: Number,
    harga_satuan: Number,
    subtotal: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
