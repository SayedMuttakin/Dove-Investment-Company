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
                <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between relative">
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
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Home;
