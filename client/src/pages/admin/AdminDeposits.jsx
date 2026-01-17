import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Search, Filter } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDeposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

    const fetchDeposits = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const statusQuery = filter !== 'all' ? `?status=${filter}` : '';
            const response = await axios.get(`/api/admin/deposits${statusQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeposits(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching deposits:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeposits();
    }, [filter]);

    const handleApprove = async (id) => {
        if (!window.confirm('Are you sure you want to approve this deposit?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/admin/deposit/${id}/approve`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDeposits(); // Refresh list
            toast.success('Deposit approved successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Approval failed');
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this deposit?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/admin/deposit/${id}/reject`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDeposits(); // Refresh list
            toast.success('Deposit rejected.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rejection failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Manage Deposits</h2>

                <div className="flex bg-dark-200 p-1 rounded-lg border border-white/5">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${filter === status
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-white/60 hover:text-white'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">User</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">Amount</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">Network</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">TX Hash</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">Date</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">Status</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-white/40 text-sm">Loading deposits...</td>
                                </tr>
                            ) : deposits.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-white/40 text-sm">No deposits found.</td>
                                </tr>
                            ) : (
                                deposits.map((deposit) => (
                                    <tr key={deposit._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="text-white font-medium text-sm">{deposit.userId?.phone || 'Unknown'}</div>
                                            <div className="text-white/40 text-xs">Code: {deposit.userId?.invitationCode}</div>
                                        </td>
                                        <td className="p-4 text-white font-bold text-sm">${deposit.amount}</td>
                                        <td className="p-4 text-white/70 text-xs">{deposit.network}</td>
                                        <td className="p-4">
                                            <div className="text-white/60 text-xs font-mono max-w-[100px] truncate" title={deposit.transactionHash}>
                                                {deposit.transactionHash}
                                            </div>
                                        </td>
                                        <td className="p-4 text-white/60 text-xs text-nowrap">
                                            {new Date(deposit.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${deposit.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                deposit.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                }`}>
                                                {deposit.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {deposit.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(deposit._id)}
                                                        className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(deposit._id)}
                                                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDeposits;
