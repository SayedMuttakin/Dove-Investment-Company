import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

const AdminReports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6 text-white text-center">Loading reports...</div>;

    // Dummy data for charts (Backend expansion needed for real time-series data)
    const growthData = [
        { name: 'Mon', users: 12 },
        { name: 'Tue', users: 19 },
        { name: 'Wed', users: 15 },
        { name: 'Thu', users: 25 },
        { name: 'Fri', users: 32 },
        { name: 'Sat', users: 45 },
        { name: 'Sun', users: 55 },
    ];

    const revenueData = [
        { name: 'Mon', amount: 5000 },
        { name: 'Tue', amount: 8500 },
        { name: 'Wed', amount: 6000 },
        { name: 'Thu', amount: 12000 },
        { name: 'Fri', amount: 15000 },
        { name: 'Sat', amount: 22000 },
        { name: 'Sun', amount: 28000 },
    ];

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-500" />
                Analytics & Reports
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="text-green-400" />
                        <h3 className="text-white/60">Net Revenue</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">${stats.netRevenue?.toLocaleString()}</p>
                    <p className="text-green-400 text-sm flex items-center gap-1 mt-2">
                        <span>+12.5%</span>
                        <span className="text-white/40">from last week</span>
                    </p>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-blue-400" />
                        <h3 className="text-white/60">Total Users</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                    <p className="text-blue-400 text-sm flex items-center gap-1 mt-2">
                        <span>+5</span>
                        <span className="text-white/40">new today</span>
                    </p>
                </div>

                <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-purple-400" />
                        <h3 className="text-white/60">Total User Balance</h3>
                    </div>
                    <p className="text-3xl font-bold text-white">${stats.totalUserBalance?.toLocaleString()}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth */}
                <div className="glass-card p-6">
                    <h3 className="text-white font-bold mb-6">User Growth (Last 7 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={growthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                <XAxis dataKey="name" stroke="#ffffff60" />
                                <YAxis stroke="#ffffff60" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue Trend */}
                <div className="glass-card p-6">
                    <h3 className="text-white font-bold mb-6">Revenue Trend (Last 7 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff60" />
                                <YAxis stroke="#ffffff60" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                />
                                <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
