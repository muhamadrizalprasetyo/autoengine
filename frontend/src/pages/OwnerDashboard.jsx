import { useState, useEffect, useCallback, useRef } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, DollarSign, ShoppingCart, Package,
  AlertTriangle, Wifi, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import StatsCard from '../components/StatsCard';

/* ─── Custom Tooltip base style ─── */
const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  padding: '10px 14px',
  fontSize: '13px',
};

const rupiah = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;

/* ─── Chart Card Wrapper ─── */
const ChartCard = ({ title, subtitle, children, action }) => (
  <div className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm flex flex-col gap-4">
    <div className="flex items-start justify-between">
      <div>
        <h2 className="font-bold text-neutral-900 text-base">{title}</h2>
        {subtitle && <p className="text-xs text-neutral-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

/* ─── Pill toggle ─── */
const Toggle = ({ options, value, onChange }) => (
  <div className="flex bg-neutral-100 rounded-lg p-0.5 gap-0.5">
    {options.map(o => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
          value === o.value ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        {o.label}
      </button>
    ))}
  </div>
);

/* ─── Main ─── */
const OwnerDashboard = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [analytics, setAnalytics]     = useState(null);
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Chart toggles
  const [revenueMode, setRevenueMode]   = useState('monthly');  // monthly | daily
  const [payMode, setPayMode]           = useState('count');     // count | donut view toggle – we keep donut, toggle shows revenue vs count

  const fetchAnalytics = useCallback(async () => {
    try {
      const [aRes, iRes] = await Promise.all([
        axios.get('/api/transactions/analytics/data'),
        axios.get('/api/inventories'),
      ]);
      setAnalytics(aRes.data);
      setInventories(iRes.data);
      setLastRefresh(new Date());
      setError(null);
    } catch (e) {
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'owner') {
      setError('Tidak memiliki akses');
      setLoading(false);
      return;
    }
    fetchAnalytics();
  }, [user, fetchAnalytics]);

  useEffect(() => {
    if (!socket) return;
    const h = () => fetchAnalytics();
    socket.on('new_transaction', h);
    return () => socket.off('new_transaction', h);
  }, [socket, fetchAnalytics]);

  /* ── Loading / Error ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="card bg-red-50 border border-red-200 flex items-center gap-4">
        <AlertTriangle className="w-6 h-6 text-primary flex-shrink-0" />
        <div className="flex-1"><p className="font-semibold text-neutral-900">Error</p><p className="text-sm text-neutral-600">{error}</p></div>
        <button onClick={fetchAnalytics} className="btn-primary whitespace-nowrap">Coba Lagi</button>
      </div>
    );
  }
  if (!analytics) return null;

  /* ── Derived data ── */
  const lowStockCount  = inventories.filter(i => i.stok_sisa <= i.limit_stok).length;
  const avgTransaction = analytics.totalTransactions > 0
    ? Math.round(analytics.totalRevenue / analytics.totalTransactions) : 0;

  // Monthly revenue
  const monthlyData = Object.entries(analytics.revenueByMonth).map(([month, revenue]) => ({
    month: month.split(' ')[0].substring(0, 3),
    revenue,
  }));

  // Daily trend (last 30 days)
  const dailyData = analytics.dailyTrend || [];

  // Revenue chart data based on toggle
  const revenueChartData = revenueMode === 'monthly' ? monthlyData : dailyData;
  const revenueKey       = revenueMode === 'monthly' ? 'revenue' : 'revenue';
  const revenueXKey      = revenueMode === 'monthly' ? 'month' : 'date';

  // Payment donut
  const GRAY_SHADES = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1'];
  const paymentData = Object.entries(analytics.paymentMethods).map(([method, count], i) => ({
    name: method,
    value: count,
    fill: GRAY_SHADES[i % GRAY_SHADES.length],
  }));
  const totalPay = paymentData.reduce((s, d) => s + d.value, 0);

  // Service radar
  const serviceData = (analytics.servicePerformance || []).map(s => ({
    name: s.name.length > 12 ? s.name.substring(0, 12) + '…' : s.name,
    count: s.count,
    revenue: Math.round(s.revenue / 1000), // in thousands for readability
  }));

  // Fast moving — horizontal bar
  const fastData = (analytics.fastMovingItems || []).slice(0, 6).map(item => ({
    name: item.name.length > 16 ? item.name.substring(0, 14) + '…' : item.name,
    qty: item.quantity,
  }));
  const maxQty = Math.max(...fastData.map(d => d.qty), 1);

  // Revenue trend (month-over-month)
  const lastTwo = Object.values(analytics.revenueByMonth).slice(-2);
  const growth  = lastTwo.length === 2 && lastTwo[0] > 0
    ? (((lastTwo[1] - lastTwo[0]) / lastTwo[0]) * 100).toFixed(1) : null;

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Dashboard Owner</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Pantau performa bengkel secara real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 border border-neutral-200 rounded-full">
            <Wifi className="w-3 h-3 text-neutral-500" />
            <span className="text-xs font-semibold text-neutral-600">Live</span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>
          <span className="text-xs text-neutral-400">
            Update: {lastRefresh.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Pendapatan</span>
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900 leading-none">{rupiah(analytics.totalRevenue)}</p>
          {growth !== null && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${parseFloat(growth) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {parseFloat(growth) >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(growth)}% vs bulan lalu
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Transaksi</span>
            <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-neutral-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900">{analytics.totalTransactions}</p>
          <p className="text-xs text-neutral-400 mt-2">transaksi tercatat</p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Rata-rata Transaksi</span>
            <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-neutral-600" />
            </div>
          </div>
          <p className="text-2xl font-black text-neutral-900">{rupiah(avgTransaction)}</p>
          <p className="text-xs text-neutral-400 mt-2">per transaksi</p>
        </div>

        <div className={`rounded-2xl border shadow-sm p-5 ${lowStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-neutral-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stok Menipis</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lowStockCount > 0 ? 'bg-red-100' : 'bg-neutral-100'}`}>
              <Package className={`w-4 h-4 ${lowStockCount > 0 ? 'text-red-600' : 'text-neutral-600'}`} />
            </div>
          </div>
          <p className={`text-2xl font-black ${lowStockCount > 0 ? 'text-red-700' : 'text-neutral-900'}`}>{lowStockCount}</p>
          <p className="text-xs text-neutral-400 mt-2">produk perlu restock</p>
        </div>
      </div>

      {/* Charts Grid — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Chart 1: Revenue Area/Bar (Monthly / Daily toggle) */}
        <ChartCard
          title="Tren Pendapatan"
          subtitle={revenueMode === 'monthly' ? 'Pendapatan per bulan' : '30 hari terakhir'}
          action={
            <Toggle
              options={[{ label: 'Bulanan', value: 'monthly' }, { label: '30 Hari', value: 'daily' }]}
              value={revenueMode}
              onChange={setRevenueMode}
            />
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            {revenueMode === 'monthly' ? (
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(0)}jt` : `${(v/1000).toFixed(0)}rb`} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [rupiah(v), 'Pendapatan']} />
                <Bar dataKey="revenue" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            ) : (
              <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  interval={Math.ceil(dailyData.length / 7)} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(0)}jt` : v >= 1000 ? `${(v/1000).toFixed(0)}rb` : v} />
                <Tooltip contentStyle={tooltipStyle} formatter={v => [rupiah(v), 'Pendapatan']} />
                <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2}
                  fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#0f172a' }} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Payment Methods Donut */}
        <ChartCard title="Metode Pembayaran" subtitle={`${totalPay} total transaksi`}>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [
                  `${v} transaksi (${((v/totalPay)*100).toFixed(0)}%)`, name
                ]} />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex-1 space-y-2.5">
              {paymentData.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.fill }} />
                    <span className="text-sm text-neutral-700 font-medium">{d.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-neutral-900">{d.value}</span>
                    <span className="text-xs text-neutral-400 ml-1">({((d.value/totalPay)*100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* Chart 3: Service Performance Radar */}
        <ChartCard title="Performa Layanan" subtitle="Frekuensi & pendapatan per jenis layanan">
          {serviceData.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-neutral-400 text-sm">Belum ada data layanan</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={serviceData} margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} />
                <Radar name="Frekuensi" dataKey="count" stroke="#0f172a" fill="#0f172a" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Pendapatan (rb)" dataKey="revenue" stroke="#dc2626" fill="#dc2626" fillOpacity={0.08} strokeWidth={1.5} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v, name) =>
                  [name === 'Pendapatan (rb)' ? `Rp ${(v*1000).toLocaleString('id-ID')}` : `${v}x`, name]
                } />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Chart 4: Fast Moving Items — horizontal bar */}
        <ChartCard title="Produk Terlaris" subtitle="Top 6 berdasarkan jumlah terjual">
          {fastData.length === 0 ? (
            <div className="flex items-center justify-center h-[240px] text-neutral-400 text-sm">Belum ada data produk</div>
          ) : (
            <div className="space-y-3 py-1">
              {fastData.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-400 w-4 text-right flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-neutral-700 truncate">{item.name}</span>
                      <span className="text-sm font-bold text-neutral-900 ml-2 flex-shrink-0">{item.qty} unit</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-neutral-900' : i === 1 ? 'bg-neutral-700' : 'bg-neutral-400'}`}
                        style={{ width: `${(item.qty / maxQty) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Daily transaction count sparkline */}
      {dailyData.length > 0 && (
        <ChartCard title="Volume Transaksi Harian" subtitle="Jumlah transaksi 30 hari terakhir">
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={dailyData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="cntGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                interval={Math.ceil(dailyData.length / 7)} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => [`${v} transaksi`, 'Volume']} />
              <Area type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={2}
                fill="url(#cntGrad)" dot={false} activeDot={{ r: 4, fill: '#dc2626' }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

    </div>
  );
};

export default OwnerDashboard;
