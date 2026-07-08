import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Receipt,
  Search,
  Eye,
  X,
  Calendar,
  CreditCard,
  User,
  ChevronUp,
  ChevronDown,
  DollarSign,
  ShoppingCart,
  Printer,
  MessageCircle,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Table from '../components/Table';
import Badge from '../components/Badge';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [detailModal, setDetailModal] = useState(null);
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getPaymentBadgeVariant = (method) => {
    const map = {
      Tunai: 'tunai',
      BCA: 'bca',
      BRI: 'bri',
      QRIS: 'qris',
    };
    return map[method] || 'default';
  };

  const getStatusBadgeVariant = (status) => {
    return status === 'Lunas' ? 'success' : 'warning';
  };

  const sendEreceipt = (transaction) => {
    const phone = transaction.booking_id?.user_id?.no_wa;
    if (!phone) {
      alert('Nomor WhatsApp pelanggan tidak tersedia.');
      return;
    }
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }
    
    const message = `Halo ${transaction.booking_id?.user_id?.nama || 'Kak'},
Terima kasih telah melakukan servis di *Auto Engine*.

Berikut adalah ringkasan tagihan Anda:
- Tanggal: ${formatDate(transaction.createdAt)}
- No. Pelat: ${transaction.booking_id?.no_pelat || '-'}
- Total Biaya: *${formatCurrency(transaction.total_bayar)}*
- Status: *LUNAS* (${transaction.metode_pembayaran})

Semoga kendaraannya nyaman digunakan kembali. Jangan lupa perhatikan jadwal servis berkala berikutnya ya!`;

    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Filter + search
  const displayed = transactions
    .filter((t) => {
      const booking = t.booking_id;
      const matchSearch =
        !search ||
        (booking?.no_pelat || '').toLowerCase().includes(search.toLowerCase()) ||
        (booking?.user_id?.nama || '').toLowerCase().includes(search.toLowerCase());
      const matchMethod = !filterMethod || t.metode_pembayaran === filterMethod;
      return matchSearch && matchMethod;
    })
    .sort((a, b) => {
      const dA = new Date(a.createdAt);
      const dB = new Date(b.createdAt);
      return sortDir === 'desc' ? dB - dA : dA - dB;
    });

  // Stats
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total_bayar, 0);
  const todayCount = transactions.filter(
    (t) => new Date(t.createdAt).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Riwayat Transaksi</h1>
        <p className="text-neutral-600 mt-1">Lihat semua transaksi POS yang telah dilakukan</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total Transaksi"
          value={transactions.length}
          icon={ShoppingCart}
          color="primary"
        />
        <StatsCard
          title="Total Pendapatan"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          color="primary"
        />
        <StatsCard
          title="Transaksi Hari Ini"
          value={todayCount}
          icon={Receipt}
          color="primary"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari no. pelat atau nama pelanggan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12"
            id="input-search-transaction"
          />
        </div>
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="input w-full sm:w-48"
          id="filter-payment-method"
        >
          <option value="">Semua Metode</option>
          <option value="Tunai">Tunai</option>
          <option value="BCA">BCA</option>
          <option value="BRI">BRI</option>
          <option value="QRIS">QRIS</option>
        </select>
        <button
          onClick={() => setSortDir(sortDir === 'desc' ? 'asc' : 'desc')}
          className="btn-secondary flex items-center gap-2 whitespace-nowrap"
        >
          <Calendar className="w-4 h-4" />
          <span>{sortDir === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          {sortDir === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <Table
          columns={[
            {
              key: 'tanggal',
              label: 'Tanggal',
              align: 'left',
              render: (value, row) => formatDate(row.createdAt),
            },
            {
              key: 'no_pelat',
              label: 'No. Pelat',
              align: 'left',
              render: (value, row) => row.booking_id?.no_pelat || '-',
            },
            {
              key: 'kasir',
              label: 'Kasir',
              align: 'left',
              render: (value, row) => (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-500" />
                  <span>{row.kasir_id?.nama || '-'}</span>
                </div>
              ),
            },
            {
              key: 'metode',
              label: 'Metode',
              align: 'center',
              render: (value, row) => (
                <Badge variant={getPaymentBadgeVariant(row.metode_pembayaran)} size="sm">
                  {row.metode_pembayaran}
                </Badge>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              align: 'center',
              render: (value, row) => (
                <Badge variant={getStatusBadgeVariant(row.status_pembayaran)} size="sm">
                  {row.status_pembayaran}
                </Badge>
              ),
            },
            {
              key: 'total',
              label: 'Total',
              align: 'right',
              render: (value, row) => formatCurrency(row.total_bayar),
            },
            {
              key: 'detail',
              label: 'Detail',
              align: 'center',
              render: (value, row) => (
                <button
                  onClick={() => setDetailModal(row)}
                  className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Lihat Detail"
                >
                  <Eye className="w-4 h-4" />
                </button>
              ),
            },
          ]}
          data={displayed}
        />
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:p-0 print:bg-transparent">
          
          {/* Screen UI */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-[fadeIn_0.2s_ease-out] max-h-[90vh] overflow-y-auto no-print">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-neutral-900">Detail Transaksi</h2>
              <button
                onClick={() => setDetailModal(null)}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-neutral-500">Tanggal</p>
                  <p className="font-medium text-neutral-900">{formatDate(detailModal.createdAt)}</p>
                </div>
                <div>
                  <p className="text-neutral-500">No. Pelat</p>
                  <p className="font-medium text-neutral-900">{detailModal.booking_id?.no_pelat || '-'}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Kasir</p>
                  <p className="font-medium text-neutral-900">{detailModal.kasir_id?.nama || '-'}</p>
                </div>
                <div>
                  <p className="text-neutral-500">Metode</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentBadgeVariant(detailModal.metode_pembayaran)}`}
                  >
                    {detailModal.metode_pembayaran}
                  </span>
                </div>
              </div>

              {/* Jasa */}
              {detailModal.jasa_dikerjakan && detailModal.jasa_dikerjakan.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-2">Jasa Dikerjakan</h3>
                  <div className="bg-neutral-50 rounded-lg overflow-hidden">
                    {detailModal.jasa_dikerjakan.map((jasa, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between px-4 py-3 border-b border-neutral-100 last:border-0"
                      >
                        <span className="text-sm text-neutral-700">{jasa.nama_jasa}</span>
                        <span className="text-sm font-medium text-neutral-900">
                          {formatCurrency(jasa.harga)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Items */}
              {detailModal.items_dibeli && detailModal.items_dibeli.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-700 mb-2">Sparepart / Barang</h3>
                  <div className="bg-neutral-50 rounded-lg overflow-hidden">
                    {detailModal.items_dibeli.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center px-4 py-3 border-b border-neutral-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm text-neutral-700">{item.nama_barang}</p>
                          <p className="text-xs text-neutral-500">
                            {item.jumlah} x {formatCurrency(item.harga_satuan)}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-neutral-900">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                <span className="text-lg font-bold text-neutral-900">Total Bayar</span>
                <span className="text-2xl font-bold text-accent">
                  {formatCurrency(detailModal.total_bayar)}
                </span>
              </div>

              {/* Actions Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-100 no-print">
                <button
                  onClick={() => window.print()}
                  className="btn-primary flex-1 flex items-center justify-center gap-2 py-3"
                >
                  <Printer className="w-5 h-5" />
                  <span>Cetak Struk</span>
                </button>
                <button
                  onClick={() => sendEreceipt(detailModal)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 py-3 text-green-600 border-green-200 hover:bg-green-50 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Kirim WA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Professional A4 Invoice Print UI */}
          <div className="hidden print:block print-area bg-white w-full max-w-4xl mx-auto text-black font-sans p-10">
             {/* Header */}
             <div className="flex justify-between items-start border-b-2 border-neutral-200 pb-8 mb-8">
               <div>
                 <h1 className="text-4xl font-black text-primary-600 tracking-tighter mb-2">AUTO ENGINE.</h1>
                 <p className="text-sm text-neutral-500">Jl. Otomotif Raya No. 88, Jakarta Selatan</p>
                 <p className="text-sm text-neutral-500">Telp: +62 812 3456 7890 | IG: @autoengine.id</p>
               </div>
               <div className="text-right">
                 <h2 className="text-3xl font-bold text-neutral-200 uppercase mb-2">INVOICE</h2>
                 <p className="text-sm font-semibold text-neutral-800">#{detailModal._id.substring(0, 8).toUpperCase()}</p>
                 <p className="text-sm text-neutral-500">{formatDate(detailModal.createdAt)}</p>
               </div>
             </div>
             
             {/* Info */}
             <div className="flex justify-between mb-10">
               <div>
                 <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Ditagihkan Kepada</p>
                 <p className="font-bold text-neutral-800 text-lg">{detailModal.booking_id?.user_id?.nama || 'Pelanggan Walk-In'}</p>
                 <p className="text-sm text-neutral-600">{detailModal.booking_id?.user_id?.no_wa || '-'}</p>
               </div>
               <div className="text-right">
                 <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Data Kendaraan</p>
                 <p className="font-bold text-neutral-800 text-lg">{detailModal.booking_id?.no_pelat || '-'}</p>
                 <p className="text-sm text-neutral-600">{detailModal.booking_id?.merek_mobil} {detailModal.booking_id?.jenis_mobil}</p>
               </div>
             </div>
             
             {/* Table */}
             <table className="w-full mb-8">
               <thead>
                 <tr className="border-b-2 border-neutral-900">
                   <th className="py-3 text-left text-sm font-bold text-neutral-800 uppercase">Deskripsi</th>
                   <th className="py-3 text-center text-sm font-bold text-neutral-800 uppercase">Qty</th>
                   <th className="py-3 text-right text-sm font-bold text-neutral-800 uppercase">Harga</th>
                   <th className="py-3 text-right text-sm font-bold text-neutral-800 uppercase">Subtotal</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-neutral-200">
                 {/* Jasa */}
                 {detailModal.jasa_dikerjakan?.map((jasa, idx) => (
                   <tr key={'j'+idx}>
                     <td className="py-4 text-sm text-neutral-800">
                       <p className="font-semibold">{jasa.nama_jasa}</p>
                       <p className="text-xs text-neutral-500">Jasa Servis</p>
                     </td>
                     <td className="py-4 text-sm text-center text-neutral-800">-</td>
                     <td className="py-4 text-sm text-right text-neutral-800">{formatCurrency(jasa.harga)}</td>
                     <td className="py-4 text-sm text-right font-semibold text-neutral-900">{formatCurrency(jasa.harga)}</td>
                   </tr>
                 ))}
                 {/* Items */}
                 {detailModal.items_dibeli?.map((item, idx) => (
                   <tr key={'i'+idx}>
                     <td className="py-4 text-sm text-neutral-800">
                       <p className="font-semibold">{item.nama_barang}</p>
                       <p className="text-xs text-neutral-500">Sparepart</p>
                     </td>
                     <td className="py-4 text-sm text-center text-neutral-800">{item.jumlah}</td>
                     <td className="py-4 text-sm text-right text-neutral-800">{formatCurrency(item.harga_satuan)}</td>
                     <td className="py-4 text-sm text-right font-semibold text-neutral-900">{formatCurrency(item.subtotal)}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
             
             {/* Totals */}
             <div className="flex justify-end mb-12">
               <div className="w-1/2">
                 <div className="flex justify-between py-2 border-b border-neutral-200">
                   <span className="text-sm font-semibold text-neutral-600">Subtotal</span>
                   <span className="text-sm font-bold text-neutral-900">{formatCurrency(detailModal.total_bayar)}</span>
                 </div>
                 <div className="flex justify-between py-2 border-b border-neutral-200">
                   <span className="text-sm font-semibold text-neutral-600">Metode Pembayaran</span>
                   <span className="text-sm font-bold text-neutral-900">{detailModal.metode_pembayaran}</span>
                 </div>
                 <div className="flex justify-between py-4 border-b-2 border-neutral-900">
                   <span className="text-lg font-black text-neutral-900">TOTAL</span>
                   <span className="text-2xl font-black text-primary-600">{formatCurrency(detailModal.total_bayar)}</span>
                 </div>
               </div>
             </div>
             
             {/* Footer */}
             <div className="text-center pt-8 border-t border-neutral-200">
               <p className="font-bold text-neutral-800 mb-1">Terima kasih atas kepercayaan Anda!</p>
               <p className="text-xs text-neutral-500">Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan.<br/>Untuk klaim garansi servis, harap lampirkan invoice ini.</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
