const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Hanya pakai custom DNS di local development (karena ISP lokal suka blokir SRV Atlas)
if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // timeout 10 detik
            socketTimeoutMS: 45000,
        });
        console.log('Sistem Aman! MongoDB Atlas Udah Terhubung 🔥');
    } catch (error) {
        console.error('Gagal konek database:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
