import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Users,
    Wallet,
    Award,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    Activity,
    Clock,
    DollarSign
} from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { toast } from 'react-toastify';

const History = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/stats/user-history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (error) {
            console.error('Fetch history error:', error);
            toast.error('Failed to load history data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (type) => {
        switch (type) {
            case 'deposit': return 'text-green-400 bg-green-400/10';
            case 'withdrawal': return 'text-red-400 bg-red-400/10';
            case 'investment': return 'text-blue-400 bg-blue-400/10';
            case 'commission': return 'text-yellow-400 bg-yellow-400/10';
            default: return 'text-primary bg-primary/10';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-300 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-300 pb-24">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 bg-dark-200/80 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-xl font-black text-white tracking-tight">Financial History</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
                {/* Ranking & Status Card */}
                <div className="relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/5 to-transparent opacity-50"></div>
                    <div className="glass-card relative p-6 border-primary/20">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-white/40 text-[10px] uppercase font-black tracking-widest mb-1">Current Membership</h2>
                                <div className="text-3xl font-black text-white italic">VIP Level {data?.vipLevel || 0}</div>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(164,241,58,0.2)]">
                                <Award size={28} />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                                <div className="text-white/40 text-[9px] uppercase font-bold mb-1">Efficiency</div>
                                <div className="text-primary font-black text-lg">+12.4%</div>
                            </div>
                            <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                                <div className="text-white/40 text-[9px] uppercase font-bold mb-1">Trust Score</div>
                                <div className="text-white font-black text-lg">98%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Overview Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="glass-card p-4 border-green-500/20">
                        <div className="flex items-center gap-2 text-green-400 mb-2">
                            <TrendingUp size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Total Deposit</span>
                        </div>
                        <div className="text-2xl font-black text-white">${data?.totalDeposited?.toFixed(2) || '0.00'}</div>
                        <div className="text-white/20 text-[9px] mt-1 font-medium italic">Approved Assets</div>
                    </div>
                    <div className="glass-card p-4 border-red-500/20">
                        <div className="flex items-center gap-2 text-red-400 mb-2">
                            <TrendingDown size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Total Withdraw</span>
                        </div>
                        <div className="text-2xl font-black text-white">${data?.totalWithdrawn?.toFixed(2) || '0.00'}</div>
                        <div className="text-white/20 text-[9px] mt-1 font-medium italic">Sent to Gateway</div>
                    </div>
                    <div className="glass-card p-4 col-span-2 border-primary/20 bg-gradient-to-r from-dark-200 to-primary/10">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 text-primary mb-2">
                                    <Wallet size={16} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Accumulated Earnings</span>
                                </div>
                                <div className="text-3xl font-black text-white">${data?.totalEarned?.toFixed(2) || '0.00'}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-white/40 text-[9px] uppercase font-bold">Available Now</div>
                                <div className="text-lg font-black text-white/60">${data?.balance?.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Structure breakdown */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-black text-sm flex items-center gap-2 italic">
                            <Users size={18} className="text-primary" />
                            TEAM NETWORK ANALYSIS
                        </h3>
                        <div className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-[10px] font-bold border border-white/5">
                            Total: {data?.team?.total || 0}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="group">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-white/60 text-[10px] font-bold uppercase">1st Generation</span>
                                <span className="text-white font-black text-sm">{data?.team?.gen1 || 0} <span className="text-[10px] text-white/30 italic">Direct</span></span>
                            </div>
                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${Math.min((data?.team?.gen1 / 20) * 100, 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-white/60 text-[10px] font-bold uppercase">2nd Generation</span>
                                <span className="text-white font-black text-sm">{data?.team?.gen2 || 0} <span className="text-[10px] text-white/30 italic">Sub-direct</span></span>
                            </div>
                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min((data?.team?.gen2 / 40) * 100, 100)}%` }}></div>
                            </div>
                        </div>

                        <div className="group">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-white/60 text-[10px] font-bold uppercase">3rd Generation</span>
                                <span className="text-white font-black text-sm">{data?.team?.gen3 || 0} <span className="text-[10px] text-white/30 italic">Associates</span></span>
                            </div>
                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min((data?.team?.gen3 / 80) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activities List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-white font-black text-sm flex items-center gap-2 italic">
                            <Activity size={18} className="text-primary" />
                            LIVE TRANSACTION LOG
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {data?.history?.length > 0 ? (
                            data.history.map((log, index) => (
                                <div key={log._id || index} className="glass-card p-4 hover:bg-white/5 transition-colors border-white/5 group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getStatusColor(log.type)}`}>
                                            {log.type === 'deposit' && <TrendingUp size={20} />}
                                            {log.type === 'withdrawal' && <TrendingDown size={20} />}
                                            {log.type === 'investment' && <Award size={20} />}
                                            {log.type === 'commission' && <Users size={20} />}
                                            {log.type === 'bonus' && <DollarSign size={20} />}
                                            {log.type === 'system' && <Activity size={20} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-white font-bold text-xs truncate group-hover:text-primary transition-colors">{log.title}</h4>
                                                <span className="text-white font-black text-xs whitespace-nowrap">
                                                    {log.amount > 0 ? (log.type === 'withdrawal' ? '-' : '+') : ''}
                                                    ${log.amount?.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-white/40 text-[9px] font-medium flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${getStatusColor(log.type)}`}>
                                                    {log.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 glass-card">
                                <Activity className="mx-auto text-white/10 mb-2" size={32} />
                                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">No activities recorded yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default History;
