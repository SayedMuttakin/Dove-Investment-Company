import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, TrendingUp, Calendar, DollarSign, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PackageTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const distance = end - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft('EXPIRED');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    return <span className="font-mono">{timeLeft}</span>;
};

const Lend = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth(); // Refresh user data after investment
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [investing, setInvesting] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Determine which level to show: active state or current user level
    const targetLevel = location.state?.viewLevel !== undefined ? location.state.viewLevel : (user?.vipLevel || 0);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/invest/packages', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { vipLevel: targetLevel }
                });
                setPackages(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching packages:', err);
                setError('Failed to load investment plans');
                setLoading(false);
            }
        };

        if (user) {
            fetchPackages();
        }
    }, [user, targetLevel]);

    const handleInvest = async (pkg) => {
        // Redundant now as we redirect to deposit, but keeping for future ref or backend direct api calls if needed.
        setError('');
        setSuccess('');
        setInvesting(pkg._id);

        if (user.balance < pkg.minAmount) {
            setError(`Insufficient balance. Minimum investment is $${pkg.minAmount}`);
            setInvesting(null);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const amount = prompt(`Enter investment amount ($${pkg.minAmount} - $${pkg.maxAmount}):`, pkg.minAmount);

            if (!amount) {
                setInvesting(null);
                return;
            }

            const numAmount = parseFloat(amount);
            if (isNaN(numAmount) || numAmount < pkg.minAmount || numAmount > pkg.maxAmount) {
                setError(`Amount must be between $${pkg.minAmount} and $${pkg.maxAmount}`);
                setInvesting(null);
                return;
            }

            const response = await axios.post(
                '/api/invest/create',
                { packageId: pkg._id, amount: numAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess('Investment successful! You can check it in your assets.');
            window.location.reload();

        } catch (err) {
            setError(err.response?.data?.message || 'Investment failed');
        } finally {
            setInvesting(null);
        }
    };

    const levelImages = [
        '/images/lend_7.png',
        '/images/lend_15.png',
        '/images/lend_30.png',
        '/images/lend_45.png',
        '/images/lend_60.png',
        '/images/lend_90.png',
        '/images/lend_90.png'
    ];

    return (
        <div className="min-h-screen bg-dark-300 pb-20">
            {/* Header - Matching Home.jsx but simplified */}
            <div className="bg-dark-200 border-b border-white/10 sticky top-0 z-20">
                <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex-1 text-center">
                        <h1 className="text-white font-bold text-lg">Lend</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                            <Info size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-md mx-auto px-4 py-4 space-y-4">

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">{error}</div>}
                {success && <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-xs text-center">{success}</div>}

                {loading ? (
                    <div className="text-white/60 text-center py-20 animate-pulse">
                        <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-sm">Loading your exclusive plans...</p>
                    </div>
                ) : (
                    /* Packages List - Targeted for Single Level View */
                    <div className="space-y-6">
                        {packages.map((pkg, index) => {
                            // Use targetLevel for display consistency
                            const currentLevel = targetLevel;
                            const dispayName = pkg.name.replace(/Plan/i, '').trim();

                            // Check if user has an active investment for this package
                            const activeInvestment = user?.investments?.find(inv =>
                                inv.package.name === pkg.name && inv.status === 'active'
                            );
                            const isActive = !!activeInvestment;

                            return (
                                <div
                                    key={pkg._id}
                                    className={`bg-dark-200 rounded-3xl p-5 shadow-xl border relative overflow-hidden group ${isActive ? 'border-primary/50' : 'border-white/5'}`}
                                >
                                    {/* Active Badge if applicable */}
                                    {isActive && (
                                        <div className="absolute top-3 right-3 z-20 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-green-500/20">
                                            ACTIVE
                                        </div>
                                    )}

                                    {/* Ambient Glow */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>

                                    {/* Level Header */}
                                    <div className="relative z-10 flex justify-between items-center mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-white/40 text-[10px] uppercase tracking-wider font-bold mb-0.5">Current Level</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-lg font-bold text-white tracking-tight">LV{currentLevel}</span>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold text-white/80">
                                            {pkg.duration} Days Cycle
                                        </div>
                                    </div>

                                    {/* Hero Image - Full Width Banner Style */}
                                    <div className="relative z-10 w-[calc(100%+2.5rem)] mb-6 -mx-5 mt-4">
                                        <div className="w-full relative h-80 bg-white/5 flex items-center justify-center overflow-hidden">
                                            {(() => {
                                                const duration = pkg.duration;
                                                const isShort = duration <= 15;
                                                let fallbackSrc;

                                                if (currentLevel === 1) {
                                                    fallbackSrc = isShort ? '/images/vip_lv1_short.png' : '/images/vip_lv1_medium.png';
                                                } else if (currentLevel === 2) {
                                                    fallbackSrc = isShort ? '/images/vip_lv2_short.png' : '/images/vip_lv2_medium.png';
                                                } else if (currentLevel === 3) {
                                                    fallbackSrc = isShort ? '/images/vip_lv3_short.png' : '/images/vip_lv3_medium.png';
                                                } else if (currentLevel === 4) {
                                                    fallbackSrc = isShort ? '/images/vip_lv4_short.png' : '/images/vip_lv4_medium.png';
                                                } else if (currentLevel === 5) {
                                                    fallbackSrc = duration === 7 ? '/images/vip_lv5_7d.png' :
                                                        duration === 30 ? '/images/vip_lv5_30d.png' :
                                                            duration === 60 ? '/images/vip_lv5_60d.png' :
                                                                duration === 90 ? '/images/vip_lv5_90d.png' : '/images/vip_lv5_medium.png';
                                                } else {
                                                    fallbackSrc = levelImages[
                                                        duration === 7 ? 0 :
                                                            duration === 15 ? 1 :
                                                                duration === 30 ? 2 :
                                                                    duration === 45 ? 3 :
                                                                        duration === 60 ? 4 :
                                                                            duration === 90 ? 5 :
                                                                                duration > 90 ? 6 : 0
                                                    ];
                                                }

                                                return (
                                                    <img
                                                        src={pkg.image || fallbackSrc}
                                                        alt={pkg.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            if (e.target.src !== window.location.origin + fallbackSrc) {
                                                                e.target.src = fallbackSrc;
                                                            }
                                                        }}
                                                    />
                                                );
                                            })()}
                                            {/* Gradient overlay to help blend */}
                                            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-dark-200 to-transparent"></div>
                                        </div>
                                    </div>

                                    {/* Package Name */}
                                    <div className="relative z-10 text-center mb-6">
                                        <h2 className="text-xl font-bold text-white mb-1.5">{dispayName}</h2>
                                        <div className="h-1 w-8 bg-gradient-primary rounded-full mx-auto"></div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="relative z-10 grid gap-3 mb-6">
                                        {/* Amount */}
                                        <div className="bg-dark-300/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                                            <span className="text-white/60 font-medium text-xs">Limit</span>
                                            <div className="flex items-center gap-1 text-primary text-base font-bold">
                                                <div className="w-4 h-4 rounded-full bg-primary text-black flex items-center justify-center text-[8px] shadow-glow">T</div>
                                                {pkg.minAmount} - {pkg.maxAmount.toLocaleString()} USDT
                                            </div>
                                        </div>

                                        {/* Returns */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-dark-300/50 rounded-xl p-3 border border-white/5">
                                                <div className="text-white/40 text-[10px] mb-0.5">Daily Income</div>
                                                <div className="text-green-400 font-bold text-base">+{pkg.dailyRate}%</div>
                                            </div>
                                            <div className="bg-dark-300/50 rounded-xl p-3 border border-white/5">
                                                <div className="text-white/40 text-[10px] mb-0.5">Service Fee</div>
                                                <div className="text-white font-bold text-base">0%</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => {
                                            if (!isActive) {
                                                navigate('/deposit', {
                                                    state: {
                                                        packageId: pkg._id,
                                                        packageName: pkg.name,
                                                        minAmount: pkg.minAmount,
                                                        maxAmount: pkg.maxAmount,
                                                        vipLevel: currentLevel
                                                    }
                                                });
                                            }
                                        }}
                                        disabled={isActive}
                                        className={`relative z-10 w-full py-3 rounded-lg font-bold text-sm transition-all ${isActive
                                            ? 'bg-green-500/20 text-green-500 border border-green-500/50 cursor-default'
                                            : 'text-black bg-gradient-to-r from-primary to-secondary hover:shadow-glow-lg active:scale-[0.98]'
                                            }`}
                                    >
                                        {isActive ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <span>Ends in:</span>
                                                <PackageTimer endDate={activeInvestment.endDate} />
                                            </div>
                                        ) : 'Details'}
                                    </button>
                                </div>
                            );
                        })}
                        {/* Empty State if no package for level */}
                        {packages.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-white/40">No investment plans available for your current level.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Lend;
