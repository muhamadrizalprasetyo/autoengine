import { useState, useEffect } from 'react';
import { X, Gift, Percent } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromoToast = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after a small delay for better effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-gradient-to-br from-primary to-primary-hover rounded-2xl shadow-2xl overflow-hidden animate-bounce-short">
      {/* Decorative background */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors p-1"
        title="Tutup Promo"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <Percent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-lg leading-tight mb-1">
              Diskon Spooring 20%
            </h4>
            <p className="text-white/80 text-xs mb-3">
              Khusus bulan ini! Pastikan mobil Anda tetap stabil. S&K berlaku.
            </p>
            <Link 
              to="/booking" 
              className="inline-block bg-white text-primary text-xs font-bold px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors shadow-sm"
              onClick={() => setIsVisible(false)}
            >
              Klaim Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoToast;
