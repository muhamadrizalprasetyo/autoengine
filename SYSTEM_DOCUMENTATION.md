# Auto Engine - Sistem Manajemen Bengkel Otomotif
## Dokumentasi Sistem & UI untuk Design di Stitch

---

## 1. Overview Sistem

**Nama:** Auto Engine  
**Tipe:** Sistem Manajemen Bengkel Otomotif  
**Arsitektur:** Monorepo (Frontend + Backend terpisah)  
**Tech Stack:**
- **Backend:** Node.js, Express.js, MongoDB, Socket.io
- **Frontend:** React, Vite, Tailwind CSS, Lucide React Icons
- **Real-time:** Socket.io untuk update booking status
- **Authentication:** JWT (JSON Web Token)

---

## 2. Struktur Project

```
auto engine/
├── backend/
│   ├── src/
│   │   ├── controllers/     (bookingController, transactionController, dll)
│   │   ├── models/          (Booking, Transaction, User, Service, Inventory)
│   │   ├── routes/          (API routes)
│   │   ├── middleware/      (auth middleware)
│   │   ├── seed.js          (dummy data)
│   │   └── server.js        (entry point)
│   └── uploads/             (file uploads)
├── frontend/
│   ├── src/
│   │   ├── components/      (reusable components)
│   │   ├── context/         (AuthContext, SocketContext)
│   │   ├── pages/           (halaman-halaman utama)
│   │   └── main.jsx         (entry point)
│   └── public/              (assets, logo)
```

---

## 3. Database Schema

### 3.1 User Model
```javascript
{
  nama: String,
  email: String (unique),
  password: String (hashed),
  no_wa: String,
  role: enum ['owner', 'admin', 'kasir', 'customer']
}
```

### 3.2 Service Model
```javascript
{
  nama_jasa: String,
  deskripsi: String,
  estimasi_waktu: String,
  harga_dasar: Number
}
```

### 3.3 Inventory Model
```javascript
{
  nama_barang: String,
  kategori: String,
  stok_sisa: Number,
  limit_stok: Number,
  harga_beli: Number,
  harga_jual: Number
}
```

### 3.4 Booking Model
```javascript
{
  user_id: ObjectId (ref: User),
  no_pelat: String,
  jenis_mobil: String,
  merek_mobil: String,
  layanan: [ObjectId] (ref: Service),
  tanggal: Date,
  status_pengerjaan: enum ['Menunggu', 'Sedang Dikerjakan', 'Menunggu Pembayaran', 'Dibayar', 'Selesai'],
  foto_mobil: String,
  catatan: String,
  estimasi_harga: Number,
  dp_amount: Number,
  metode_pembayaran_booking: enum ['Lunas Nanti', 'DP', 'Full Payment'],
  items_tambahan: [{
    inventory_id: ObjectId,
    nama_barang: String,
    jumlah: Number,
    harga_satuan: Number,
    subtotal: Number
  }]
}
```

### 3.5 Transaction Model
```javascript
{
  booking_id: ObjectId (ref: Booking, optional),
  items_dibeli: [{
    inventory_id: ObjectId,
    nama_barang: String,
    jumlah: Number,
    harga_satuan: Number,
    subtotal: Number
  }],
  jasa_dikerjakan: [{
    service_id: ObjectId,
    nama_jasa: String,
    harga: Number
  }],
  total_bayar: Number,
  metode_pembayaran: enum ['Tunai', 'BCA', 'BRI', 'QRIS'],
  status_pembayaran: enum ['Lunas', 'DP', 'Pending', 'Batal'],
  bukti_pembayaran: String,
  invoice_number: String (unique),
  kasir_id: ObjectId (ref: User),
  is_walk_in: Boolean,
  walk_in_customer: {
    nama: String,
    no_wa: String,
    no_pelat: String
  }
}
```

---

## 4. Flow Booking & Transaksi

### 4.1 Flow Booking (Customer)
```
1. Customer login → Customer Dashboard
2. Klik "Booking Baru" → BookingForm
3. Input data kendaraan (no pelat, jenis, merek)
4. Pilih layanan → estimasi harga ditampilkan
5. Pilih metode pembayaran (Lunas Nanti / DP / Full Payment)
6. Upload foto mobil (opsional)
7. Submit → Booking dibuat dengan status "Menunggu"
8. Redirect ke Customer Dashboard
```

### 4.2 Flow Admin/Kasir (Booking Management)
```
1. Login → Admin Dashboard (Kanban Board)
2. Kolom 1: Menunggu → klik "Mulai Kerjakan" → status "Sedang Dikerjakan"
3. Kolom 2: Sedang Dikerjakan → klik "Proses Pembayaran" → status "Menunggu Pembayaran"
4. Kolom 3: Menunggu Pembayaran → klik "Bayar Sekarang" → buka POS
5. Kolom 4: Dibayar → klik "Selesai & Ambil" → status "Selesai"
6. Kolom 5: Selesai → history booking
```

### 4.3 Flow POS (Point of Sale)
```
Mode 1: Dari Booking
- Booking info sudah terisi
- Tambah item inventaris ke cart
- Pilih layanan (sudah terisi dari booking)
- Pilih metode pembayaran
- Pilih status pembayaran (Lunas/DP/Pending)
- Checkout → Transaction dibuat
- Booking status update ke "Dibayar" (jika Lunas) atau "Menunggu Pembayaran" (jika DP)

Mode 2: Walk-In
- Input data pelanggan walk-in (nama, no wa, no pelat)
- Pilih layanan
- Tambah item inventaris
- Pilih metode pembayaran
- Pilih status pembayaran
- Checkout → Transaction dibuat (tanpa booking_id)
```

---

## 5. Role-Based Access Control

### 5.1 Owner
- **Dashboard:** Owner Dashboard (analytics, charts)
- **Fitur:** Lihat analitik pendapatan, transaksi, inventory fast-moving

### 5.2 Admin
- **Dashboard:** Admin Dashboard (Kanban Board booking)
- **Fitur:** Kelola booking, update status, buka POS

### 5.3 Kasir
- **Dashboard:** Admin Dashboard (sama dengan admin)
- **Fitur:** Kelola booking, update status, buka POS

### 5.4 Customer
- **Dashboard:** Customer Dashboard
- **Fitur:** Lihat booking history, buat booking baru

---

## 6. Design System & UI Components

### 6.1 Color Palette (Tailwind Config)
```javascript
{
  primary: '#DC2626',      // Merah (accent color)
  secondary: '#64748B',    // Slate gray
  dark: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    // ... (similar to dark)
  },
  accent: '#DC2626',        // Same as primary
  success: '#22C55E',       // Green
  warning: '#F59E0B',       // Orange/Yellow
  info: '#3B82F6',          // Blue
  danger: '#EF4444',        // Red
}
```

### 6.2 Reusable Components

#### StatsCard
```jsx
<StatsCard
  title="Total Pendapatan"
  value="Rp 2.010.000"
  icon={DollarSign}
  color="primary"  // primary, secondary, success, warning, info, danger
/>
```

#### Badge
```jsx
<Badge variant="success" size="sm">
  Selesai
</Badge>
// Variants: default, primary, success, warning, info, danger
// Sizes: sm, md, lg
```

#### Table
```jsx
<Table
  columns={[
    { key: 'no_pelat', label: 'No. Pelat', align: 'left' },
    { key: 'merek_mobil', label: 'Merek', align: 'left' },
  ]}
  data={bookings}
  onRowClick={(row) => console.log(row)}
/>
```

### 6.3 Global Styles (CSS Classes)

#### Buttons
```css
.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded-lg font-medium
         hover:bg-primary/90 transition-colors;
}

.btn-secondary {
  @apply bg-dark-700 text-gray-300 px-4 py-2 rounded-lg font-medium
         hover:bg-dark-600 transition-colors;
}
```

#### Inputs
```css
.input {
  @apply w-full px-4 py-2 rounded-lg bg-dark-700 border border-dark-600
         text-white placeholder-gray-400 focus:outline-none focus:border-primary;
}
```

#### Cards
```css
.card {
  @apply bg-dark-800 rounded-xl p-6 border border-dark-700;
}
```

---

## 7. Halaman-Halaman Utama

### 7.1 Login Page
- Logo: `/logo_login.png`
- Input: Email, Password
- Button: Login
- Redirect ke dashboard berdasarkan role

### 7.2 Register Page
- Logo: `/logo_login.png`
- Input: Nama, Email, Password, No. WhatsApp
- Button: Register
- Redirect ke Customer Dashboard

### 7.3 Layout (Sidebar + Navbar)
- **Sidebar:**
  - Logo: `/logo_panjang.png`
  - Menu items berdasarkan role
  - Active state dengan warna primary
  - Hover: expand sidebar
- **Navbar:**
  - Logo di tengah
  - User avatar (background primary)
  - Notification badge

### 7.4 Owner Dashboard
- **Stats Cards:** Total Pendapatan, Total Transaksi, Rata-rata Transaksi, Stok Menipis
- **Charts:**
  - Revenue by Month (Bar Chart)
  - Payment Method Distribution (Pie Chart)
  - Fast Moving Items (Bar Chart)
- **Filter:** Date range

### 7.5 Admin Dashboard (Kanban Board)
- **5 Kolom:**
  1. Menunggu (yellow)
  2. Sedang Dikerjakan (blue)
  3. Menunggu Bayar (orange)
  4. Dibayar (purple)
  5. Selesai (green)
- **Booking Card:**
  - No. Pelat
  - Kendaraan (merek + jenis)
  - Pelanggan
  - Layanan (tags)
  - Estimasi harga (jika ada)
  - Action buttons

### 7.6 Booking Form
- **Vehicle Info:** No. Pelat, Jenis Mobil, Merek Mobil, Tanggal
- **Services:** Grid selection dengan harga
- **Estimated Price:** Tampilkan total estimasi
- **Payment Method:** Dropdown (Lunas Nanti / DP / Full Payment)
- **DP Amount:** Input jika pilih DP
- **Photo Upload:** File input (opsional)
- **Notes:** Textarea (opsional)

### 7.7 Customer Dashboard
- **Stats:** Total Booking, Booking in Progress, Completed
- **Booking List:** Table dengan status badges
- **Action:** Button "Booking Baru"

### 7.8 POS (Point of Sale)
- **Mode Toggle:** Booking / Walk-In
- **Booking Info / Walk-In Form**
- **Inventory Grid:** Add to cart dengan quantity
- **Services Selection:** Checkbox
- **Cart:**
  - Items list dengan quantity control
  - Services list
  - Total calculation
  - Payment method dropdown
  - Payment status dropdown
  - Checkout button

### 7.9 Inventory Management
- **Stats:** Total Item, Total Nilai Stok, Stok Menipis
- **Table:** Nama, Kategori, Stok, Harga Beli, Harga Jual, Limit Stok
- **Actions:** Add, Edit, Delete, Search, Sort

### 7.10 Transaction History
- **Stats:** Total Transaksi, Total Pendapatan, Transaksi Hari Ini
- **Table:** Invoice No, Pelanggan, Total, Metode, Status, Tanggal
- **Filter:** Payment method, Search (plate/name), Sort by date
- **Detail Modal:** Full transaction details

---

## 8. Icon System

**Icon Library:** Lucide React (outline style)  
**Standardization:** Semua icon menggunakan outline style, warna sesuai konteks

**Common Icons:**
- Dashboard: `LayoutDashboard`
- Booking: `Calendar`
- POS: `ShoppingCart`
- Inventory: `Package`
- Transaction: `Receipt`
- User: `User`
- Settings: `Settings`
- Logout: `LogOut`
- Add: `Plus`
- Edit: `Pencil`
- Delete: `Trash2`
- Check: `CheckCircle`
- Clock: `Clock`
- Car: `Car`
- Credit Card: `CreditCard`
- Dollar: `DollarSign`

---

## 9. Real-time Features

**Socket.io Events:**
- `new_booking`: Trigger saat booking baru dibuat
- `booking_status_changed`: Trigger saat status booking diupdate
- `new_transaction`: Trigger saat transaction baru dibuat
- `low_stock`: Trigger saat inventory stok menipis

**Auto-refresh:**
- Admin Dashboard auto-refresh saat ada event booking/transaction
- Customer Dashboard auto-refresh saat booking status berubah

---

## 10. Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Adaptations:**
- Sidebar: Fixed drawer (toggle dengan hamburger menu)
- Grid: 1 column
- Tables: Horizontal scroll
- Forms: Stacked inputs

---

## 11. API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Bookings
- `GET /api/bookings` - Get all bookings (filtered by role)
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/photo` - Upload car photo

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/analytics` - Get transaction analytics

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin only)
- `PUT /api/services/:id` - Update service (admin only)
- `DELETE /api/services/:id` - Delete service (admin only)

### Inventory
- `GET /api/inventories` - Get all inventories
- `POST /api/inventories` - Create inventory (admin only)
- `PUT /api/inventories/:id` - Update inventory (admin only)
- `DELETE /api/inventories/:id` - Delete inventory (admin only)

---

## 12. Test Accounts

**Owner:**
- Email: admin@autoengine.com
- Password: admin123

**Kasir:**
- Email: kasir@autoengine.com
- Password: cashier123

**Customer:**
- Email: budi@example.com
- Password: customer123

---

## 13. Notes untuk Design di Stitch

### 13.1 Theme
- **Style:** Industrial minimalist
- **Dominant Color:** Dark slate (dark mode)
- **Accent Color:** Red (#DC2626)
- **Vibe:** Professional, clean, automotive

### 13.2 Layout Pattern
- **Dashboard:** Sidebar (left) + Main Content (right)
- **Kanban:** Horizontal scroll untuk banyak kolom
- **Forms:** Vertical stacked dengan clear labels
- **Tables:** Clean dengan action buttons di kolom terakhir

### 13.3 Typography
- **Headings:** Bold, dark/light based on theme
- **Body:** Regular, readable
- **Labels:** Small, uppercase, muted color
- **Numbers:** Monospace untuk harga/angka

### 13.4 Spacing
- **Padding:** 16px - 24px untuk cards
- **Gap:** 16px - 24px untuk grid
- **Margin:** 8px - 16px untuk elements

### 13.5 Border Radius
- **Cards:** 12px - 16px
- **Buttons:** 8px
- **Inputs:** 8px
- **Badges:** 4px - 6px

### 13.6 Shadows
- **Cards:** Subtle shadow untuk depth
- **Modals:** Stronger shadow untuk focus
- **Buttons:** No shadow (flat design)

### 13.7 Interactive Elements
- **Hover:** Slight color change or opacity
- **Active:** Primary color highlight
- **Focus:** Border color change to primary
- **Loading:** Spinner animation

---

## 14. Future Enhancements (Optional)

- WhatsApp notification integration
- Email notification for booking confirmation
- PDF invoice generation
- Barcode/QR code for transactions
- Multi-location support
- Appointment scheduling calendar
- Customer loyalty program
- Service history tracking per vehicle
- Parts recommendation system
- Technician assignment system

---

## 15. Technical Notes

- **MongoDB Connection:** Local MongoDB instance
- **File Uploads:** Local storage di `/backend/uploads`
- **Socket.io:** Server running on port 5000
- **Frontend Proxy:** Vite proxy ke backend `/api`
- **JWT Secret:** Environment variable
- **CORS:** Enabled untuk development

---

## 16. Deployment Notes

**Frontend:** Vercel (recommended)  
**Backend:** Railway (recommended)  
**Database:** MongoDB Atlas (recommended)  
**File Storage:** Cloudinary (recommended for production)

---

*Last Updated: July 2026*  
*Version: 1.0*
