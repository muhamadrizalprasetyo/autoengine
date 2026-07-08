import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CreditCard, AlertCircle, Receipt, ArrowRight } from 'lucide-react';
import axios from 'axios';

const CustomerBilling = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get('/api/bookings');
      const data = response.data.data || response.data;
      // Filter for bookings waiting for payment (could also include 'Menunggu' if they need to pay DP)
      const unpaid = data.filter(b => b.status_pengerjaan === 'Menunggu Pembayaran' || (b.status_pengerjaan === 'Menunggu' && b.metode_pembayaran_booking !== 'Lunas Nanti'));
      setBills(unpaid);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Tagihan & Pembayaran</h1>
        <p className="text-neutral-600 mt-1">Selesaikan pembayaran untuk melanjutkan proses atau mengambil kendaraan Anda</p>
      </div>

      {bills.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <Receipt className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Tidak Ada Tagihan Aktif</h2>
          <p className="text-neutral-600">Semua tagihan Anda sudah lunas. Terima kasih!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bills.map((bill) => (
            <div key={bill._id} className="card border-2 border-orange-100 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-10"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 mb-3">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Belum Lunas
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900 uppercase">{bill.no_pelat}</h2>
                  <p className="text-sm text-neutral-600">{bill.merek_mobil} {bill.jenis_mobil}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500 mb-1">Total Tagihan</p>
                  <p className="text-2xl font-black text-neutral-900">
                    Rp {(bill.estimasi_harga || 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-bold text-neutral-900 mb-3 border-b border-neutral-200 pb-2">Rincian Layanan</p>
                <div className="space-y-2">
                  {bill.layanan?.map((srv) => (
                    <div key={srv._id} className="flex justify-between text-sm">
                      <span className="text-neutral-600">{srv.nama_jasa}</span>
                    </div>
                  ))}
                  {(!bill.layanan || bill.layanan.length === 0) && (
                    <span className="text-neutral-500 text-sm italic">Belum ada rincian jasa</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-neutral-900 mb-3">Pilih Metode Pembayaran</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button className="flex items-center justify-center gap-2 p-3 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_QRIS.svg" alt="QRIS" className="h-6" />
                  </button>
                  <button className="flex items-center justify-center gap-2 p-3 border border-neutral-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-sm font-bold text-blue-800">
                    BCA Virtual Account
                  </button>
                </div>
                
                <button 
                  className="btn-primary w-full flex justify-center items-center gap-2 py-3"
                  onClick={() => alert('Simulasi Pembayaran Berhasil!')}
                >
                  <CreditCard className="w-5 h-5" />
                  Bayar Sekarang
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBilling;
