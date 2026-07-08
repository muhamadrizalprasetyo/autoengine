const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { auth, authorize } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  uploadCarPhoto
} = require('../controllers/bookingController');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'auto-engine-bookings',
    allowedFormats: ['jpg', 'jpeg', 'png']
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', auth, validateBooking, createBooking);
router.get('/', auth, getBookings);
router.get('/:id', auth, getBookingById);
router.put('/:id/status', auth, authorize('cashier', 'owner'), updateBookingStatus);
router.post('/:id/photo', auth, upload.single('foto'), uploadCarPhoto);

module.exports = router;
