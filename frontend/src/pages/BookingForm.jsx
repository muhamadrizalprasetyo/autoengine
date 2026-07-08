import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Car, Upload, FileText } from 'lucide-react';
import axios from 'axios';

const BookingForm = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({
    no_pelat: '',
    mobil: '', // Combined Merek and Jenis
    tanggal: '',
    jam: '', // New Time field
    catatan: '',
    metode_pembayaran_booking: 'Lunas Nanti',
    dp_amount: 0
  });
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Calculate estimated price
  const estimatedPrice = selectedServices.reduce((sum, serviceId) => {
    const service = services.find(s => s._id === serviceId);
    return sum + (service ? service.harga_dasar : 0);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.tanggal || !formData.jam) {
      setError('Pilih tanggal dan jam booking');
      setLoading(false);
      return;
    }

    try {
      const combinedDateTime = new Date(`${formData.tanggal}T${formData.jam}`);
      
      const payload = {
        ...formData,
        jenis_mobil: formData.mobil,
        merek_mobil: formData.mobil.split(' ')[0] || '-', // send first word as merek to satisfy backend requirement
        tanggal: combinedDateTime,
        layanan: selectedServices
      };

      const response = await axios.post('/api/bookings', payload);

      // Upload photo if selected
      if (photo) {
        const formDataPhoto = new FormData();
        formDataPhoto.append('foto', photo);
        await axios.post(`/api/bookings/${response.data.booking._id}/photo`, formDataPhoto, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/customer');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Booking Servis Kendaraan</h1>

      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center space-x-2 border-b border-neutral-200 pb-2">
              <Car className="h-5 w-5 text-primary" />
              <span>Informasi Kendaraan</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="no_pelat" className="block text-sm font-medium text-neutral-700 mb-2">
                  Nomor Pelat
                </label>
                <input
                  id="no_pelat"
                  name="no_pelat"
                  type="text"
                  required
                  className="input"
                  value={formData.no_pelat}
                  onChange={handleChange}
                  placeholder="B 1234 ABC"
                />
              </div>
              
              <div>
                <label htmlFor="mobil" className="block text-sm font-medium text-neutral-700 mb-2">
                  Mobil (Merek & Jenis)
                </label>
                <input
                  id="mobil"
                  name="mobil"
                  type="text"
                  required
                  className="input"
                  value={formData.mobil}
                  onChange={handleChange}
                  placeholder="Contoh: Toyota Avanza, Honda Civic"
                />
              </div>
              
              <div>
                <label htmlFor="tanggal" className="block text-sm font-medium text-neutral-700 mb-2">
                  Tanggal Booking
                </label>
                <input
                  id="tanggal"
                  name="tanggal"
                  type="date"
                  required
                  className="input"
                  value={formData.tanggal}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="jam" className="block text-sm font-medium text-neutral-700 mb-2">
                  Jam Booking
                </label>
                <input
                  id="jam"
                  name="jam"
                  type="time"
                  required
                  className="input"
                  value={formData.jam}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Services Selection Removed to focus on Reservation */}

          {/* Photo Upload */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center space-x-2 border-b border-neutral-200 pb-2">
              <Upload className="h-5 w-5 text-primary" />
              <span>Foto Mobil (Opsional)</span>
            </h3>
            
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="input"
              />
              {photo && (
                <p className="text-sm text-neutral-500 mt-2">File dipilih: {photo.name}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center space-x-2 border-b border-neutral-200 pb-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Keluhan atau Tujuan Servis</span>
            </h3>
            <div>
              <textarea
                id="catatan"
                name="catatan"
                rows="4"
                className="input"
                value={formData.catatan}
                onChange={handleChange}
                placeholder="Jelaskan keluhan pada mobil Anda (contoh: AC kurang dingin, rem bunyi, atau ingin servis berkala)..."
                required
              />
            </div>
          </div>

          {/* Payment Method Selection Removed */}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Memproses...' : 'Booking Sekarang'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;
