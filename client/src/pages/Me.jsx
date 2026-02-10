import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import {
    User,
    Copy,
    LogOut,
    Shield,
    ChevronRight,
    Star,
    Users,
    DollarSign,
    Download,
    Camera,
    HelpCircle,
    Bell,
    Briefcase,
    History,
    UserPlus
} from 'lucide-react';
import axios from 'axios';
import { usePWA } from '../hooks/usePWA';
import { toast } from 'react-toastify';

const Me = () => {
    const navigate = useNavigate();
    const { user, logout, updateUserInfo } = useAuth();
    const { isInstallable, installApp } = usePWA();
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        console.log('Current User Data in Me.jsx:', user);
    }, [user]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/profile/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });

            if (updateUserInfo) {
                updateUserInfo({ profileImage: res.data.user.profileImage });
            }
            toast.success('Profile updated successfully!');
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async () => {
        const installed = await installApp();
        if (installed) {
            console.log('App installed successfully');
        } else {
            // If the prompt isn't valid (e.g. iOS or already installed or event missed)
            toast.info('To install: Tap browser menu (⋮ or Share) > Add to Home Screen/Install App');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const copyInvitationCode = () => {
        const referralLink = `${window.location.origin}/register?ref=${user?.invitationCode || ''}`;
        navigator.clipboard.writeText(referralLink);
        toast.info('Referral link copied!');
    };

    const getVIPBadge = (level) => {
        const badges = {
            5: { name: '👑 ELITE', color: 'from-yellow-400 to-amber-500', textColor: 'text-black' },
            4: { name: '💎 PLATINUM', color: 'from-purple-500 to-pink-500', textColor: 'text-white' },
            3: { name: '⭐ GOLD', color: 'from-blue-500 to-cyan-400', textColor: 'text-white' },
            2: { name: '🥈 SILVER', color: 'from-violet-500 to-purple-400', textColor: 'text-white' },
            1: { name: '🥉 BRONZE', color: 'from-indigo-500 to-blue-400', textColor: 'text-white' },
            0: { name: '🌟 STARTER', color: 'from-slate-500 to-gray-400', textColor: 'text-white' }
        };
        return badges[level] || badges[0];
    };

    const currentLevel = user?.vipLevel || 0;
    const currentTeam = user?.stats?.teamMembers || 0;

    const levelRequirements = [
        { from: 0, to: 1, members: 12, minInvestment: 50, maxInvestment: 2000, tree: { l1: 2, l2: 4 }, incomeRates: { d7: '0.90%', d30: '1.20%', d60: '1.50%', d90: '1.80%' }, teamIncome: { first: '9%', second: '6%', third: '3%' } },
        { from: 1, to: 2, members: 24, minInvestment: 300, maxInvestment: 3000, tree: { l1: 4, l2: 8 }, incomeRates: { d7: '1.10%', d30: '1.40%', d60: '1.70%', d90: '2.00%' }, teamIncome: { first: '10%', second: '7%', third: '4%' } },
        { from: 2, to: 3, members: 48, minInvestment: 500, maxInvestment: 4000, tree: { l1: 8, l2: 16 }, incomeRates: { d7: '1.40%', d30: '1.70%', d60: '2.00%', d90: '2.40%' }, teamIncome: { first: '11%', second: '8%', third: '5%' } },
        { from: 3, to: 4, members: 72, minInvestment: 800, maxInvestment: 5000, tree: { l1: 12, l2: 24 }, incomeRates: { d7: '1.80%', d30: '2.20%', d60: '2.70%', d90: '3.20%' }, teamIncome: { first: '12%', second: '9%', third: '6%' } },
        { from: 4, to: 5, members: 90, minInvestment: 2000, maxInvestment: 6000, tree: { l1: 15, l2: 30 }, incomeRates: { d7: '2.20%', d30: '2.60%', d60: '3.10%', d90: '3.70%' }, teamIncome: { first: '13%', second: '10%', third: '7%' } },
        { from: 5, to: 6, members: 120, minInvestment: 3000, maxInvestment: 7000, tree: { l1: 20, l2: 40 }, incomeRates: { d7: '2.70%', d30: '3.30%', d60: '4.00%', d90: '4.70%' }, teamIncome: { first: '14%', second: '11%', third: '8%' } }
    ];

    const TeamStructureTree = ({ l1, l2 }) => (
        <div className="flex flex-col items-center justify-center py-2 relative w-full px-2">
            <div className="z-10 mb-4">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    1
                </div>
            </div>
            <div className="absolute top-[28px] h-8 border-t-2 border-l-2 border-r-2 border-white/10 rounded-t-xl" style={{ width: '60%' }}></div>
            <div className="flex justify-between w-full mb-4 relative z-10 px-2">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md mb-1">
                        {l1}
                    </div>
                    <div className="h-4 w-[2px] bg-white/10"></div>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md mb-1">
                        {l1}
                    </div>
                    <div className="h-4 w-[2px] bg-white/10"></div>
                </div>
            </div>
            <div className="flex justify-between w-full relative z-10 px-2">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {l2}
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {l2}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-300 pb-20">
            {/* Compact Header */}
            <div className="bg-gradient-to-br from-primary/20 via-dark-200 to-dark-200 pt-3 pb-4">
                <div className="max-w-md mx-auto px-4">
                    {/* Profile Info Row */}
                    <div className="flex items-center justify-between mb-3 relative">
                        <div className="flex items-center gap-3 relative z-10">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative group cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center shadow-lg transition-transform group-active:scale-95">
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '';
                                                e.target.parentElement.innerHTML = '<User class="text-white" size={24} />';
                                            }}
                                        />
                                    ) : (
                                        <User className="text-white" size={24} />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-primary p-1 rounded-full border-2 border-dark-200 shadow-md">
                                    <Camera size={8} className="text-black" />
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-white font-black text-lg tracking-tight leading-none">Dove</h1>
                                <span className="text-white/60 text-[10px] font-bold mt-1">
                                    User: {user?.fullName || user?.phone || 'User'}
                                </span>
                                <span className="text-white/40 text-[9px] font-medium leading-none mt-0.5">
                                    User ID: {user?.memberId || 'N/A'}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons & Invite */}
                        <div className="flex items-center gap-1 relative z-10 justify-end">
                            <button onClick={() => navigate('/notifications')} className="p-2 text-white/60 hover:text-primary transition-colors hover:bg-white/5 rounded-full">
                                <Bell size={18} />
                            </button>
                            <button onClick={() => navigate('/help')} className="p-2 text-white/60 hover:text-primary transition-colors hover:bg-white/5 rounded-full">
                                <HelpCircle size={18} />
                            </button>
                            <button onClick={() => navigate('/change-pin')} className="p-2 text-white/60 hover:text-white transition-colors hover:bg-white/5 rounded-full">
                                <Shield size={18} />
                            </button>

                            {/* Invite Button at the end */}
                            <button
                                onClick={copyInvitationCode}
                                className="flex flex-col items-center gap-0.5 ml-1 group"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#a4f13a]/10 border border-[#a4f13a]/20 flex items-center justify-center text-[#a4f13a] transition-all group-active:scale-90 group-hover:bg-[#a4f13a]/20 shadow-lg shadow-[#a4f13a]/5">
                                    <UserPlus size={18} />
                                </div>
                                <span className="text-[#a4f13a] text-[7px] font-black uppercase tracking-tighter">Invite</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-1.5">
                        <div className="glass-card p-2">
                            <div className="text-white/40 text-[7px] uppercase mb-0.5">Balance</div>
                            <div className="text-white font-bold text-[10px]">${user?.balance?.toFixed(2) || '0.00'}</div>
                        </div>
                        <div
                            onClick={() => navigate('/history')}
                            className="glass-card p-2 cursor-pointer hover:bg-white/5 transition-colors border-white/5"
                        >
                            <div className="text-white/40 text-[7px] uppercase mb-0.5 flex items-center gap-1">
                                <History size={8} />
                                History
                            </div>
                            <div className="text-white font-bold text-[10px]">View Detail</div>
                        </div>
                        <div
                            onClick={() => navigate('/lend-funding')}
                            className="glass-card p-2 cursor-pointer hover:bg-white/5 transition-colors border-white/5"
                        >
                            <div className="text-white/40 text-[7px] uppercase mb-0.5 flex items-center gap-1">
                                <Briefcase size={8} />
                                Profits
                            </div>
                            <div className="text-white font-bold text-[10px]">Record</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-md mx-auto px-4 -mt-3 space-y-3">
                {/* VIP Levels Section */}
                <div>
                    <h2 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                        <Star size={14} className="text-primary" />
                        VIP Level Requirements
                    </h2>

                    <div className="space-y-4">
                        {levelRequirements.map((level) => {
                            const isCurrentLevel = currentLevel === level.from;
                            const progress = isCurrentLevel ? Math.min((currentTeam / level.members) * 100, 100) : 0;

                            return (
                                <div key={`${level.from}-${level.to}`} className="relative group">
                                    {/* Level Banner */}
                                    <div className="relative">
                                        <img
                                            src={`/images/vip/vip_level_${level.from}.png`}
                                            alt={`VIP Level ${level.from}`}
                                            className={`w-full h-28 rounded-t-2xl border-2 border-b-0 transition-all duration-300 object-cover ${isCurrentLevel ? 'border-[#a4f13a]' : (currentLevel >= level.from ? 'border-white/30' : 'border-white/10 hover:border-white/30')
                                                }`}
                                        />
                                        {isCurrentLevel && (
                                            <div className="absolute top-0 right-0 bg-[#a4f13a] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg z-40 border-b border-l border-white/20">
                                                ACTIVE
                                            </div>
                                        )}
                                        <div className="absolute bottom-3 right-3">
                                            <div className={`inline-flex px-2.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase backdrop-blur-sm ${currentLevel >= level.from ? 'bg-[#a4f13a]/20 text-[#a4f13a] border border-[#a4f13a]/30' : 'bg-black/60 text-white/40 border border-white/10'}`}>
                                                {currentLevel >= level.from ? 'Unlocked Zone' : 'Locked Zone'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Level Stats Panel */}
                                    <div className={`bg-dark-200 border-2 border-t-0 rounded-b-2xl p-4 pt-4 relative z-0 ${isCurrentLevel ? 'border-[#a4f13a] shadow-[0_10px_20px_rgba(164,241,58,0.1)]' : 'border-white/10'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-white font-bold text-xs">VIP Level {level.from}</span>
                                            {!isCurrentLevel && <Shield size={12} className="text-white/20" />}
                                        </div>

                                        {isCurrentLevel && (
                                            <div className="mb-4">
                                                <div className="flex justify-between text-[10px] font-bold text-white/60 mb-1">
                                                    <span>PROGRESS</span>
                                                    <span>{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-black/40 rounded-full h-2">
                                                    <div
                                                        className="h-2 rounded-full bg-gradient-to-r from-[#a4f13a] to-cyan-400 shadow-[0_0_10_rgba(164,241,58,0.5)]"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="bg-black/20 rounded-lg p-2 border border-white/5 flex flex-col items-center justify-center min-h-[140px]">
                                                <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-bold uppercase mb-2 self-start">
                                                    <Users size={10} /> Team Structure
                                                </div>
                                                <TeamStructureTree l1={level.tree.l1} l2={level.tree.l2} />
                                                <div className="mt-2 text-[10px] text-white/60 font-medium">
                                                    Total: <span className={isCurrentLevel ? "text-[#a4f13a]" : "text-white"}>{currentTeam}</span> / {level.members}
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-white/5 space-y-0.5 w-full">
                                                    <div className="text-[10px] text-white/40 font-medium flex justify-between">
                                                        <span>1st:</span>
                                                        <span className="text-cyan-400">{level.teamIncome.first}</span>
                                                    </div>
                                                    <div className="text-[10px] text-white/40 font-medium flex justify-between">
                                                        <span>2nd:</span>
                                                        <span className="text-cyan-400">{level.teamIncome.second}</span>
                                                    </div>
                                                    <div className="text-[10px] text-white/40 font-medium flex justify-between">
                                                        <span>3rd:</span>
                                                        <span className="text-cyan-400">{level.teamIncome.third}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <div className="bg-black/20 rounded-lg p-2 border border-white/5 flex flex-col items-center justify-center flex-1">
                                                    <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-bold uppercase mb-1">
                                                        <DollarSign size={10} /> Investment
                                                    </div>
                                                    <div className="text-cyan-400 font-bold text-sm">
                                                        ${level.minInvestment} - ${level.maxInvestment}
                                                    </div>
                                                </div>
                                                <div className="bg-black/20 rounded-lg p-2 border border-white/5 flex flex-col justify-center flex-1">
                                                    <div className="flex items-center gap-1.5 text-white/40 text-[9px] font-bold uppercase mb-1.5 justify-center">
                                                        <DollarSign size={10} /> Daily Income
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <div className="text-[8px] text-white/40 font-medium flex justify-between">
                                                            <span>7d:</span>
                                                            <span className="text-[#a4f13a]">{level.incomeRates.d7}</span>
                                                        </div>
                                                        <div className="text-[8px] text-white/40 font-medium flex justify-between">
                                                            <span>30d:</span>
                                                            <span className="text-[#a4f13a]">{level.incomeRates.d30}</span>
                                                        </div>
                                                        <div className="text-[8px] text-white/40 font-medium flex justify-between">
                                                            <span>60d:</span>
                                                            <span className="text-[#a4f13a]">{level.incomeRates.d60}</span>
                                                        </div>
                                                        <div className="text-[8px] text-white/40 font-medium flex justify-between">
                                                            <span>90d:</span>
                                                            <span className="text-[#a4f13a]">{level.incomeRates.d90}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => isCurrentLevel && navigate('/lend', { state: { viewLevel: level.from } })}
                                            disabled={!isCurrentLevel}
                                            className={`w-full py-3 rounded-lg font-black text-xs tracking-wider uppercase shadow-lg transition-all ${isCurrentLevel
                                                ? 'bg-gradient-to-r from-[#a4f13a] to-[#82c91e] text-black hover:shadow-[#a4f13a]/20 active:scale-[0.98]'
                                                : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                                }`}
                                        >
                                            {isCurrentLevel ? 'Details & Upgrade' : 'Locked'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Utility Options */}
                <div className="space-y-3 pb-4">
                    <div className="glass-card overflow-hidden">
                        <button
                            onClick={handleDownload}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-primary/10 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <Download size={16} className="text-primary" />
                                <span className="text-white text-sm font-medium">App Download</span>
                            </div>
                            <ChevronRight size={14} className="text-white/40" />
                        </button>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-red-500/10 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <LogOut size={16} className="text-red-400" />
                                <span className="text-red-400 text-sm font-medium">Logout</span>
                            </div>
                            <ChevronRight size={14} className="text-red-400/40" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Me;
