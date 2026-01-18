import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    Users,
    Activity,
    Clock,
    DollarSign,
    Award,
    Shield,
    ChevronRight,
    LucideChevronRight
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
            {/* Header */}
            <div className="bg-dark-200 border-b border-white/5 shadow-lg">
                <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-white tracking-tight">Financial History</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-6 space-y-6">

                {/* Screenshot Match: Top Summary Banner (Lime/Light Green) */}
                <div className="bg-[#e2f5b5] rounded-2xl p-6 flex justify-between items-center shadow-lg transform hover:scale-[1.01] transition-all">
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-black font-black text-lg mb-1">{data?.totalDeposited?.toFixed(2) || '0.00'}</span>
                        <span className="text-[#5b6e36] text-[10px] font-bold uppercase tracking-wider">Total Deposit</span>
                    </div>
                    <div className="w-[1px] h-10 bg-[#5b6e36]/10"></div>
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-black font-black text-lg mb-1">{data?.totalWithdrawn?.toFixed(0) || '0'}</span>
                        <span className="text-[#5b6e36] text-[10px] font-bold uppercase tracking-wider">Total Withdrawal</span>
                    </div>
                    <div className="w-[1px] h-10 bg-[#5b6e36]/10"></div>
                    <div className="flex flex-col items-center flex-1">
                        <span className="text-black font-black text-lg mb-1">{data?.team?.total || 0}</span>
                        <span className="text-[#5b6e36] text-[10px] font-bold uppercase tracking-wider">Team Size</span>
                    </div>
                </div>

                {/* Screenshot Match: Detailed Income List */}
                <div className="glass-card p-0 overflow-hidden border-white/10">
                    <div className="divide-y divide-white/5">
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                            <span className="text-white/60 text-sm font-medium">Lost Sapphire</span>
                            <span className="text-white font-bold text-sm">0</span>
                        </div>
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                            <span className="text-white/60 text-sm font-medium">Lost Ruby</span>
                            <span className="text-white font-bold text-sm">0</span>
                        </div>
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors bg-white/[0.02]">
                            <span className="text-white/60 text-sm font-medium">Lending Income</span>
                            <span className="text-white font-black text-sm">{data?.interestIncome?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                            <span className="text-white/60 text-sm font-medium">Fund income</span>
                            <span className="text-white font-black text-sm">{data?.totalEarned?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors bg-white/[0.02]">
                            <span className="text-white/60 text-sm font-medium">Team Benefits</span>
                            <span className="text-white font-black text-sm">{data?.teamIncome?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                            <span className="text-white/60 text-sm font-medium">Bonus</span>
                            <span className="text-white font-black text-sm">{data?.bonusIncome?.toFixed(0) || '0'}</span>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-primary/10 to-transparent border-t border-primary/20">
                            <span className="text-primary font-black text-sm uppercase tracking-widest">Total Income</span>
                            <span className="text-primary font-black text-lg">{(data?.interestIncome + data?.teamIncome + data?.bonusIncome + data?.totalEarned)?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Team Section (User's extra request from previous turn) */}
                <div className="glass-card p-5">
                    <h3 className="text-white font-black text-sm flex items-center gap-2 mb-6 italic">
                        <Users size={18} className="text-primary" />
                        TEAM NETWORK ANALYSIS
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 text-center">
                            <div className="text-primary font-black text-sm mb-1">{data?.team?.gen1 || 0}</div>
                            <div className="text-[9px] text-white/40 uppercase font-bold">1st Level</div>
                        </div>
                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 text-center">
                            <div className="text-blue-400 font-black text-sm mb-1">{data?.team?.gen2 || 0}</div>
                            <div className="text-[9px] text-white/40 uppercase font-bold">2nd Level</div>
                        </div>
                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 text-center">
                            <div className="text-purple-400 font-black text-sm mb-1">{data?.team?.gen3 || 0}</div>
                            <div className="text-[9px] text-white/40 uppercase font-bold">3rd Level</div>
                        </div>
                    </div>
                </div>

                {/* Live Transactions (Keeping for professionalism) */}
                <div className="space-y-4">
                    <h3 className="text-white font-black text-sm flex items-center gap-2 italic px-1">
                        <Activity size={18} className="text-primary" />
                        LIVE TRANSACTION LOG
                    </h3>
                    <div className="space-y-3">
                        {data?.history?.length > 0 ? (
                            data.history.map((log, index) => (
                                <div key={log._id || index} className="glass-card p-4 hover:bg-white/5 transition-all border-white/5 active:scale-[0.98]">
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
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-white font-bold text-[11px] truncate uppercase tracking-tight">{log.title}</h4>
                                                <span className="text-white font-black text-sm">
                                                    {log.amount > 0 ? (log.type === 'withdrawal' ? '-' : '+') : ''}
                                                    ${log.amount?.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/30 text-[9px] font-medium flex items-center gap-1.5">
                                                    <Clock size={10} />
                                                    {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md ${getStatusColor(log.type)}`}>
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
                                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">No history found</p>
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
