const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  nama_jasa: {
    type: String,
    required: true,
    trim: true
  },
  estimasi_waktu: {
    type: String,
    required: true
  },
  harga_dasar: {
    type: Number,
    required: true
  },
  deskripsi: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
