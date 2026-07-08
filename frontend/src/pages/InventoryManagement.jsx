import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  AlertTriangle,
  Save,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Table from '../components/Table';
import Badge from '../components/Badge';

const InventoryManagement = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sortField, setSortField] = useState('nama_barang');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [form, setForm] = useState({
    nama_barang: '',
    stok_sisa: '',
    harga_jual: '',
    limit_stok: '5',
    satuan: 'pcs',
  });

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const res = await axios.get('/api/inventories');
      setInventories(res.data);
    } catch (err) {
      console.error('Error fetching inventories:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditingItem(null);
    setForm({ nama_barang: '', stok_sisa: '', harga_jual: '', limit_stok: '5', satuan: 'pcs' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      nama_barang: item.nama_barang,
      stok_sisa: String(item.stok_sisa),
      harga_jual: String(item.harga_jual),
      limit_stok: String(item.limit_stok),
      satuan: item.satuan || 'pcs',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nama_barang: form.nama_barang,
      stok_sisa: Number(form.stok_sisa),
      harga_jual: Number(form.harga_jual),
      limit_stok: Number(form.limit_stok),
      satuan: form.satuan,
    };

    try {
      if (editingItem) {
        await axios.put(`/api/inventories/${editingItem._id}`, payload);
      } else {
        await axios.post('/api/inventories', payload);
      }
      setShowModal(false);
      fetchInventories();
    } catch (err) {
      console.error('Error saving inventory:', err);
      alert(err.response?.data?.message || 'Gagal menyimpan data');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/inventories/${id}`);
      setDeleteConfirm(null);
      fetchInventories();
    } catch (err) {
      console.error('Error deleting inventory:', err);
      alert(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  // Filter + sort
  const displayed = inventories
    .filter((item) =>
      item.nama_barang.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

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
          <h1 className="text-3xl font-bold text-neutral-900">Manajemen Inventori</h1>
          <p className="text-neutral-600 mt-1">Kelola stok sparepart dan barang bengkel</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2" id="btn-add-inventory">
          <Plus className="w-5 h-5" />
          <span>Tambah Barang</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <StatsCard
          title="Total Item"
          value={inventories.length}
          icon={Package}
          color="primary"
        />
        <StatsCard
          title="Total Nilai Stok"
          value={formatCurrency(inventories.reduce((sum, i) => sum + i.harga_jual * i.stok_sisa, 0))}
          icon={Package}
          color="primary"
        />
        <StatsCard
          title="Stok Menipis"
          value={inventories.filter((i) => i.stok_sisa <= i.limit_stok).length}
          icon={AlertTriangle}
          color="primary"
        />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Cari nama barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-12"
          id="input-search-inventory"
        />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <Table
          columns={[
            {
              key: 'nama_barang',
              label: 'Nama Barang',
              align: 'left',
              render: (value, row) => (
                <div className="flex items-center gap-3">
                  <span className="font-medium text-neutral-800">{value}</span>
                </div>
              ),
            },
            {
              key: 'stok_sisa',
              label: 'Stok',
              align: 'center',
              render: (value, row) => (
                <span className={`font-semibold ${value <= row.limit_stok ? 'text-error' : 'text-neutral-800'}`}>
                  {value}
                </span>
              ),
            },
            {
              key: 'satuan',
              label: 'Satuan',
              align: 'center',
            },
            {
              key: 'harga_jual',
              label: 'Harga Jual',
              align: 'right',
              render: (value) => formatCurrency(value),
            },
            {
              key: 'limit_stok',
              label: 'Limit',
              align: 'center',
            },
            {
              key: 'status',
              label: 'Status',
              align: 'center',
              render: (value, row) => (
                <Badge variant={row.stok_sisa <= row.limit_stok ? 'warning' : 'success'} size="sm">
                  {row.stok_sisa <= row.limit_stok ? 'Menipis' : 'Aman'}
                </Badge>
              ),
            },
            {
              key: 'aksi',
              label: 'Aksi',
              align: 'center',
              render: (value, row) => (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEdit(row)}
                    className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(row._id)}
                    className="p-2 text-neutral-500 hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={displayed}
          onRowClick={(row) => openEdit(row)}
        />
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900">
                {editingItem ? 'Edit Barang' : 'Tambah Barang Baru'}
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
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nama Barang</label>
                <input
                  type="text"
                  required
                  value={form.nama_barang}
                  onChange={(e) => setForm({ ...form, nama_barang: e.target.value })}
                  className="input"
                  placeholder="Contoh: Oli Mesin 10W-40"
                  id="input-nama-barang"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Stok Saat Ini</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stok_sisa}
                    onChange={(e) => setForm({ ...form, stok_sisa: e.target.value })}
                    className="input"
                    placeholder="0"
                    id="input-stok"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Satuan</label>
                  <select
                    value={form.satuan}
                    onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                    className="input"
                    id="select-satuan"
                  >
                    <option value="pcs">pcs</option>
                    <option value="liter">liter</option>
                    <option value="set">set</option>
                    <option value="buah">buah</option>
                    <option value="botol">botol</option>
                    <option value="pasang">pasang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.harga_jual}
                    onChange={(e) => setForm({ ...form, harga_jual: e.target.value })}
                    className="input"
                    placeholder="0"
                    id="input-harga"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Limit Stok</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.limit_stok}
                    onChange={(e) => setForm({ ...form, limit_stok: e.target.value })}
                    className="input"
                    placeholder="5"
                    id="input-limit"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Batal
                </button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Simpan Perubahan' : 'Tambah Barang'}</span>
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
                <h3 className="text-lg font-bold text-neutral-900">Hapus Barang?</h3>
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

export default InventoryManagement;
