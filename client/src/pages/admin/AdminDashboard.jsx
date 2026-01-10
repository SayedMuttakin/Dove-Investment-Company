import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Wallet, Activity, TrendingUp, Package, Settings, Download, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-white/60 p-5">Loading stats...</div>;

    const cards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'from-blue-500 to-cyan-400',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Net Revenue',
            value: `৳${stats?.netRevenue?.toLocaleString() || '0'}`,
            icon: Activity,
            color: 'from-purple-500 to-pink-400',
            bg: 'bg-purple-500/10'
        },
        {
            title: 'Pending Deposits',
            value: stats?.pendingDepositsCount || 0,
            icon: Wallet,
            color: 'from-amber-500 to-orange-400',
            bg: 'bg-amber-500/10'
        },
        {
            title: 'Pending Weithdrawals',
            value: stats?.pendingWithdrawalsCount || 0,
            icon: Download,
            color: 'from-red-500 to-rose-400',
            bg: 'bg-red-500/10'
        }
    ];

    const menuItems = [
        { title: 'Manage Users', icon: Users, path: '/admin/users', color: 'bg-blue-600' },
        { title: 'Deposits', icon: Wallet, path: '/admin/deposits', color: 'bg-indigo-600' },
        { title: 'Packages', icon: Package, path: '/admin/packages', color: 'bg-emerald-600' },
        { title: 'Withdrawals', icon: Download, path: '/admin/withdrawals', color: 'bg-amber-600' },
        { title: 'Reports & Analytics', icon: BarChart2, path: '/admin/reports', color: 'bg-purple-600' },
        { title: 'System Settings', icon: Settings, path: '/admin/settings', color: 'bg-gray-600' },
    ];

    return (
        <div className="space-y-8 p-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card, index) => (
                        <div key={index} className="glass-card p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -mr-8 -mt-8 ${card.bg}`}></div>
                            <div className="relative z-10">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}>
                                    <card.icon className="text-white" size={20} />
                                </div>
                                <div className="text-white/60 text-sm font-medium mb-1">{card.title}</div>
                                <div className="text-white font-bold text-2xl">{card.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="glass-card p-6 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors group"
                        >
                            <div className={`p-3 rounded-xl ${item.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                <item.icon size={24} />
                            </div>
                            <span className="text-white font-medium text-sm">{item.title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
