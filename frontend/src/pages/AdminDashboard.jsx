import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Car as CarIcon, CheckCircle, Play, ArrowRight,
  Wifi, CreditCard, User, Search, X as XIcon
} from 'lucide-react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import Badge from '../components/Badge';

const TABS = [
  { key: 'menunggu',           label: 'Menunggu',       icon: Clock,       statusKey: 'Menunggu'            },
  { key: 'sedang',             label: 'Dikerjakan',     icon: CarIcon,     statusKey: 'Sedang Dikerjakan'   },
  { key: 'menungguPembayaran', label: 'Menunggu Bayar', icon: CreditCard,  statusKey: 'Menunggu Pembayaran' },
  { key: 'dibayar',            label: 'Dibayar',        icon: CreditCard,  statusKey: 'Dibayar'             },
  { key: 'selesai',            label: 'Selesai',        icon: CheckCircle, statusKey: 'Selesai'             },
];

const getBadgeVariant = (status) => ({
  'Menunggu': 'warning', 'Sedang Dikerjakan': 'info',
  'Menunggu Pembayaran': 'warning', 'Dibayar': 'primary', 'Selesai': 'success'
}[status] || 'default');

/* ─── Main Component ─── */
const AdminDashboard = () => {
  const [bookings, setBookings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab]     = useState('menunggu');
  const [search, setSearch]           = useState('');
  const { socket } = useSocket();

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/bookings');
      setBookings(data);
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => fetchBookings();
    socket.on('new_booking',            refresh);
    socket.on('booking_status_changed', refresh);
    socket.on('new_transaction',        refresh);
    return () => {
      socket.off('new_booking',            refresh);
      socket.off('booking_status_changed', refresh);
      socket.off('new_transaction',        refresh);
    };
  }, [socket, fetchBookings]);

  const sendWA = (phone, message) => {
    if (!phone) { alert('Nomor WA tidak tersedia.'); return; }
    let fp = phone.replace(/\D/g, '');
    if (fp.startsWith('0')) fp = '62' + fp.substring(1);
    window.open(`https://wa.me/${fp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const updateStatus = async (id, status) => {
    try { await axios.put(`/api/bookings/${id}/status`, { status_pengerjaan: status }); fetchBookings(); }
    catch (e) { console.error(e); }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const match = (b) =>
      !q ||
      b.no_pelat?.toLowerCase().includes(q) ||
      b.merek_mobil?.toLowerCase().includes(q) ||
      b.jenis_mobil?.toLowerCase().includes(q) ||
      b.user_id?.nama?.toLowerCase().includes(q) ||
      b.layanan?.some(s => s.nama_jasa?.toLowerCase().includes(q));

    const result = {};
    TABS.forEach(tab => {
      result[tab.key] = bookings.filter(b => b.status_pengerjaan === tab.statusKey && match(b));
    });
    return result;
  }, [bookings, search]);

  useEffect(() => {
    if (!search) return;
    const found = TABS.find(t => filtered[t.key].length > 0);
    if (found) setActiveTab(found.key);
  }, [search]); // eslint-disable-line

  const activeTabMeta = TABS.find(t => t.key === activeTab);
  const list          = filtered[activeTab];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 64px - 48px)' }}>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard Kasir</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Kelola pesanan kendaraan secara real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-full">
            <Wifi className="w-3 h-3 text-neutral-500" />
            <span className="text-xs font-semibold text-neutral-600">Live</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>
          <span className="text-xs text-neutral-400">
            {lastRefresh.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* ── Tabs + Search ── */}
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        {/* Tab Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 flex-1 hide-scrollbar">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const cnt  = filtered[tab.key].length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border whitespace-nowrap transition-all flex-shrink-0 text-sm font-medium ${
                  isActive
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md min-w-[20px] text-center ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  {cnt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative flex-shrink-0 w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Cari plat, nama, layanan…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/20 focus:border-neutral-900 transition"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Content Panel ── */}
      <div className="flex-1 min-h-0 bg-white rounded-xl border border-neutral-200 flex flex-col overflow-hidden">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 flex-shrink-0 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-800 text-sm">{activeTabMeta.label}</span>
            <span className="text-xs text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
              {list.length} pesanan{search ? ' ditemukan' : ''}
            </span>
          </div>
          {search && (
            <span className="text-xs text-neutral-500 italic">Filter: "{search}"</span>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16">
              <activeTabMeta.icon className="w-12 h-12 text-neutral-200 mb-3" />
              <p className="text-neutral-400 text-sm">
                {search ? `Tidak ada hasil untuk "${search}"` : 'Tidak ada pesanan di sini'}
              </p>
            </div>
          ) : (
            list.map(booking => (
              <BookingRow
                key={booking._id}
                booking={booking}
                tabKey={activeTab}
                updateStatus={updateStatus}
                sendWA={sendWA}
                searchQuery={search}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Highlight match ─── */
const Highlight = ({ text = '', query }) => {
  if (!query || !text) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-neutral-200 text-neutral-900 rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};

/* ─── Booking Row ─── */
const BookingRow = ({ booking, tabKey, updateStatus, sendWA, searchQuery }) => {
  const name = booking.user_id?.nama || 'Pelanggan';
  const pelat = booking.no_pelat;
  const wa    = booking.user_id?.no_wa;

  const waMsg = {
    menunggu:           `Halo ${name}, booking kendaraan ${pelat} sudah kami terima dan berstatus *Menunggu Antrean*. Mohon ditunggu ya!`,
    sedang:             `Halo ${name}, kendaraan ${pelat} sedang dalam proses pengerjaan. Kami update lagi jika selesai!`,
    menungguPembayaran: `Halo ${name}, perbaikan kendaraan ${pelat} sudah selesai! Silakan bayar di kasir. Terima kasih.`,
    dibayar:            `Halo ${name}, pembayaran kendaraan ${pelat} sudah *LUNAS*. Kendaraan siap diambil. Terima kasih!`,
  }[tabKey];

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50 transition-colors">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-neutral-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-neutral-800 text-sm">
            <Highlight text={pelat} query={searchQuery} />
          </span>
          <Badge variant={getBadgeVariant(booking.status_pengerjaan)} size="sm">
            {booking.status_pengerjaan}
          </Badge>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">
          <Highlight text={`${booking.merek_mobil} ${booking.jenis_mobil}`} query={searchQuery} />
          {name !== 'Pelanggan' && (
            <><span className="mx-1.5 text-neutral-300">·</span><Highlight text={name} query={searchQuery} /></>
          )}
        </p>
        {booking.layanan?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {booking.layanan.map(s => (
              <span key={s._id} className="text-[11px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full border border-neutral-200">
                <Highlight text={s.nama_jasa} query={searchQuery} />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {tabKey === 'menunggu' && (
          <>
            <button onClick={() => sendWA(wa, waMsg)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50 text-xs font-medium rounded-lg transition-colors">
              📲 WA
            </button>
            <button onClick={() => updateStatus(booking._id, 'Sedang Dikerjakan')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors">
              <Play className="w-3.5 h-3.5" /> Mulai
            </button>
          </>
        )}
        {tabKey === 'sedang' && (
          <>
            <Link to="/pos" state={{ booking }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50 text-xs font-medium rounded-lg transition-colors">
              POS <ArrowRight className="w-3 h-3" />
            </Link>
            <button onClick={() => updateStatus(booking._id, 'Menunggu Pembayaran')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors">
              <CreditCard className="w-3.5 h-3.5" /> Proses
            </button>
          </>
        )}
        {tabKey === 'menungguPembayaran' && (
          <>
            <button onClick={() => sendWA(wa, waMsg)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50 text-xs font-medium rounded-lg transition-colors">
              📲 WA
            </button>
            <Link to="/pos" state={{ booking }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors">
              Bayar <ArrowRight className="w-3 h-3" />
            </Link>
          </>
        )}
        {tabKey === 'dibayar' && (
          <>
            <button onClick={() => sendWA(wa, waMsg)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-neutral-600 bg-white hover:bg-neutral-50 text-xs font-medium rounded-lg transition-colors">
              📲 WA
            </button>
            <button onClick={() => updateStatus(booking._id, 'Selesai')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors">
              <CheckCircle className="w-3.5 h-3.5" /> Selesai
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
