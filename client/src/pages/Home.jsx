import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNav from '../components/BottomNav';
import PinModal from '../components/PinModal';

const HeroSlider = () => {
    const slides = [
        { type: 'image', url: '/images/dove-hero.png' },
        { type: 'video', url: '/video/sayedai.mp4' },
        { type: 'video', url: '/video/saydai2.mp4' }
    ];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="relative overflow-hidden rounded-2xl mx-4 mt-4 bg-dark-200 h-56 shadow-xl">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {slide.type === 'video' ? (
                        <video
                            src={slide.url}
                            autoPlay
                            muted={true}
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={slide.url}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentSlide ? 'bg-primary w-4' : 'bg-white/30'}`}
                    ></div>
                ))}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10"></div>
        </div>
    );
};

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showPinModal, setShowModal] = useState(false);
    const [pinMode, setPinMode] = useState('verify'); // 'setup' or 'verify'
    const [actionType, setActionType] = useState(null); // 'deposit' or 'withdraw'
    const [stats, setStats] = useState(null);
    const [companyInfo, setCompanyInfo] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [statsRes, infoRes] = await Promise.all([
                axios.get('/api/home/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                axios.get('/api/home/company-info')
            ]);
            setStats(statsRes.data);
            setCompanyInfo(infoRes.data);
        } catch (error) {
            console.error('Error fetching home data:', error);
        }
    };

    const handleActionClick = (type) => {
        setActionType(type);
        if (user?.hasTransactionPin) {
            setPinMode('verify');
        } else {
            setPinMode('setup');
        }
        setShowModal(true);
    };

    const handlePinSuccess = () => {
        setShowModal(false);
        if (actionType === 'deposit') {
            navigate('/deposit');
        } else if (actionType === 'withdraw') {
            navigate('/withdraw');
        }

        if (pinMode === 'setup') {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-dark-300 pb-24">
            <PinModal
                isOpen={showPinModal}
                onClose={() => setShowModal(false)}
                onSuccess={handlePinSuccess}
                mode={pinMode}
            />

            {/* Header */}
            <div className="bg-dark-200 border-b border-white/10">
                <div className="max-w-md mx-auto px-4 py-1.5 flex items-center justify-between relative">
                    <div className="w-10"></div>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-white font-bold text-lg">Home</h1>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <button
                            onClick={() => navigate('/notifications')}
                            className="relative p-2 text-white/60 hover:text-primary transition-colors hover:bg-white/5 rounded-full"
                        >
                            <Bell size={20} />
                            {stats?.unreadNotifications > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-200 animate-pulse"></span>
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/help')}
                            className="relative p-2 text-white/60 hover:text-primary transition-colors hover:bg-white/5 rounded-full"
                        >
                            <HelpCircle size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto space-y-4">
                {/* Hero Slider */}
                <HeroSlider />

                {/* Withdraw and Deposit Sections */}
                <div className="px-4">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Withdraw Section */}
                        <div
                            onClick={() => handleActionClick('withdraw')}
                            className="glass-card p-4 text-center cursor-pointer hover:bg-glass-medium transition-all"
                        >
                            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-1">Withdraw</h3>
                            <p className="text-white/60 text-xs">Fast withdrawal</p>
                        </div>

                        {/* Deposit Section */}
                        <div
                            onClick={() => handleActionClick('deposit')}
                            className="glass-card p-4 text-center cursor-pointer hover:bg-glass-medium transition-all"
                        >
                            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5l9 2-9 18-9-18 9-2zm0 0v8" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold mb-1">Deposit</h3>
                            <p className="text-white/60 text-xs">Quick deposit</p>
                        </div>
                    </div>
                </div>

                {/* Company Information Section */}
                <div className="px-4">
                    <div className="glass-card p-6 text-center">
                        <div className="mb-4">
                            <h2 className="text-white text-xl font-bold mb-2">{companyInfo?.name || 'Dove Investment Company'}</h2>
                            <p className="text-white/70 text-sm leading-relaxed">
                                {companyInfo?.description || 'Your trusted partner in financial growth. We provide secure and profitable investment solutions with transparency and excellence.'}
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/about')}
                            className="w-full bg-gradient-primary text-white font-semibold py-3 px-6 rounded-xl hover:shadow-glow-lg transition-all"
                        >
                            Learn More About Us
                        </button>
                    </div>
                </div>

                {/* Social Links Section */}
                <div className="px-4 pb-4">
                    <div className="glass-card p-6">
                        <h3 className="text-white font-semibold mb-6 text-center">Join Our Community</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Telegram */}
                            <a
                                href="http://t.me/+HLU8tk3MCGYwMWQ1"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-14 h-14 bg-[#229ED9]/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[#229ED9]/20 shadow-glow">
                                    <svg className="w-8 h-8 text-[#229ED9]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.944 0C5.337 0 0 5.337 0 11.944c0 6.607 5.337 11.944 11.944 11.944 6.607 0 11.944-5.337 11.944-11.944C23.888 5.337 18.551 0 11.944 0zm5.833 8.3c-.157 1.488-.815 5.39-1.151 7.185-.143.76-.423 1.014-.694 1.039-.59.055-1.038-.389-1.609-.764-.894-.585-1.398-.948-2.266-1.52-.998-.66-.35-1.024.218-1.613.149-.153 2.73-2.503 2.78-2.716.006-.027.012-.128-.048-.182-.06-.053-.147-.035-.211-.02-.09.02-1.528.972-4.308 2.844-.407.28-.777.417-1.11.41-.366-.008-1.072-.207-1.597-.377-.643-.21-1.154-.321-1.109-.677.023-.186.279-.377.766-.576 3-.1.3 6.136-2.559 8.601-3.636.223-.098.444-.146.66-.146.544 0 1.012.298 1.485.832l.061.072c.42.505 1.076.69 1.637.456.56-.234.93-.801.91-1.405l-.001-.044c-.015-.6-.208-1.282-.57-2.046a.333.333 0 01.127-.428z" />
                                    </svg>
                                </div>
                                <span className="text-xs text-white/60">Telegram</span>
                            </a>

                            {/* Facebook */}
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-14 h-14 bg-[#1877F2]/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[#1877F2]/20 shadow-glow">
                                    <svg className="w-8 h-8 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </div>
                                <span className="text-xs text-white/60">Facebook</span>
                            </a>

                            {/* Instagram */}
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-2 group"
                            >
                                <div className="w-14 h-14 bg-[#E4405F]/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-[#E4405F]/20 shadow-glow">
                                    <svg className="w-8 h-8 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.668.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.998 3.998 0 110-7.996 3.998 3.998 0 010 7.996zm6.406-11.845a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z" />
                                    </svg>
                                </div>
                                <span className="text-xs text-white/60">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>


            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Home;
