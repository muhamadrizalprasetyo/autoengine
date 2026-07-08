# Auto Engine Car Service - Sistem Manajemen Bengkel

Sistem manajemen dan reservasi bengkel mobil dengan fitur lengkap untuk pelanggan, kasir, dan pemilik.

## Tech Stack

- **Frontend**: React.js + Vite + TailwindCSS + Lucide Icons
- **Backend**: Node.js + Express.js (MVC Architecture)
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Charts**: Recharts
- **Storage**: Local (Multer)

## Fitur Utama

### Untuk Pelanggan (Customer)
- Landing page publik
- Registrasi dan login
- Booking servis online
- Upload foto mobil
- Dashboard riwayat servis (logbook)
- Notifikasi real-time

### Untuk Kasir (Cashier)
- Dashboard manajemen antrean live
- Update status pengerjaan
- Point of Sale (POS) system
- Manajemen inventaris
- Input pembayaran manual (Tunai/BCA/BRI/QRIS)
- Notifikasi stok menipis

### Untuk Pemilik (Owner)
- Dashboard analitik bisnis
- Grafik pendapatan bulanan
- Distribusi metode pembayaran
- Produk fast-moving
- Laporan keuangan

## Instalasi

### Prasyarat
- Node.js (v18+)
- MongoDB (local atau Atlas)
- npm atau yarn

### Langkah-langkah

1. Clone repository
```bash
cd "c:\Users\Rizal\Documents\Project\auto engine"
```

2. Install dependencies (root)
```bash
npm install
```

3. Install dependencies untuk backend dan frontend
```bash
npm install --workspace=backend
npm install --workspace=frontend
```

4. Setup environment variables
```bash
# Copy file .env.example di backend ke .env
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auto-engine
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Seed data awal
```bash
cd backend
npm run seed
```

6. Jalankan aplikasi
```bash
# Dari root directory
npm run dev
```

Atau jalankan secara terpisah:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

7. Buka browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Akun Default

Setelah seed data, akun berikut tersedia:

### Admin Owner
- Email: `admin@autoengine.com`
- Password: `admin123`
- Role: Owner
- Dashboard: `/owner`

### Kasir
- Email: `kasir@autoengine.com`
- Password: `cashier123`
- Role: Cashier
- Dashboard: `/admin`

### Pelanggan
- Daftar melalui halaman `/register`
- Role: Customer
- Dashboard: `/customer`

## Struktur Project

```
auto-engine/
├── backend/
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Service.js
│   │   │   ├── Inventory.js
│   │   │   ├── Booking.js
│   │   │   └── Transaction.js
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── server.js       # Entry point
│   │   └── seed.js         # Seed data
│   ├── uploads/            # Local image storage
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile user

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (admin) / user's bookings (customer)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update status pengerjaan
- `POST /api/bookings/:id/photo` - Upload foto mobil

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (owner only)
- `PUT /api/services/:id` - Update service (owner only)
- `DELETE /api/services/:id` - Delete service (owner only)

### Inventories
- `GET /api/inventories` - Get all inventories
- `POST /api/inventories` - Create inventory (cashier/owner)
- `PUT /api/inventories/:id` - Update inventory (cashier/owner)
- `DELETE /api/inventories/:id` - Delete inventory (owner only)

### Transactions
- `POST /api/transactions` - Create transaction (cashier/owner)
- `GET /api/transactions` - Get all transactions (cashier/owner)
- `GET /api/transactions/:id` - Get transaction by ID
- `GET /api/transactions/analytics/data` - Get analytics data (owner only)

## Socket Events

- `new_booking` - Notifikasi booking baru
- `booking_status_changed` - Notifikasi perubahan status booking
- `new_transaction` - Notifikasi transaksi baru
- `low_stock` - Notifikasi stok menipis

## Deployment

### Frontend (Vercel)
1. Push ke GitHub
2. Connect repository ke Vercel
3. Set environment variables:
   - `VITE_API_URL`: URL backend ( Railway)

### Backend (Railway)
1. Push ke GitHub
2. Connect repository ke Railway
3. Set environment variables:
   - `PORT`: 5000
   - `MONGODB_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Secret key untuk JWT
   - `FRONTEND_URL`: URL frontend (Vercel)

## Catatan Penting

- Untuk production, ganti local storage dengan Cloudinary atau S3 untuk upload gambar
- Payment gateway (Midtrans/Xendit) dapat diintegrasikan di masa depan
- WhatsApp API (Twilio/Business API) dapat diintegrasikan untuk notifikasi otomatis
- Pastikan MongoDB service berjalan sebelum menjalankan aplikasi

## License

MIT
