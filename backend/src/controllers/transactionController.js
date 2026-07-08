const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');
const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Generate invoice number
const generateInvoiceNumber = () => {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-4);
  const shortUuid = uuidv4().split('-')[0].toUpperCase();
  return `INV-${timestamp}-${shortUuid}`;
};

const createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { booking_id, items_dibeli, jasa_dikerjakan, total_bayar, metode_pembayaran, status_pembayaran, is_walk_in, walk_in_customer } = req.body;
    const io = req.app.get('io');

    const invoice_number = generateInvoiceNumber();

    let booking = null;
    if (booking_id && !is_walk_in) {
      booking = await Booking.findById(booking_id).session(session);
      if (!booking) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ message: 'Booking not found' });
      }
    }

    // Reduce inventory stock using $inc to prevent race condition
    for (const item of items_dibeli) {
      const inventory = await Inventory.findOneAndUpdate(
        { _id: item.inventory_id, stok_sisa: { $gte: item.jumlah } },
        { $inc: { stok_sisa: -item.jumlah } },
        { new: true, session }
      );

      if (!inventory) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: `Stok tidak mencukupi untuk item: ${item.nama_barang}` });
      }

      if (inventory.stok_sisa <= inventory.limit_stok) {
        io.emit('low_stock', inventory);
      }
    }

    const transaction = new Transaction({
      booking_id: is_walk_in ? null : booking_id,
      items_dibeli,
      jasa_dikerjakan,
      total_bayar,
      metode_pembayaran,
      status_pembayaran: status_pembayaran || 'Lunas',
      invoice_number,
      kasir_id: req.user.id,
      is_walk_in: is_walk_in || false,
      walk_in_customer: walk_in_customer || null
    });

    await transaction.save({ session });

    if (booking) {
      if (status_pembayaran === 'Lunas') {
        booking.status_pengerjaan = 'Dibayar';
      } else if (status_pembayaran === 'DP') {
        booking.status_pengerjaan = 'Menunggu Pembayaran';
      }
      await booking.save({ session });
      io.emit('booking_status_changed', booking);
    }

    await session.commitTransaction();
    session.endSession();

    io.emit('new_transaction', transaction);

    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find()
      .populate('booking_id')
      .populate('kasir_id', 'nama')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Transaction.countDocuments();

    res.json({
      data: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCustomerTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const userId = req.user.id;
    // Find all bookings by this user
    const userBookings = await Booking.find({ user_id: userId }).select('_id');
    const bookingIds = userBookings.map(b => b._id);
    
    const filter = { booking_id: { $in: bookingIds } };
    
    // Find transactions associated with these bookings
    const transactions = await Transaction.find(filter)
      .populate('booking_id')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Transaction.countDocuments(filter);
      
    res.json({
      data: transactions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('booking_id')
      .populate('kasir_id', 'nama');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    
    // If there is no transaction data yet, return dummy analytics data
    if (transactions.length === 0) {
      const dummyRevenueByMonth = {
        'Januari 2026': 1250000,
        'Februari 2026': 1725000,
        'Maret 2026': 2100000,
        'April 2026': 1890000,
        'Mei 2026': 2320000,
        'Juni 2026': 2010000,
      };

      const dummyPaymentMethods = {
        Tunai: 5,
        BCA: 3,
        QRIS: 4,
      };

      const dummyFastMovingItems = [
        { name: 'Oli Mesin 10W-40', quantity: 8 },
        { name: 'Filter Oli', quantity: 4 },
        { name: 'Kanvas Rem Depan', quantity: 3 },
      ];

      return res.json({
        revenueByMonth: dummyRevenueByMonth,
        paymentMethods: dummyPaymentMethods,
        fastMovingItems: dummyFastMovingItems,
        servicePerformance: [],
        dailyTrend: [],
        totalRevenue: Object.values(dummyRevenueByMonth).reduce((sum, value) => sum + value, 0),
        totalTransactions: 12
      });
    }

    // Revenue by month
    const revenueByMonth = {};
    transactions.forEach(t => {
      const month = new Date(t.createdAt).toLocaleString('id-ID', { month: 'long', year: 'numeric' });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + t.total_bayar;
    });

    // Payment method distribution
    const paymentMethods = {};
    transactions.forEach(t => {
      paymentMethods[t.metode_pembayaran] = (paymentMethods[t.metode_pembayaran] || 0) + 1;
    });

    // Fast moving items
    const itemSales = {};
    transactions.forEach(t => {
      t.items_dibeli.forEach(item => {
        itemSales[item.nama_barang] = (itemSales[item.nama_barang] || 0) + item.jumlah;
      });
    });

    const fastMovingItems = Object.entries(itemSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));

    // Service performance (most used services by revenue)
    const serviceRevenue = {};
    const serviceCount = {};
    transactions.forEach(t => {
      t.jasa_dikerjakan.forEach(jasa => {
        serviceRevenue[jasa.nama_jasa] = (serviceRevenue[jasa.nama_jasa] || 0) + jasa.harga;
        serviceCount[jasa.nama_jasa] = (serviceCount[jasa.nama_jasa] || 0) + 1;
      });
    });

    const servicePerformance = Object.entries(serviceRevenue)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, revenue]) => ({ name, revenue, count: serviceCount[name] || 0 }));

    // Daily revenue trend for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const dailyRevenue = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo);
      d.setDate(thirtyDaysAgo.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      dailyRevenue[key] = { revenue: 0, count: 0 };
    }
    transactions.forEach(t => {
      const key = new Date(t.createdAt).toISOString().slice(0, 10);
      if (dailyRevenue[key] !== undefined) {
        dailyRevenue[key].revenue += t.total_bayar;
        dailyRevenue[key].count += 1;
      }
    });
    const dailyTrend = Object.entries(dailyRevenue)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        revenue: data.revenue,
        count: data.count,
      }));

    res.json({
      revenueByMonth,
      paymentMethods,
      fastMovingItems,
      servicePerformance,
      dailyTrend,
      totalRevenue: transactions.reduce((sum, t) => sum + t.total_bayar, 0),
      totalTransactions: transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getCustomerTransactions,
  getTransactionById,
  getAnalytics
};
