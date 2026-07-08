import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Car as CarIcon, AlertCircle, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerVehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      // Mocking vehicles from unique bookings since there's no Vehicle model yet
      const response = await axios.get('/api/bookings');
      const allBookings = response.data.data || response.data;
      
      const uniqueVehiclesMap = new Map();
      allBookings.forEach(booking => {
        const vehicleKey = `${booking.no_pelat}-${booking.merek_mobil}`;
        if (!uniqueVehiclesMap.has(vehicleKey)) {
          uniqueVehiclesMap.set(vehicleKey, {
            no_pelat: booking.no_pelat,
            merek_mobil: booking.merek_mobil,
            jenis_mobil: booking.jenis_mobil,
            foto_mobil: booking.foto_mobil,
            lastServiceDate: booking.tanggal
          });
        }
      });
      
      setVehicles(Array.from(uniqueVehiclesMap.values()));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Garasi Saya</h1>
          <p className="text-neutral-600 mt-1">Kelola data kendaraan dan pengingat servis Anda</p>
        </div>
        <button className="btn-primary flex items-center gap-2 opacity-50 cursor-not-allowed" title="Fitur Tambah Kendaraan Manual Segera Hadir">
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">Tambah Kendaraan</span>
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-6">
            <CarIcon className="w-10 h-10 text-neutral-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Garasi Masih Kosong</h2>
          <p className="text-neutral-600 mb-6 max-w-md mx-auto">
            Anda belum mendaftarkan kendaraan apa pun atau belum pernah melakukan servis.
          </p>
          <Link to="/booking" className="btn-primary inline-block">
            Pesan Layanan Pertama Anda
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((vehicle, index) => (
            <div key={index} className="card relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full z-0"></div>
              
              <div className="relative z-10 flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <CarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 uppercase">{vehicle.no_pelat}</h3>
                    <p className="text-neutral-600 text-sm">{vehicle.merek_mobil} {vehicle.jenis_mobil}</p>
                  </div>
                </div>
              </div>
              
              {vehicle.foto_mobil ? (
                 <img src={`/uploads/${vehicle.foto_mobil}`} alt="Mobil" className="w-full h-32 object-cover rounded-lg mb-4" />
              ) : (
                 <div className="w-full h-32 bg-neutral-100 rounded-lg mb-4 flex items-center justify-center border border-neutral-200 border-dashed">
                   <p className="text-neutral-400 text-sm font-medium">Tidak ada foto</p>
                 </div>
              )}

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <div className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-yellow-800">Smart Reminder</p>
                    <p className="text-xs text-yellow-700 mt-0.5">Waktunya Servis Berkala dalam <span className="font-bold">500km</span> atau <span className="font-bold">2 minggu</span> lagi.</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-4 h-4" />
                  <span>Servis Terakhir: {vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate).toLocaleDateString('id-ID') : '-'}</span>
                </div>
              </div>
              
              <div className="mt-5">
                <Link to="/booking" className="btn-primary w-full text-center flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" />
                  Booking Servis
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerVehicles;
