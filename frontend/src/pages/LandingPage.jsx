import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
    Gauge, 
    Receipt, 
    Calendar, 
    Wrench, 
    Clock, 
    Volume2, 
    VolumeX, 
    MessageSquare, 
    Phone, 
    Instagram, 
    Facebook, 
    ChevronRight, 
    Menu, 
    X, 
    ArrowRight,
    Zap,
    Cpu,
    Compass,
    Disc
} from 'lucide-react';

const LandingPage = () => {
    const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [scrollPos, setScrollPos] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [sliderPos, setSliderPos] = useState(50);
    const [activeService, setActiveService] = useState(0);
    const [activeMetric, setActiveMetric] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    
    const audioRef = useRef(null);
    const sliderContainerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPos(window.scrollY);
            setIsHeaderScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('translate-y-0', 'opacity-100');
                    entry.target.classList.remove('translate-y-12', 'opacity-0');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.drift-reveal').forEach(el => observer.observe(el));
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    // Auto-play for interactive sections
    useEffect(() => {
        const metricInterval = setInterval(() => {
            setActiveMetric((prev) => (prev + 1) % 3);
        }, 4000); // 4 seconds for performance features

        const serviceInterval = setInterval(() => {
            setActiveService((prev) => (prev + 1) % 3);
        }, 5000); // 5 seconds for tuning menu

        const testimonialInterval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % 3);
        }, 4500); // 4.5 seconds for testimonials

        return () => {
            clearInterval(metricInterval);
            clearInterval(serviceInterval);
            clearInterval(testimonialInterval);
        };
    }, []);

    useEffect(() => {
        const playAudio = () => {
            if (audioRef.current) {
                audioRef.current.play()
                    .then(() => {
                        setIsPlaying(true);
                        document.removeEventListener('click', playAudio);
                        document.removeEventListener('touchstart', playAudio);
                    })
                    .catch(() => {
                        setIsPlaying(false);
                    });
            }
        };

        // Try playing immediately
        playAudio();

        // Fallback: play on first interaction anywhere on the page
        document.addEventListener('click', playAudio);
        document.addEventListener('touchstart', playAudio);

        return () => {
            document.removeEventListener('click', playAudio);
            document.removeEventListener('touchstart', playAudio);
        };
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleBeforeAfterMove = (e) => {
        if (!sliderContainerRef.current) return;
        const rect = sliderContainerRef.current.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        let percentage = (x / rect.width) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        setSliderPos(percentage);
    };

    return (
        <div className="bg-[#030303] text-white font-sans antialiased overflow-x-hidden selection:bg-[#FF003C] selection:text-black min-h-screen">
            {/* Global Futuristic Styles */}
            <style>
            {`
                html { scroll-behavior: smooth; }
                .neon-glow-red {
                    text-shadow: 0 0 10px rgba(255, 0, 60, 0.8), 0 0 20px rgba(255, 0, 60, 0.4);
                }
                .neon-border-red {
                    box-shadow: 0 0 15px rgba(255, 0, 60, 0.15);
                    border: 1px solid rgba(255, 0, 60, 0.3);
                }
                .neon-border-red:hover {
                    box-shadow: 0 0 25px rgba(255, 0, 60, 0.5);
                    border-color: #FF003C;
                }
                .skew-panel {
                    transform: skewY(-4deg);
                }
                .skew-panel-reverse {
                    transform: skewY(4deg);
                }
                .text-stroke {
                    -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.8);
                    color: transparent;
                }
                .text-stroke-red {
                    -webkit-text-stroke: 1.5px #FF003C;
                    color: transparent;
                }
                .speed-grid {
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
                }
                .scanline {
                    background: linear-gradient(
                        to bottom,
                        rgba(255, 255, 255, 0),
                        rgba(255, 255, 255, 0) 50%,
                        rgba(255, 0, 60, 0.04) 50%,
                        rgba(255, 0, 60, 0.04)
                    );
                    background-size: 100% 4px;
                }
                @keyframes tachometer {
                    0%, 100% { transform: rotate(-120deg); }
                    50% { transform: rotate(40deg); }
                }
                .tacho-needle {
                    animation: tachometer 4s ease-in-out infinite;
                }
            `}
            </style>
            
            <audio ref={audioRef} src="/musik.weba" loop autoPlay />

            {/* Scanline HUD Effect Over Entire Page */}
            <div className="fixed inset-0 pointer-events-none z-40 scanline opacity-30"></div>

            {/* 1. Header (Minimalist Theme) */}
            <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isHeaderScrolled ? 'bg-[#030303]/95 border-b border-[#FF003C] py-3 shadow-[0_0_20px_rgba(255,0,60,0.15)]' : 'bg-transparent py-5'}`}>
                <div className="flex justify-between items-center px-6 md:px-12 max-w-7xl mx-auto">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo_panjang.png" alt="Auto Engine Logo" className="h-8 object-contain" />
                    </Link>
                    
                    <nav className="hidden md:flex gap-8 items-center font-bold tracking-widest text-[11px] uppercase">
                        <a className="text-white hover:text-[#FF003C] hover:neon-glow-red transition-all duration-200" href="#services">LAYANAN</a>
                        <a className="text-white hover:text-[#FF003C] hover:neon-glow-red transition-all duration-200" href="#performance">PERFORMA</a>
                        <a className="text-white hover:text-[#FF003C] hover:neon-glow-red transition-all duration-200" href="#tuning">TUNING</a>
                        <a className="text-white hover:text-[#FF003C] hover:neon-glow-red transition-all duration-200" href="#testimonials">REPUTASI</a>
                    </nav>
                    
                    <div className="hidden md:flex items-center gap-6">
                        <Link className="text-white font-bold uppercase tracking-widest text-[11px] hover:text-[#FF003C] transition-colors" to="/login">LOGIN</Link>
                        <Link className="bg-[#FF003C] text-white hover:bg-white hover:text-black transition-colors px-5 py-2.5 font-black uppercase tracking-widest text-xs" to="/register">
                            BOOK NOW
                        </Link>
                    </div>

                    <button className="md:hidden text-white hover:text-[#FF003C] transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-[#030303]/98 border-b border-[#FF003C] py-8 px-8 flex flex-col gap-6 font-black tracking-widest uppercase text-center shadow-2xl">
                        <a className="text-white hover:text-[#FF003C] py-2" href="#services" onClick={() => setIsMenuOpen(false)}>LAYANAN</a>
                        <a className="text-white hover:text-[#FF003C] py-2" href="#performance" onClick={() => setIsMenuOpen(false)}>PERFORMA</a>
                        <a className="text-white hover:text-[#FF003C] py-2" href="#tuning" onClick={() => setIsMenuOpen(false)}>TUNING</a>
                        <a className="text-white hover:text-[#FF003C] py-2" href="#testimonials" onClick={() => setIsMenuOpen(false)}>REPUTASI</a>
                        <hr className="border-white/5" />
                        <Link className="text-white hover:text-[#FF003C] py-2" to="/login" onClick={() => setIsMenuOpen(false)}>LOGIN</Link>
                        <Link className="bg-[#FF003C] text-white py-4 font-black tracking-widest" to="/register" onClick={() => setIsMenuOpen(false)}>BOOK NOW</Link>
                    </div>
                )}
            </header>

            <main className="speed-grid">
                {/* 2. Hero Section - Left Aligned for Video Visibility */}
                <section className="relative h-screen w-full flex items-center justify-start overflow-hidden">
                    {/* Background Video */}
                    <div className="absolute inset-0 z-0 bg-[#030303]">
                        <video 
                            src="/video hero.mp4" 
                            className="w-full h-full object-cover opacity-85"
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                        ></video>
                        {/* Left-to-Right Dark Gradient: Leaves right side clear and bright for the video */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/95 via-[#030303]/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#030303] to-transparent"></div>
                    </div>

                    <div className="relative z-10 w-full px-6 md:px-16 lg:pl-32 lg:pr-12 flex flex-col items-start text-left md:w-3/5">
                        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black italic tracking-tighter leading-none uppercase select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                            SPEED <span className="text-stroke">LIMIT:</span>
                        </h1>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-none uppercase text-[#FF003C] neon-glow-red select-none mb-6 mt-2 md:mt-0">
                            UNLIMITED.
                        </h1>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6">
                            <Link className="bg-[#FF003C] text-black hover:bg-white hover:text-black hover:shadow-[0_0_20px_#FF003C] transition-all duration-300 px-10 py-4 font-black uppercase tracking-widest text-xs text-center" to="/register">
                                BOOKING SEKARANG
                            </Link>
                            <a href="#services" className="border border-white/40 hover:border-[#FF003C] hover:text-[#FF003C] transition-all duration-300 px-10 py-4 font-black uppercase tracking-widest text-xs text-center">
                                MENU LAYANAN
                            </a>
                        </div>
                    </div>

                    {/* Audio Control (Left Aligned) */}
                    <button 
                        className={`absolute bottom-8 left-6 md:left-12 z-20 w-12 h-12 flex items-center justify-center transition-all border ${isPlaying ? 'border-[#FF003C] text-[#FF003C] bg-black/60 shadow-[0_0_15px_rgba(255,0,60,0.4)]' : 'border-white/20 text-white/50 bg-black/40 hover:border-[#FF003C] hover:text-[#FF003C]'}`} 
                        onClick={toggleMusic}
                    >
                        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>
                </section>

                {/* 3. Interactive Spec Sheet (Performance Features) */}
                <section className="py-32 bg-[#0c0c0e] border-t border-[#FF003C]/20 relative" id="performance">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="drift-reveal translate-y-12 opacity-0 transition-all duration-700">
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none mb-6">
                                    TUNED TO <span className="text-stroke-red">PERFECTION.</span>
                                </h2>
                                <p className="text-gray-400 font-medium text-lg leading-relaxed mb-12">
                                    Presisi tinggi, transparansi penuh, dan teknologi real-time yang memastikan mesin Anda kembali ke kondisi puncaknya tanpa hambatan.
                                </p>
                                
                                <div className="space-y-4">
                                    {[
                                        { num: "01", title: "Live ECU Telemetry" },
                                        { num: "02", title: "Biaya Transparan" },
                                        { num: "03", title: "Zero Queue Circuit" }
                                    ].map((feature, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setActiveMetric(idx)}
                                            className={`w-full flex items-center gap-6 p-4 md:p-6 transition-all duration-300 border-l-4 text-left ${activeMetric === idx ? 'bg-[#FF003C]/10 border-[#FF003C]' : 'border-transparent hover:bg-white/5'}`}
                                        >
                                            <span className={`font-mono font-black text-2xl transition-colors ${activeMetric === idx ? 'text-[#FF003C]' : 'text-gray-600'}`}>{feature.num}</span>
                                            <span className={`text-xl font-black uppercase tracking-wider transition-colors ${activeMetric === idx ? 'text-white' : 'text-gray-400'}`}>{feature.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="relative h-[320px] sm:h-[400px] md:h-[500px] bg-black/50 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden group drift-reveal translate-y-12 opacity-0 transition-all duration-700 delay-200">
                                {[
                                    { icon: <Cpu size={64} strokeWidth={1} />, title: "Live ECU Telemetry", desc: "Pantau setiap proses pembongkaran, perakitan, dan pengujian mobil Anda secara langsung dari dashboard digital. Sistem telemetri kami memberikan data realtime langsung ke genggaman Anda.", img: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800" },
                                    { icon: <Disc size={64} strokeWidth={1} />, title: "Biaya Transparan", desc: "Estimasi harga presisi berdasarkan parts original tanpa biaya gaib atau tambahan sepihak. AI kami menganalisa kerusakan dan memberikan kutipan harga sebelum kunci Anda serahkan.", img: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800" },
                                    { icon: <Compass size={64} strokeWidth={1} />, title: "Zero Queue Circuit", desc: "Sistem penjadwalan terpadu yang menjamin slot pengerjaan langsung aktif begitu kendaraan Anda tiba. Waktu Anda berharga, biarkan kami yang berpacu dengan waktu.", img: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=800" }
                                ].map((content, idx) => (
                                    <div 
                                        key={idx}
                                        className={`absolute inset-0 transition-all duration-700 ${activeMetric === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
                                    >
                                        {/* Background Image with slow zoom effect */}
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-linear" style={{ backgroundImage: `url('${content.img}')`, transform: activeMetric === idx ? 'scale(1.1)' : 'scale(1)' }}></div>
                                        
                                        {/* Overlays to ensure text readability */}
                                        <div className="absolute inset-0 bg-black/40"></div>
                                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FF003C]/40 via-transparent to-black opacity-80"></div>
                                        
                                        {/* Content */}
                                        <div className={`relative h-full p-8 md:p-12 flex flex-col items-center justify-center text-center transition-all duration-700 transform ${activeMetric === idx ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                                            <div className="text-[#FF003C] mb-6 bg-black/50 p-4 rounded-full border border-white/10 backdrop-blur-sm">
                                                {content.icon}
                                            </div>
                                            <p className="text-gray-200 md:text-lg leading-relaxed max-w-md font-medium">
                                                {content.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Ping indicator */}
                                <div className="absolute bottom-4 right-4 flex space-x-1 z-20">
                                    <div className="w-2 h-2 bg-[#FF003C] rounded-full animate-ping"></div>
                                    <div className="w-2 h-2 bg-[#FF003C] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Interactive Tuning Menu */}
                <section className="py-32 bg-[#131315] border-t border-white/5 relative" id="services">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="mb-12 md:mb-20 text-center drift-reveal translate-y-12 opacity-0 transition-all duration-700">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                                TUNING <span className="text-[#FF003C]">MENU.</span>
                            </h2>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Tabs Navigation */}
                            <div className="lg:w-1/3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
                                {[
                                    { stage: "STAGE 1", name: "Ganti Oli & Filter" },
                                    { stage: "STAGE 2", name: "Rem & Kaki-Kaki" },
                                    { stage: "STAGE 3", name: "Overhaul Total" }
                                ].map((service, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveService(idx)}
                                        className={`flex-shrink-0 lg:flex-shrink w-48 sm:w-64 lg:w-full text-left p-4 sm:p-6 border transition-all duration-300 relative overflow-hidden group
                                        ${activeService === idx 
                                            ? 'border-[#FF003C] bg-[#FF003C]/5' 
                                            : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${activeService === idx ? 'bg-[#FF003C]' : 'bg-transparent'}`}></div>
                                        <span className={`font-bold text-xs block mb-1 transition-colors ${activeService === idx ? 'text-[#FF003C]' : 'text-gray-500'}`}>{service.stage}</span>
                                        <h3 className={`text-xl font-black uppercase tracking-tight transition-colors ${activeService === idx ? 'text-white' : 'text-gray-400'}`}>{service.name}</h3>
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content Display */}
                            <div className="lg:w-2/3 relative overflow-hidden min-h-[500px] flex">
                                {[
                                    { stage: "STAGE 1", name: "Ganti Oli & Filter", desc: "Penyegaran oli mesin full-synthetic beserta filter oli orisinal untuk menjaga performa optimal kendaraan sehari-hari Anda.", time: "45 Menit", price: "Mulai Rp 850.000", includes: ["Pengecekan 20 Titik", "Ganti Filter Oli OEM", "Full Synthetic Oil"], img: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&q=80&w=800" },
                                    { stage: "STAGE 2", name: "Rem & Kaki-Kaki", desc: "Pengecekan mendetail oleh mekanik ahli kami pada sistem pengereman dan kalibrasi suspensi untuk kenyamanan berkendara.", time: "90 Menit", price: "Mulai Rp 2.500.000", includes: ["Brake Fluid Flush", "Brake Pad Check/Replace", "Wheel Alignment & Balancing"], img: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80&w=800" },
                                    { stage: "STAGE 3", name: "Overhaul Total", desc: "Restorasi mesin secara menyeluruh. Tim spesialis kami akan membongkar, membersihkan, dan mengembalikan tenaga mesin seperti baru.", time: "3-5 Hari", price: "Sesuai Konsultasi", includes: ["Full Engine Disassembly", "Pembersihan & Penggantian Part", "Testing & Kalibrasi"], img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800" }
                                ].map((service, idx) => (
                                    <div 
                                        key={idx}
                                        className={`absolute inset-0 flex flex-col md:flex-row transition-all duration-700 bg-black/40 border border-white/10 rounded-xl overflow-hidden ${activeService === idx ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}
                                    >
                                        {/* Image side */}
                                        <div className="md:w-2/5 h-48 md:h-full relative">
                                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${service.img}')` }}></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:hidden"></div>
                                            <div className="absolute inset-0 bg-gradient-to-l from-[#0c0c0e] to-transparent hidden md:block opacity-50"></div>
                                        </div>
                                        
                                        {/* Content side */}
                                        <div className="md:w-3/5 p-8 flex flex-col justify-center bg-[#0c0c0e]">
                                            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                                                <div>
                                                    <span className="font-bold text-sm text-[#FF003C] block mb-1">{service.stage}</span>
                                                    <h3 className="text-3xl font-black uppercase tracking-tight">{service.name}</h3>
                                                </div>
                                                <div className="text-left md:text-right w-full md:w-auto">
                                                    <span className="text-sm text-gray-400 flex items-center md:justify-end gap-1 mb-1"><Clock size={14} className="text-[#FF003C]"/> {service.time}</span>
                                                    <span className="text-white font-bold">{service.price}</span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-gray-300 text-base leading-relaxed mb-8">{service.desc}</p>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                                                {service.includes.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-400">
                                                        <div className="w-1.5 h-1.5 bg-[#FF003C] rounded-full"></div>
                                                        {item}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="mt-auto">
                                                <Link to="/register" className="inline-flex px-8 py-3 bg-[#FF003C] text-white text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-white hover:text-black transition-colors items-center gap-2 group">
                                                    Pilih Paket <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Interactive Before/After Slider */}
                <section className="py-32 bg-[#080809] border-t border-white/5" id="tuning">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-20">
                            <div>
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                                    HASIL <span className="text-stroke-red">RESTORASI.</span>
                                </h2>
                            </div>
                            <p className="text-gray-400 font-medium max-w-sm font-mono text-xs">
                                DRAG THE SLIDER TO COMPARE THE TUNING STAGES CONFIGURATION
                            </p>
                        </div>

                        {/* Drag Slider Component */}
                        <div 
                            ref={sliderContainerRef} 
                            className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-[21/9] overflow-hidden select-none cursor-ew-resize border border-[#FF003C]/30 shadow-[0_0_30px_rgba(255,0,60,0.1)] bg-[#030303]"
                            onMouseMove={handleBeforeAfterMove}
                            onTouchMove={handleBeforeAfterMove}
                        >
                            {/* After (Clean Engine / Tuning) */}
                            <div className="absolute inset-0 bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url('/after.png')" }}></div>
                            
                            {/* Before (Dirty Engine / overlay) */}
                            <div 
                                className="absolute inset-0 bg-contain bg-center bg-no-repeat" 
                                style={{ 
                                    backgroundImage: "url('/before.png')",
                                    clipPath: `inset(0 ${100 - sliderPos}% 0 0)`
                                }}
                            ></div>

                            {/* Info Badges */}
                            <div className="absolute top-6 left-6 z-20 pointer-events-none bg-black/80 border border-white/10 px-4 py-1.5 font-mono text-xs text-gray-300 uppercase tracking-widest">
                                BEFORE STAGE
                            </div>
                            <div className="absolute top-6 right-6 z-20 pointer-events-none bg-[#FF003C] px-4 py-1.5 font-mono text-xs text-black font-black uppercase tracking-widest">
                                AFTER TUNED
                            </div>

                            {/* Slider Handle */}
                            <div 
                                className="absolute top-0 bottom-0 w-0.5 bg-[#FF003C] pointer-events-none z-20"
                                style={{ left: `${sliderPos}%` }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-black border-2 border-[#FF003C] rounded-full flex items-center justify-center text-[#FF003C] shadow-[0_0_20px_#FF003C] text-sm font-bold">
                                    ↔
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Testimonials (Street Reputation) - Interactive Carousel */}
                <section className="py-32 bg-[#1a1a1c] border-t border-white/5 relative overflow-hidden" id="testimonials">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase">
                                STREET <span className="text-stroke-red">REPUTATION.</span>
                            </h2>
                        </div>
                        
                        <div className="relative">
                            {/* Navigation Buttons */}
                            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20">
                                <button 
                                    onClick={() => setActiveTestimonial(prev => (prev === 0 ? 2 : prev - 1))}
                                    className="w-12 h-12 bg-black/80 border border-white/20 text-white rounded-full flex items-center justify-center hover:border-[#FF003C] hover:text-[#FF003C] transition-colors"
                                >
                                    <ChevronRight size={24} className="rotate-180" />
                                </button>
                            </div>
                            
                            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20">
                                <button 
                                    onClick={() => setActiveTestimonial(prev => (prev === 2 ? 0 : prev + 1))}
                                    className="w-12 h-12 bg-black/80 border border-white/20 text-white rounded-full flex items-center justify-center hover:border-[#FF003C] hover:text-[#FF003C] transition-colors"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {/* Carousel Container */}
                            <div className="overflow-hidden">
                                <div 
                                    className="flex transition-transform duration-700 ease-in-out"
                                    style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                                >
                                    {[
                                        { src: "/testimoni1.png", alt: "Testimonial Domi" },
                                        { src: "/testimoni2.png", alt: "Testimonial O'Conner" },
                                        { src: "/testimoni3.png", alt: "Testimonial Subianto" }
                                    ].map((testi, idx) => (
                                        <div key={idx} className="w-full flex-shrink-0 px-4 md:px-8 flex justify-center">
                                            <div className="w-full max-w-4xl flex justify-center">
                                                <img 
                                                    src={testi.src} 
                                                    alt={testi.alt} 
                                                    className="w-full max-h-[250px] sm:max-h-[400px] md:max-h-[500px] object-contain drop-shadow-[0_10px_20px_rgba(255,0,60,0.15)]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Pagination Dots */}
                            <div className="flex justify-center gap-3 mt-8">
                                {[0, 1, 2].map((idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveTestimonial(idx)}
                                        className={`h-1.5 transition-all duration-300 rounded-full ${activeTestimonial === idx ? 'w-8 bg-[#FF003C]' : 'w-2 bg-gray-600 hover:bg-gray-400'}`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Final CTA (The Finish Line) */}
                <section className="py-36 bg-[#0c0c0e] text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity" style={{backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')"}}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-[#0c0c0e]"></div>
                    <div className="absolute inset-0 bg-[#FF003C]/10 backdrop-blur-[2px]"></div>
                    
                    <div className="max-w-4xl mx-auto relative z-10 px-6">
                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                            WAKTUNYA TURUN<br/>KE JALAN.
                        </h2>
                        <p className="max-w-lg mx-auto font-black uppercase text-[10px] sm:text-xs tracking-widest text-gray-300 mb-10">
                            Jadwalkan tuning rutin untuk menjaga performa optimal mesin kendaraan Anda.
                        </p>
                        <Link className="inline-block bg-[#FF003C] text-white px-8 py-4 sm:px-14 sm:py-5 font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-white hover:text-black transition-colors duration-300 shadow-[0_10px_35px_rgba(255,0,60,0.3)] rounded-lg" to="/register">
                            <span>REGISTRASI JADWAL SEKARANG</span>
                        </Link>
                    </div>
                </section>
            </main>

            {/* 8. Footer */}
            <footer className="bg-[#030303] border-t-2 border-[#FF003C] w-full pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-4 mb-6">
                                <img src="/logo_bulet.png" alt="Auto Engine Logo" className="h-14 w-14 object-contain" />
                                <h3 className="text-3xl font-black italic tracking-tighter uppercase">Auto Engine</h3>
                            </div>
                            <p className="text-gray-400 font-medium max-w-sm leading-relaxed text-sm">
                                Bengkel spesialis modifikasi, overhaul mesin presisi tinggi, dan perawatan reguler kendaraan Anda. Jalan Raya Pasar Kemis Jatiuwung, Tangerang.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-[#FF003C] font-black uppercase tracking-widest text-xs mb-6">// TRANSMISI</h4>
                            <ul className="space-y-4 font-black text-[11px] uppercase tracking-wider">
                                <li>
                                    <a className="text-gray-400 hover:text-white transition-colors flex items-center gap-3.5" href="#">
                                        <Phone size={14} className="text-[#FF003C]" /> 085695115354
                                    </a>
                                </li>
                                <li>
                                    <a className="text-gray-400 hover:text-white transition-colors flex items-center gap-3.5" href="https://wa.me/085695115354" target="_blank" rel="noopener noreferrer">
                                        <MessageSquare size={14} className="text-[#FF003C]" /> WhatsApp
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-[#FF003C] font-black uppercase tracking-widest text-xs mb-6">// SIRKUIT MENU</h4>
                            <ul className="space-y-4 font-black text-[11px] uppercase tracking-wider">
                                <li><a className="text-gray-400 hover:text-white transition-colors" href="#services">Layanan</a></li>
                                <li><a className="text-gray-400 hover:text-white transition-colors" href="#performance">Performa</a></li>
                                <li><a className="text-gray-400 hover:text-white transition-colors" href="#tuning">Hasil Tuning</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-gray-600 uppercase tracking-widest">
                        <p>© 2026 Auto Engine. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-[#FF003C] transition-colors flex items-center gap-1.5"><Instagram size={12}/> Instagram</a>
                            <a href="#" className="hover:text-[#FF003C] transition-colors flex items-center gap-1.5"><Facebook size={12}/> Facebook</a>
                        </div>
                    </div>
                </div>
            </footer>
            
            {/* Floating WhatsApp Button */}
            <a aria-label="Contact via WhatsApp" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 pulsing-fab" href="https://wa.me/085695115354" target="_blank" rel="noopener noreferrer">
                <MessageSquare size={26} />
            </a>
        </div>
    );
};

export default LandingPage;
