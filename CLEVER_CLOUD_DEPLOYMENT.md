# Strategi Deployment Clever Cloud: Auto Engine

Karena sistem ini menggunakan arsitektur Monorepo (Frontend React/Vite dan Backend Node.js dalam satu repository), Clever Cloud membutuhkan penanganan khusus. Berikut adalah strategi terbaik untuk mendeploy aplikasi ini agar stabil, aman, dan mudah di-scale.

## Opsi 1: Pemisahan Aplikasi (Sangat Direkomendasikan) 🌟
Strategi terbaik adalah membuat **2 Aplikasi terpisah** di dalam console Clever Cloud:
1. **Node.js Application** (Untuk Backend)
2. **Cellar / Static Application** (Untuk Frontend Vite)

### Langkah A: Deploy Backend (Node.js)
1. Buat aplikasi baru di Clever Cloud, pilih tipe **Node.js**.
2. Hubungkan dengan repository GitHub Anda.
3. Buka menu **Environment Variables** di Clever Cloud dan tambahkan:
   - `CC_NODE_BUILD_TOOL=npm`
   - `APP_FOLDER=backend` *(Sangat Penting! Ini memberi tahu Clever Cloud bahwa backend ada di folder `/backend`)*
   - `PORT=8080`
   - `MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/auto-engine`
   - `JWT_SECRET=rahasia_anda_yang_sangat_panjang`
   - `CLOUDINARY_CLOUD_NAME=xxx`
   - `CLOUDINARY_API_KEY=xxx`
   - `CLOUDINARY_API_SECRET=xxx`
   - `FRONTEND_URL=https://<domain-frontend-anda>.cleverapps.io`
4. Deploy! Clever Cloud otomatis menjalankan `npm start` (yang sudah terdefinisi menjalankan `node src/server.js`).

### Langkah B: Deploy Frontend (Static)
1. Buat aplikasi baru, pilih tipe **Static** (atau Node.js dengan pre-build).
2. Hubungkan ke repo yang sama.
3. Di **Environment Variables**:
   - `APP_FOLDER=frontend`
   - `CC_PRE_BUILD_HOOK=npm install && npm run build`
   - `CC_WEBROOT=/dist` *(Menandakan folder public yang akan di-serve)*
   - `VITE_API_URL=https://<domain-backend-anda>.cleverapps.io`

---

## Opsi 2: Single App Deployment (Backend menyajikan Frontend)
Jika ingin menghemat biaya dan hanya menjalankan **1 Aplikasi Node.js**, Anda harus menyuruh Express.js (backend) untuk men-serve file statis React.

**Syarat Tambahan:**
1. Di `backend/src/server.js`, Anda harus menambahkan kode:
   ```javascript
   const path = require('path');
   app.use(express.static(path.join(__dirname, '../../frontend/dist')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
   });
   ```
2. Di **Environment Variables** Clever Cloud:
   - `CC_PRE_BUILD_HOOK=cd frontend && npm install && npm run build && cd ../backend && npm install`
   - `APP_FOLDER=backend`

**Kekurangan Opsi 2:** 
Performa aplikasi bisa terganggu karena Node.js harus melayani file statis (`.js`, `.css`, gambar) sekaligus memproses API dan Socket.io. Opsi 1 jauh lebih cepat karena file statis dilayani langsung oleh *Reverse Proxy* / Nginx milik Clever Cloud.

---

## 📌 Checklist Tambahan Sebelum Deploy
- [ ] **MongoDB Atlas:** Jangan gunakan MongoDB add-on bawaan yang non-replica set jika memungkinkan, karena fitur *Transaction* yang baru kita buat membutuhkan Replica Set aktif. MongoDB Atlas gratis (Tier M0) sudah menggunakan Replica Set.
- [ ] **Domain:** Pastikan `FRONTEND_URL` di backend sama persis dengan domain frontend (tanpa *trailing slash* `/` di belakang) agar aturan **CORS** dan **Socket.io** tidak memblokir koneksi.
