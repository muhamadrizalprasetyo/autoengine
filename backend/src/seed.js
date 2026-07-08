require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');
const Inventory = require('./models/Inventory');
const Booking = require('./models/Booking');
const Transaction = require('./models/Transaction');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/auto-engine');
    console.log('MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    await Inventory.deleteMany({});
    await Booking.deleteMany({});
    await Transaction.deleteMany({});

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new User({
      nama: 'Admin Owner',
      email: 'admin@autoengine.com',
      password: hashedPassword,
      no_wa: '081234567890',
      role: 'owner'
    });
    await admin.save();
    console.log('Admin user created');

    // Create cashier user
    const cashierPassword = await bcrypt.hash('cashier123', 10);
    const cashier = new User({
      nama: 'Kasir Bengkel',
      email: 'kasir@autoengine.com',
      password: cashierPassword,
      no_wa: '081234567891',
      role: 'cashier'
    });
    await cashier.save();
    console.log('Cashier user created');

    // Create services
    const services = [
      { nama_jasa: 'Ganti Oli', estimasi_waktu: '30 menit', harga_dasar: 150000, deskripsi: 'Ganti oli mesin dan filter oli' },
      { nama_jasa: 'Turun Mesin', estimasi_waktu: '3-5 hari', harga_dasar: 2000000, deskripsi: 'Servis turun mesin lengkap' },
      { nama_jasa: 'Ganti Kanvas Rem', estimasi_waktu: '1 jam', harga_dasar: 300000, deskripsi: 'Ganti kanvas rem depan dan belakang' },
      { nama_jasa: 'Tune Up', estimasi_waktu: '2 jam', harga_dasar: 250000, deskripsi: 'Tune up standar' },
      { nama_jasa: 'Spooring', estimasi_waktu: '1 jam', harga_dasar: 200000, deskripsi: 'Spooring dan balancing' }
    ];
    await Service.insertMany(services);
    console.log('Services created');

    // Create inventories
    const inventories = [
      { nama_barang: 'Oli Mesin 10W-40', stok_sisa: 20, harga_jual: 80000, limit_stok: 5, satuan: 'liter' },
      { nama_barang: 'Filter Oli', stok_sisa: 15, harga_jual: 50000, limit_stok: 3, satuan: 'pcs' },
      { nama_barang: 'Kanvas Rem Depan', stok_sisa: 10, harga_jual: 150000, limit_stok: 2, satuan: 'set' },
      { nama_barang: 'Kanvas Rem Belakang', stok_sisa: 10, harga_jual: 120000, limit_stok: 2, satuan: 'set' },
      { nama_barang: 'Busi', stok_sisa: 25, harga_jual: 35000, limit_stok: 5, satuan: 'pcs' },
      { nama_barang: 'Air Radiator', stok_sisa: 30, harga_jual: 25000, limit_stok: 10, satuan: 'liter' }
    ];
    await Inventory.insertMany(inventories);
    console.log('Inventories created');

    // Create dummy customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = new User({
      nama: 'Budi Santoso',
      email: 'budi@example.com',
      password: customerPassword,
      no_wa: '081234567892',
      role: 'customer'
    });
    await customer.save();
    console.log('Customer user created');

    // Get services for bookings
    const allServices = await Service.find();
    const inventoriesData = await Inventory.find();

    // Generate 100 random bookings and transactions spread across Jan 2026 - Jul 2026
    const bookings = [];
    const transactions = [];
    const paymentMethods = ['Tunai', 'BCA', 'BRI', 'QRIS'];
    const carBrands = ['Toyota', 'Honda', 'Mitsubishi', 'Suzuki', 'Daihatsu', 'Nissan'];
    const carTypes = ['Avanza', 'Civic', 'Xpander', 'Ertiga', 'Xenia', 'Livina'];
    
    // Generate dates between Jan 1, 2026 and July 7, 2026
    const start = new Date('2026-01-01').getTime();
    const end = new Date('2026-07-07').getTime();

    for (let i = 0; i < 100; i++) {
      const randomTime = start + Math.random() * (end - start);
      const randomDate = new Date(randomTime);
      
      const isWalkIn = Math.random() > 0.7; // 30% walk-in
      
      // Select 1-2 random services
      const selectedServices = [];
      const numServices = Math.floor(Math.random() * 2) + 1;
      let totalJasa = 0;
      for (let j = 0; j < numServices; j++) {
        const randomService = allServices[Math.floor(Math.random() * allServices.length)];
        if (!selectedServices.find(s => s._id === randomService._id)) {
          selectedServices.push(randomService);
          totalJasa += randomService.harga_dasar;
        }
      }

      // Select 0-3 random items
      const selectedItems = [];
      const numItems = Math.floor(Math.random() * 4);
      let totalBarang = 0;
      for (let j = 0; j < numItems; j++) {
        const randomItem = inventoriesData[Math.floor(Math.random() * inventoriesData.length)];
        if (!selectedItems.find(i => i.inventory_id === randomItem._id)) {
          const qty = Math.floor(Math.random() * 2) + 1;
          selectedItems.push({
            inventory_id: randomItem._id,
            nama_barang: randomItem.nama_barang,
            jumlah: qty,
            harga_satuan: randomItem.harga_jual,
            subtotal: randomItem.harga_jual * qty
          });
          totalBarang += randomItem.harga_jual * qty;
        }
      }

      let bookingId = null;
      if (!isWalkIn) {
        bookings.push({
          user_id: customer._id,
          no_pelat: `B ${Math.floor(Math.random() * 9000) + 1000} ${String.fromCharCode(65+Math.floor(Math.random()*26))}${String.fromCharCode(65+Math.floor(Math.random()*26))}`,
          jenis_mobil: carTypes[Math.floor(Math.random() * carTypes.length)],
          merek_mobil: carBrands[Math.floor(Math.random() * carBrands.length)],
          layanan: selectedServices.map(s => s._id),
          tanggal: randomDate,
          status_pengerjaan: 'Selesai',
          catatan: 'Regular service',
          createdAt: randomDate,
          updatedAt: randomDate
        });
        // We need to wait to insert bookings to get their IDs, so we'll do this slightly differently.
      }
    }
    
    const createdBookings = await Booking.insertMany(bookings);
    console.log(`${createdBookings.length} Bookings created`);

    // Now loop again to create transactions based on dates and bookings
    let bookingIndex = 0;
    for (let i = 0; i < 100; i++) {
      const randomTime = start + Math.random() * (end - start);
      const randomDate = new Date(randomTime);
      
      const isWalkIn = bookingIndex >= createdBookings.length ? true : Math.random() > (createdBookings.length / 100);
      
      let currentBooking = null;
      let txDate = randomDate;

      if (!isWalkIn && bookingIndex < createdBookings.length) {
        currentBooking = createdBookings[bookingIndex];
        txDate = currentBooking.tanggal; // Match transaction date to booking date
        bookingIndex++;
      }

      // Generate items and services for this transaction
      const selectedServices = [];
      const numServices = Math.floor(Math.random() * 2) + 1;
      let totalJasa = 0;
      for (let j = 0; j < numServices; j++) {
        const randomService = allServices[Math.floor(Math.random() * allServices.length)];
        if (!selectedServices.find(s => s._id === randomService._id)) {
          selectedServices.push({
            service_id: randomService._id,
            nama_jasa: randomService.nama_jasa,
            harga: randomService.harga_dasar
          });
          totalJasa += randomService.harga_dasar;
        }
      }

      const selectedItems = [];
      const numItems = Math.floor(Math.random() * 4);
      let totalBarang = 0;
      for (let j = 0; j < numItems; j++) {
        const randomItem = inventoriesData[Math.floor(Math.random() * inventoriesData.length)];
        if (!selectedItems.find(item => item.inventory_id === randomItem._id)) {
          const qty = Math.floor(Math.random() * 2) + 1;
          selectedItems.push({
            inventory_id: randomItem._id,
            nama_barang: randomItem.nama_barang,
            jumlah: qty,
            harga_satuan: randomItem.harga_jual,
            subtotal: randomItem.harga_jual * qty
          });
          totalBarang += randomItem.harga_jual * qty;
        }
      }

      const randomInvoiceNumber = `INV-${txDate.getFullYear()}${(txDate.getMonth()+1).toString().padStart(2, '0')}${txDate.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      transactions.push({
        booking_id: currentBooking ? currentBooking._id : null,
        is_walk_in: !currentBooking,
        walk_in_customer: !currentBooking ? {
          nama: 'Walk-in Customer ' + i,
          no_wa: '08' + Math.floor(Math.random() * 1000000000),
          no_pelat: `B ${Math.floor(Math.random() * 9000) + 1000} XYZ`
        } : null,
        items_dibeli: selectedItems,
        jasa_dikerjakan: selectedServices,
        total_bayar: totalJasa + totalBarang,
        metode_pembayaran: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status_pembayaran: 'Lunas',
        invoice_number: randomInvoiceNumber,
        kasir_id: cashier._id,
        createdAt: txDate,
        updatedAt: txDate
      });
    }

    await Transaction.insertMany(transactions);
    console.log('Transactions created');

    console.log('Seed data completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
