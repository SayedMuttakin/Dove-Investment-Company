import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import {
    User,
    Copy,
    LogOut,
    Shield,
    Settings,
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
    UserPlus,
    Sparkles
} from 'lucide-react';
import axios from 'axios';
import { usePWA } from '../hooks/usePWA';
import { toast } from 'react-toastify';

const Me = () => {
    const navigate = useNavigate();
    const { user, logout, updateUserInfo } = useAuth();
    const { isInstallable, installApp } = usePWA();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
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

    const currentLevel = user?.vipLevel || 0;
    const currentTeam = user?.stats?.teamMembers || 0;

    const LevelStatusCard = () => {
        const levelNum = currentLevel + 1;

        return (
            <div className="relative w-full aspect-[1.8/1] sm:aspect-[2.2/1] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 mb-6 group shadow-2xl">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #333 1px, transparent 0)`,
                        backgroundSize: '24px 24px',
                    }}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
                </div>

                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative h-full px-4 sm:px-8 flex items-center justify-between">
                    <div className="flex flex-col items-center">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-150"></div>
                            <img
                                src={`/images/levels/level_${levelNum}.png`}
                                alt={`Level ${levelNum}`}
                                className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(164,241,58,0.3)] transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 mix-blend-lighten"
                                onError={(e) => { e.target.src = `/images/vip/vip_level_${levelNum}.png` }}
                            />
                        </div>
                        <div className="mt-0 flex sm:mt-1 flex-col items-center text-center">
                            <span className="text-white/40 text-[7px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-0.5 sm:mb-1">Current Status</span>
                            <span className="text-white font-black text-xl sm:text-2xl tracking-tighter italic uppercase leading-none shadow-primary/20 drop-shadow-lg scale-y-110">Level {levelNum}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:gap-3 items-end">
                        <button
                            onClick={() => navigate('/my-team')}
                            className="group/btn relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 text-white font-black text-[9px] sm:text-[10px] px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl hover:bg-white/10 active:scale-95 transition-all uppercase tracking-widest"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <Users size={12} className="sm:size-14 text-primary" />
                                My team
                            </span>
                        </button>
                        <button
                            onClick={() => navigate('/level-requirements')}
                            className="group/btn relative overflow-hidden bg-primary text-black font-black text-[9px] sm:text-[10px] px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-2xl hover:shadow-[0_0_30px_rgba(164,241,58,0.6)] active:scale-95 transition-all uppercase tracking-widest"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10 flex items-center gap-2">
                                <Star size={12} className="sm:size-14" fill="black" />
                                Upgrade credit
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const profilePic = user?.profileImage || '/images/avatar-placeholder.png';

    return (
        <div className="min-h-screen bg-dark-300 pb-24 font-sans text-gray-100">
            <div className="max-w-md mx-auto px-4 pt-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors bg-dark-200">
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-xl flex items-center justify-center text-black border-2 border-dark-300 hover:scale-110 active:scale-90 transition-all shadow-lg overflow-hidden"
                            >
                                {uploading ? (
                                    <div className="w-3 h-3 border-2 border-black/20 border-t-black animate-spin rounded-full"></div>
                                ) : (
                                    <Camera size={12} />
                                )}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight uppercase italic">{user?.fullName || 'User'}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="px-2 py-0.5 bg-primary/10 rounded-lg border border-primary/20">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">ID: {user?.memberId}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/notifications')}
                            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white/60 relative"
                        >
                            <Bell size={20} />
                            <div className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-dark-300 animate-pulse"></div>
                        </button>
                        <button
                            onClick={() => navigate('/settings')}
                            className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white/60"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                <LevelStatusCard />

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-dark-200 border border-white/5 p-5 rounded-[2rem] hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <DollarSign size={18} />
                            </div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Total Profit</span>
                        </div>
                        <p className="text-xl font-black text-white tracking-tighter">${user?.totalEarnings?.toFixed(2) || '0.00'}</p>
                    </div>
                    <div className="bg-dark-200 border border-white/5 p-5 rounded-[2rem] hover:border-cyan-500/20 transition-all">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
                                <Users size={18} />
                            </div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">Team Members</span>
                        </div>
                        <p className="text-xl font-black text-white tracking-tighter">{currentTeam}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Service Menu</h3>
                        <Sparkles size={14} className="text-primary animate-pulse" />
                    </div>

                    <div className="bg-dark-200 border border-white/5 rounded-[2.5rem] p-2">
                        <button onClick={copyInvitationCode} className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-[2rem] transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                                    <UserPlus size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="text-sm font-black text-white tracking-tight">Invite Friends</span>
                                    <p className="text-[10px] text-white/30 uppercase font-bold mt-0.5">Share your link</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                        </button>

                        <button onClick={() => navigate('/history')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-[2rem] transition-all group mt-1">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                                    <History size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="text-sm font-black text-white tracking-tight">Financial History</span>
                                    <p className="text-[10px] text-white/30 uppercase font-bold mt-0.5">Track your money</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                        </button>

                        <button onClick={() => navigate('/about')} className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-[2rem] transition-all group mt-1">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                                    <Shield size={20} />
                                </div>
                                <div className="text-left">
                                    <span className="text-sm font-black text-white tracking-tight">About NovaEarn</span>
                                    <p className="text-[10px] text-white/30 uppercase font-bold mt-0.5">Learn more about us</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                        </button>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="w-full mt-6 flex items-center justify-between p-5 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-[2.5rem] group hover:from-primary/20 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary text-black rounded-2xl shadow-lg shadow-primary/20">
                                <Download size={20} />
                            </div>
                            <div className="text-left">
                                <span className="text-sm font-black text-white tracking-tight uppercase italic">Download App</span>
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5 italic">Premium Experience</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full mt-4 flex items-center justify-center gap-2 p-5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-red-500 rounded-[2.5rem] transition-all font-black uppercase text-xs tracking-[0.2em] mb-8"
                    >
                        <LogOut size={16} />
                        Logout Session
                    </button>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default Me;
