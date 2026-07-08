import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wrench, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    no_wa: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/customer');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Periksa kembali data Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img src="/logo_login.png" alt="Auto Engine" className="h-20 mx-auto object-contain" />
        </div>

        {/* Form Card */}
        <div className="bg-neutral-0 rounded-xl shadow-sm border border-neutral-200 p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-1">Daftar Akun</h2>
          <p className="text-neutral-600 text-sm mb-6">Buat akun baru untuk mulai menggunakan layanan kami</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-neutral-900">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Field */}
            <div>
              <label htmlFor="nama" className="block text-sm font-medium text-neutral-900 mb-2">
                Nama Lengkap
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                required
                className="input"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Nama lengkap Anda"
                disabled={isLoading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@perusahaan.com"
                disabled={isLoading}
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="no_wa" className="block text-sm font-medium text-neutral-900 mb-2">
                Nomor WhatsApp
              </label>
              <input
                id="no_wa"
                name="no_wa"
                type="tel"
                required
                className="input"
                value={formData.no_wa}
                onChange={handleChange}
                placeholder="081234567890"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength="6"
                  className="input pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 font-semibold flex items-center justify-center gap-2 mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Daftar'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-neutral-600 text-sm mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-accent font-semibold hover:text-accent-dark transition-colors">
              Masuk sekarang
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-neutral-500 text-xs mt-6">
          © 2026 Auto Engine. Semua hak dilindungi.
        </p>
      </div>
    </div>
  );
};

export default Register;
