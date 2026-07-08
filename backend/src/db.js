const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Sistem Aman! MongoDB Atlas Udah Terhubung 🔥');
    } catch (error) {
        console.error('Gagal konek database:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
