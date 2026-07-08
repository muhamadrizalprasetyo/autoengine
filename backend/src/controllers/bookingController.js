const Booking = require('../models/Booking');
const Service = require('../models/Service');

const createBooking = async (req, res) => {
  try {
    const { no_pelat, jenis_mobil, merek_mobil, layanan, tanggal, catatan, metode_pembayaran_booking, dp_amount } = req.body;
    const io = req.app.get('io');

    const services = await Service.find({ _id: { $in: layanan } });

    // Calculate estimated price based on selected services
    const estimasi_harga = services.reduce((sum, service) => sum + service.harga_dasar, 0);

    const booking = new Booking({
      user_id: req.user.id,
      no_pelat,
      jenis_mobil,
      merek_mobil,
      layanan,
      tanggal: new Date(tanggal),
      catatan,
      estimasi_harga,
      metode_pembayaran_booking: metode_pembayaran_booking || 'Lunas Nanti',
      dp_amount: dp_amount || 0
    });

    await booking.save();
    await booking.populate('layanan');

    io.emit('new_booking', booking);

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const { role, id } = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let filter = {};
    if (role === 'customer') {
      filter = { user_id: id };
    }

    let query = Booking.find(filter)
      .populate('layanan')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (role !== 'customer') {
      query = query.populate('user_id', 'nama no_wa email');
    }

    const bookings = await query;
    const total = await Booking.countDocuments(filter);

    res.json({
      data: bookings,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user_id', 'nama no_wa email')
      .populate('layanan');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status_pengerjaan } = req.body;
    const io = req.app.get('io');

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status_pengerjaan },
      { new: true }
    ).populate('layanan');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    io.emit('booking_status_changed', booking);

    res.json({ message: 'Status updated successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const uploadCarPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const foto_url = req.file.path; // Cloudinary URL
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { foto_mobil: foto_url },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Photo uploaded successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  uploadCarPhoto
};
