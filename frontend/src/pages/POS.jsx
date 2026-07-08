import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, DollarSign, User, Car } from 'lucide-react';
import axios from 'axios';

const POS = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  const [mode, setMode] = useState(booking ? 'booking' : 'walk-in');
  const [inventories, setInventories] = useState([]);
  const [cart, setCart] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Tunai');
  const [paymentStatus, setPaymentStatus] = useState('Lunas');
  const [loading, setLoading] = useState(false);
  const [walkInCustomer, setWalkInCustomer] = useState({
    nama: '',
    no_wa: '',
    no_pelat: ''
  });

  useEffect(() => {
    fetchInventories();
    fetchServices();
    if (booking) {
      setSelectedServices(booking.layanan || []);
      setMode('booking');
    } else {
      setMode('walk-in');
    }
  }, [booking]);

  const fetchInventories = async () => {
    try {
      const response = await axios.get('/api/inventories');
      setInventories(response.data);
    } catch (error) {
      console.error('Error fetching inventories:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const addToCart = (inventory) => {
    if (inventory.stok_sisa <= 0) {
      alert('Stok habis!');
      return;
    }
    
    const existingItem = cart.find(item => item.inventory_id === inventory._id);
    if (existingItem) {
      if (existingItem.jumlah >= inventory.stok_sisa) {
        alert('Stok tidak mencukupi!');
        return;
      }
      setCart(cart.map(item =>
        item.inventory_id === inventory._id
          ? { ...item, jumlah: item.jumlah + 1, subtotal: (item.jumlah + 1) * item.harga_satuan }
          : item
      ));
    } else {
      setCart([...cart, {
        inventory_id: inventory._id,
        nama_barang: inventory.nama_barang,
        jumlah: 1,
        harga_satuan: inventory.harga_jual,
        subtotal: inventory.harga_jual
      }]);
    }
  };

  const removeFromCart = (inventoryId) => {
    setCart(cart.filter(item => item.inventory_id !== inventoryId));
  };

  const updateQuantity = (inventoryId, delta) => {
    const item = cart.find(item => item.inventory_id === inventoryId);
    const inventory = inventories.find(inv => inv._id === inventoryId);
    
    if (!item || !inventory) return;
    
    const newQuantity = item.jumlah + delta;
    if (newQuantity <= 0) {
      removeFromCart(inventoryId);
      return;
    }
    
    if (newQuantity > inventory.stok_sisa) {
      alert('Stok tidak mencukupi!');
      return;
    }
    
    setCart(cart.map(item =>
      item.inventory_id === inventoryId
        ? { ...item, jumlah: newQuantity, subtotal: newQuantity * item.harga_satuan }
        : item
    ));
  };

  const calculateTotal = () => {
    const itemsTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.harga_dasar, 0);
    return itemsTotal + servicesTotal;
  };

  const handleCheckout = async () => {
    if (mode === 'booking' && !booking) {
      alert('Pilih booking terlebih dahulu!');
      navigate('/admin');
      return;
    }

    if (mode === 'walk-in') {
      if (!walkInCustomer.nama || !walkInCustomer.no_wa || !walkInCustomer.no_pelat) {
        alert('Lengkapi data pelanggan walk-in!');
        return;
      }
    }

    if (cart.length === 0 && selectedServices.length === 0) {
      alert('Tambahkan item atau layanan ke keranjang!');
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        items_dibeli: cart,
        jasa_dikerjakan: selectedServices.map(s => ({
          service_id: s._id,
          nama_jasa: s.nama_jasa,
          harga: s.harga_dasar
        })),
        total_bayar: calculateTotal(),
        metode_pembayaran: paymentMethod,
        status_pembayaran: paymentStatus,
        is_walk_in: mode === 'walk-in',
        walk_in_customer: mode === 'walk-in' ? walkInCustomer : null
      };

      if (mode === 'booking') {
        transactionData.booking_id = booking._id;
      }

      await axios.post('/api/transactions', transactionData);

      alert('Transaksi berhasil!');
      navigate('/transactions');
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Transaksi gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Point of Sale</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setMode('booking'); if (!booking) navigate('/admin'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'booking' ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
            }`}
          >
            Booking
          </button>
          <button
            onClick={() => setMode('walk-in')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'walk-in' ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
            }`}
          >
            Walk-In
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info */}
          {mode === 'booking' ? (
            booking ? (
              <div className="card shadow-sm border border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Booking Aktif</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Pelat Nomor</p>
                    <p className="text-neutral-900 font-semibold">{booking.no_pelat}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Kendaraan</p>
                    <p className="text-neutral-900 font-semibold">{booking.merek_mobil} {booking.jenis_mobil}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Pelanggan</p>
                    <p className="text-neutral-900 font-semibold">{booking.user_id?.nama}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">WhatsApp</p>
                    <p className="text-neutral-900 font-semibold">{booking.user_id?.no_wa}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm border border-neutral-200 text-center py-8">
                <p className="text-neutral-500 mb-4">Tidak ada booking yang dipilih</p>
                <button onClick={() => navigate('/admin')} className="btn-secondary">
                  Pilih Booking
                </button>
              </div>
            )
          ) : (
            <div className="card shadow-sm border border-neutral-200">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Data Pelanggan Walk-In</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-neutral-700 mb-1">Nama</label>
                  <input
                    type="text"
                    value={walkInCustomer.nama}
                    onChange={(e) => setWalkInCustomer({ ...walkInCustomer, nama: e.target.value })}
                    className="input"
                    placeholder="Nama pelanggan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={walkInCustomer.no_wa}
                    onChange={(e) => setWalkInCustomer({ ...walkInCustomer, no_wa: e.target.value })}
                    className="input"
                    placeholder="No. WhatsApp"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-700 mb-1">No. Pelat</label>
                  <input
                    type="text"
                    value={walkInCustomer.no_pelat}
                    onChange={(e) => setWalkInCustomer({ ...walkInCustomer, no_pelat: e.target.value })}
                    className="input"
                    placeholder="B 1234 ABC"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Inventory Items */}
          <div className="card shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Inventaris</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventories.map((inventory) => (
                <div
                  key={inventory._id}
                  className={`p-4 rounded-xl border transition-colors ${
                    inventory.stok_sisa <= inventory.limit_stok
                      ? 'border-red-200 bg-red-50'
                      : 'border-neutral-200 bg-white hover:border-primary-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-neutral-900">{inventory.nama_barang}</h3>
                    <span className={`text-sm ${
                      inventory.stok_sisa <= inventory.limit_stok ? 'text-red-500 font-bold' : 'text-neutral-500'
                    }`}>
                      Stok: {inventory.stok_sisa} {inventory.satuan}
                    </span>
                  </div>
                  <p className="text-primary-600 font-bold text-lg mb-3">
                    Rp {inventory.harga_jual.toLocaleString('id-ID')}
                  </p>
                  <button
                    onClick={() => addToCart(inventory)}
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-2"
                    disabled={inventory.stok_sisa <= 0}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-6">
          <div className="card shadow-sm border border-neutral-200">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <span>Keranjang</span>
            </h2>

            {/* Services */}
            {selectedServices.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-neutral-500 mb-2">Layanan</h3>
                {selectedServices.map((service) => (
                  <div key={service._id} className="flex justify-between items-center py-2 border-b border-neutral-100">
                    <span className="text-neutral-900 text-sm font-medium">{service.nama_jasa}</span>
                    <span className="text-primary-600 text-sm font-bold">
                      Rp {service.harga_dasar.toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Items */}
            {cart.length === 0 && selectedServices.length === 0 ? (
              <p className="text-neutral-400 text-center py-8">Keranjang kosong</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.inventory_id} className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-neutral-900 text-sm font-bold">{item.nama_barang}</h4>
                      <button
                        onClick={() => removeFromCart(item.inventory_id)}
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3 bg-white border border-neutral-200 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.inventory_id, -1)}
                          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 w-7 h-7 rounded flex items-center justify-center transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-neutral-900 font-medium w-4 text-center">{item.jumlah}</span>
                        <button
                          onClick={() => updateQuantity(item.inventory_id, 1)}
                          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-600 w-7 h-7 rounded flex items-center justify-center transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-primary-600 text-sm font-bold">
                        Rp {item.subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center mb-6">
                <span className="text-neutral-900 font-bold text-lg">Total</span>
                <span className="text-2xl font-black text-primary-600">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </span>
              </div>

              {/* Payment Method */}
              <div className="space-y-2 mb-4">
                <label className="block text-sm font-medium text-neutral-700">Metode Pembayaran</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="input border border-neutral-200"
                >
                  <option value="Tunai">Tunai</option>
                  <option value="BCA">Transfer BCA</option>
                  <option value="BRI">Transfer BRI</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>

              {/* Payment Status */}
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-neutral-700">Status Pembayaran</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="input border border-neutral-200"
                >
                  <option value="Lunas">Lunas</option>
                  <option value="DP">DP (Down Payment)</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <button
                onClick={handleCheckout}
                className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
                disabled={loading || (cart.length === 0 && selectedServices.length === 0)}
              >
                <CreditCard className="h-5 w-5" />
                <span>{loading ? 'Memproses...' : 'Bayar Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
