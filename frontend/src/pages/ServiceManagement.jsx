import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Wrench,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Save,
  Clock,
} from 'lucide-react';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    nama_jasa: '',
    estimasi_waktu: '',
    harga_dasar: '',
    deskripsi: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/services');
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setForm({ nama_jasa: '', estimasi_waktu: '', harga_dasar: '', deskripsi: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      nama_jasa: item.nama_jasa,
      estimasi_waktu: item.estimasi_waktu,
      harga_dasar: String(item.harga_dasar),
      deskripsi: item.deskripsi || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nama_jasa: form.nama_jasa,
      estimasi_waktu: form.estimasi_waktu,
      harga_dasar: Number(form.harga_dasar),
      deskripsi: form.deskripsi,
    };

    try {
      if (editingItem) {
        await axios.put(`/api/services/${editingItem._id}`, payload);
      } else {
        await axios.post('/api/services', payload);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      console.error('Error saving service:', err);
      alert(err.response?.data?.message || 'Gagal menyimpan layanan');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/services/${id}`);
      setDeleteConfirm(null);
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      alert(err.response?.data?.message || 'Gagal menghapus layanan');
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const filtered = services.filter((s) =>
    s.nama_jasa.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Manajemen Layanan</h1>
          <p className="text-neutral-600 mt-1">Kelola daftar jasa servis yang ditawarkan</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2" id="btn-add-service">
          <Plus className="w-5 h-5" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="card">
          <p className="text-sm text-neutral-600">Total Layanan</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{services.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-neutral-600">Rata-rata Harga</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">
            {services.length > 0
              ? formatCurrency(services.reduce((sum, s) => sum + s.harga_dasar, 0) / services.length)
              : 'Rp 0'}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Cari nama layanan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12"
          id="input-search-service"
        />
      </div>

      {/* Grid Cards */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Wrench className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
          <p className="text-neutral-500">Tidak ada layanan ditemukan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => (
            <div key={service._id} className="card group hover:border-accent/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-accent" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(service)}
                    className="p-2 text-neutral-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(service._id)}
                    className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-neutral-900 mb-1">{service.nama_jasa}</h3>
              {service.deskripsi && (
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{service.deskripsi}</p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{service.estimasi_waktu}</span>
                </div>
                <span className="text-lg font-bold text-accent">{formatCurrency(service.harga_dasar)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900">
                {editingItem ? 'Edit Layanan' : 'Tambah Layanan Baru'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nama Layanan</label>
                <input
                  type="text"
                  required
                  value={form.nama_jasa}
                  onChange={(e) => setForm({ ...form, nama_jasa: e.target.value })}
                  className="input"
                  placeholder="Contoh: Ganti Oli"
                  id="input-nama-jasa"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Estimasi Waktu</label>
                  <input
                    type="text"
                    required
                    value={form.estimasi_waktu}
                    onChange={(e) => setForm({ ...form, estimasi_waktu: e.target.value })}
                    className="input"
                    placeholder="Contoh: 1-2 jam"
                    id="input-estimasi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Harga Dasar (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.harga_dasar}
                    onChange={(e) => setForm({ ...form, harga_dasar: e.target.value })}
                    className="input"
                    placeholder="0"
                    id="input-harga-jasa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Deskripsi</label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  className="input min-h-[80px] resize-y"
                  placeholder="Deskripsi singkat layanan (opsional)"
                  id="input-deskripsi-jasa"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Batal
                </button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah Layanan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Hapus Layanan?</h3>
                <p className="text-sm text-neutral-600">Data yang dihapus tidak dapat dikembalikan.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
