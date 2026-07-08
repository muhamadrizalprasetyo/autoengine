import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Car as CarIcon, Plus, Clock, CheckCircle, Wrench, CreditCard } from 'lucide-react';
import axios from 'axios';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Sedang Dikerjakan':
        return 'bg-blue-500/20 text-blue-400';
      case 'Menunggu Pembayaran':
        return 'bg-orange-500/20 text-orange-400';
      case 'Dibayar':
        return 'bg-purple-500/20 text-purple-400';
      case 'Selesai':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Menunggu':
        return <Clock className="h-4 w-4" />;
      case 'Sedang Dikerjakan':
        return <CarIcon className="h-4 w-4" />;
      case 'Menunggu Pembayaran':
        return <Clock className="h-4 w-4" />;
      case 'Dibayar':
        return <CheckCircle className="h-4 w-4" />;
      case 'Selesai':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sedang Dikerjakan':
        return 'bg-blue-100 text-blue-800';
      case 'Menunggu Pembayaran':
        return 'bg-orange-100 text-orange-800';
      case 'Dibayar':
        return 'bg-purple-100 text-purple-800';
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const activeBooking = bookings.find(b => ['Menunggu', 'Sedang Dikerjakan', 'Menunggu Pembayaran', 'Dibayar'].includes(b.status_pengerjaan));

  const statusSteps = [
    { id: 'Menunggu', label: 'Menunggu Antrean', icon: Clock },
    { id: 'Sedang Dikerjakan', label: 'Proses Servis', icon: Wrench },
    { id: 'Menunggu Pembayaran', label: 'Pembayaran', icon: CreditCard },
    { id: 'Selesai', label: 'Siap Diambil', icon: CheckCircle }
  ];

  const getStepIndex = (status) => {
    if (status === 'Menunggu') return 0;
    if (status === 'Sedang Dikerjakan') return 1;
    if (status === 'Menunggu Pembayaran') return 2;
    if (status === 'Dibayar') return 2; // Payment done, waiting for Selesai
    if (status === 'Selesai') return 3;
    return 0;
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard Pelanggan</h1>
          <p className="text-neutral-600 mt-1">Selamat datang kembali, {user?.nama}</p>
        </div>
        <Link to="/booking" className="btn-primary flex items-center gap-2">
          <Plus className="h-5 w-5" />
          <span>Booking Baru</span>
        </Link>
      </div>

      {/* Active Service Tracker */}
      {activeBooking && (
        <div className="card mb-8 border-t-4 border-t-primary shadow-lg bg-gradient-to-br from-white to-neutral-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-1">Status Kendaraan Anda</h2>
              <p className="text-neutral-600 font-medium">
                {activeBooking.no_pelat} - {activeBooking.merek_mobil} {activeBooking.jenis_mobil}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusBadgeColor(activeBooking.status_pengerjaan)}`}>
                {activeBooking.status_pengerjaan}
              </span>
            </div>
          </div>
          
          <div className="relative pt-4 pb-4 px-2 md:px-8">
            {/* Background line for desktop */}
            <div className="absolute top-10 left-12 right-12 h-1 bg-neutral-200 hidden md:block rounded-full"></div>
            
            {/* Active progress line for desktop */}
            <div className="absolute top-10 left-12 h-1 bg-primary hidden md:block rounded-full transition-all duration-700 ease-in-out" 
                 style={{ width: `calc(${(getStepIndex(activeBooking.status_pengerjaan) / (statusSteps.length - 1)) * 100}% - 2rem)` }}>
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
              {statusSteps.map((step, index) => {
                const currentIndex = getStepIndex(activeBooking.status_pengerjaan);
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 relative w-full md:w-32">
                    {/* Connection line for mobile */}
                    {index < statusSteps.length - 1 && (
                      <div className="absolute left-6 top-14 bottom-[-32px] w-1 bg-neutral-200 md:hidden rounded-full">
                        {(isCompleted || isActive) && (
                           <div className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-700" style={{ height: isCompleted ? '100%' : '50%' }}></div>
                        )}
                      </div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 transition-all duration-500 z-10 ${
                      isActive ? 'bg-primary border-primary/20 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-110' : 
                      isCompleted ? 'bg-green-500 border-green-100 text-white' : 
                      'bg-white border-neutral-200 text-neutral-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left md:text-center w-full">
                      <p className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-primary' : isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {step.label}
                      </p>
                      {isActive && activeBooking.status_pengerjaan === 'Dibayar' && step.id === 'Menunggu Pembayaran' && (
                         <p className="text-xs text-green-600 font-bold mt-1">✓ Lunas</p>
                      )}
                      {isActive && activeBooking.status_pengerjaan === 'Menunggu Pembayaran' && step.id === 'Menunggu Pembayaran' && (
                         <p className="text-xs text-orange-500 font-bold mt-1 animate-pulse">Menunggu...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {activeBooking.catatan && (
            <div className="mt-8 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-0.5">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-800 mb-1">Catatan Servis:</p>
                <p className="text-sm text-neutral-600">{activeBooking.catatan}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Jadwal Booking Terdekat */}
      {!activeBooking && (
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Jadwal Booking Terdekat
          </h2>
          
          {bookings.filter(b => b.status_pengerjaan === 'Menunggu').length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-600 font-medium mb-2">Belum Ada Jadwal Servis</p>
              <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
                Anda tidak memiliki antrean servis saat ini. Booking sekarang untuk merawat kendaraan kesayangan Anda.
              </p>
              <Link to="/booking" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Buat Jadwal Servis
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.filter(b => b.status_pengerjaan === 'Menunggu').map((booking) => (
                <div key={booking._id} className="border border-neutral-200 rounded-xl p-5 hover:border-primary transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Menunggu Antrean</p>
                      <h3 className="text-lg font-bold text-neutral-900">
                        {booking.no_pelat}
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        {booking.merek_mobil} {booking.jenis_mobil}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-neutral-900">
                        {new Date(booking.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short'
                        })}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {new Date(booking.tanggal).toLocaleTimeString('id-ID', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <button className="flex-1 btn-secondary py-2 text-sm">Reschedule</button>
                    <button className="flex-1 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Batal</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
