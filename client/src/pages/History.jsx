import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, TrendingUp, Gift, DollarSign, ArrowRight, Wallet, History as HistoryIcon
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

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'deposit': return <Wallet size={16} />;
            case 'withdrawal': return <ArrowRight size={16} />;
            case 'investment': return <TrendingUp size={16} />;
            case 'commission': return <TrendingUp size={16} />;
            case 'bonus': return <Gift size={16} />;
            default: return <DollarSign size={16} />;
        }
    };

    const getStatusColor = (type) => {
        switch (type) {
            case 'deposit': return 'text-green-400 bg-green-400/10';
            case 'withdrawal': return 'text-red-400 bg-red-400/10';
            case 'investment': return 'text-blue-400 bg-blue-400/10';
            case 'commission': return 'text-yellow-400 bg-yellow-400/10';
            case 'bonus': return 'text-purple-400 bg-purple-400/10';
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
                <div className="max-w-md mx-auto px-4 h-13 flex items-center justify-between relative">
                    <div className="flex items-center gap-3 relative z-10 w-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/60 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-lg font-bold text-white tracking-tight">Financial History</h1>
                    </div>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-6 space-y-6">

                {/* Summary Cards */}
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

                {/* Detailed Income List */}
                <div className="glass-card p-0 overflow-hidden border-white/10">
                    <div className="divide-y divide-white/5">
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                                    <TrendingUp size={16} />
                                </div>
                                <span className="text-white/60 text-sm font-medium">Lending Income</span>
                            </div>
                            <span className="text-white font-black text-sm">{data?.interestIncome?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg">
                                    <TrendingUp size={16} />
                                </div>
                                <span className="text-white/60 text-sm font-medium">Team Benefits</span>
                            </div>
                            <span className="text-white font-black text-sm">{data?.teamIncome?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                                    <Gift size={16} />
                                </div>
                                <span className="text-white/60 text-sm font-medium">Bonus</span>
                            </div>
                            <span className="text-white font-black text-sm">{data?.bonusIncome?.toFixed(0) || '0'}</span>
                        </div>
                        <div className="flex justify-between items-center p-5 bg-gradient-to-r from-primary/10 to-transparent border-t border-primary/20">
                            <span className="text-primary font-black text-sm uppercase tracking-widest">Total Income</span>
                            <span className="text-primary font-black text-lg">{(Number(data?.interestIncome || 0) + Number(data?.teamIncome || 0) + Number(data?.bonusIncome || 0))?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions List */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <HistoryIcon size={16} className="text-primary" />
                        <h2 className="text-white font-bold text-sm uppercase tracking-wider">Recent Transactions</h2>
                    </div>

                    <div className="space-y-3">
                        {data?.history && data.history.length > 0 ? (
                            data.history.map((item, idx) => (
                                <div key={idx} className="glass-card p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${getStatusColor(item.type)}`}>
                                            {getTransactionIcon(item.type)}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm tracking-tight">{item.title}</h4>
                                            <p className="text-white/30 text-[10px] mt-0.5">{new Date(item.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-black text-sm ${['deposit', 'commission', 'bonus', 'investment'].includes(item.type) ? 'text-[#a4f13a]' : 'text-red-400'}`}>
                                            {['deposit', 'commission', 'bonus', 'investment'].includes(item.type) ? '+' : '-'}${item.amount?.toFixed(2)}
                                        </div>
                                        <p className="text-white/20 text-[9px] uppercase font-medium mt-0.5 tracking-tighter">USDT CONVERTED</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="glass-card p-8 text-center">
                                <p className="text-white/20 text-xs italic">No recent transactions recorded yet.</p>
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
