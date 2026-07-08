import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Search, Filter, History } from 'lucide-react';
import axios from 'axios';

const CustomerHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/transactions/customer');
      setHistory(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Riwayat Servis</h1>
          <p className="text-neutral-600 mt-1">Daftar semua servis kendaraan yang telah selesai</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Cari plat nomor..." 
              className="input-field pl-9 w-full md:w-64"
            />
          </div>
          <button className="btn-secondary px-3 py-2 flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="card">
        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-neutral-400" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Belum Ada Riwayat Servis</h2>
            <p className="text-neutral-600 max-w-md mx-auto">
              Anda belum memiliki riwayat servis yang selesai dikerjakan. 
              Riwayat akan otomatis muncul setelah kendaraan Anda selesai diservis.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="text-xs uppercase bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 font-bold">Tanggal</th>
                  <th className="px-6 py-4 font-bold">Kendaraan</th>
                  <th className="px-6 py-4 font-bold">Layanan</th>
                  <th className="px-6 py-4 font-bold text-right">Total Biaya</th>
                  <th className="px-6 py-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900">{item.booking_id?.no_pelat || '-'}</div>
                      <div className="text-xs text-neutral-500">{item.booking_id?.jenis_mobil}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {item.jasa_dikerjakan?.length > 0 ? (
                          item.jasa_dikerjakan.map(srv => (
                            <span key={srv.service_id || srv._id} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                              {srv.nama_jasa}
                            </span>
                          ))
                        ) : (
                          <span className="text-neutral-400 text-xs italic">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-neutral-900 text-right">
                      Rp {item.total_bayar?.toLocaleString('id-ID') || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors text-xs font-medium"
                        onClick={() => alert('Fitur Invoice Digital Segera Hadir')}
                      >
                        <FileText className="w-4 h-4" />
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHistory;
