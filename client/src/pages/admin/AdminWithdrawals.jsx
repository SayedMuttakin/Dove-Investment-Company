import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchWithdrawals();
    }, [filter]);

    const fetchWithdrawals = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/withdrawal/admin/all?status=${filter}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWithdrawals(res.data);
        } catch (error) {
            console.error('Error fetching withdrawals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, amount) => {
        if (!window.confirm(`Approve withdrawal of $${amount}?`)) return;

        setProcessingId(id);
        try {
            const token = localStorage.getItem('token');
            // Assuming transaction ID is auto-generated or manually entered (simplified here)
            const transactionId = `TXN${Date.now()}`;

            await axios.post(`/api/withdrawal/admin/${id}/approve`,
                { transactionId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchWithdrawals();
            toast.success('Withdrawal approved successfully');
        } catch (error) {
            console.error('Error approving withdrawal:', error);
            toast.error(error.response?.data?.message || 'Failed to approve');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Enter rejection reason:');
        if (reason === null) return; // Cancelled

        setProcessingId(id);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/withdrawal/admin/${id}/reject`,
                { rejectionReason: reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchWithdrawals();
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
            toast.error('Failed to reject');
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Download className="text-blue-500" />
                Withdrawal Requests
            </h2>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                {['pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg capitalize transition-colors ${filter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-dark-200 text-white/60 hover:text-white'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {withdrawals.length === 0 ? (
                    <div className="text-center py-10 text-white/40">No withdrawals found</div>
                ) : (
                    withdrawals.map((item) => (
                        <div key={item._id} className="glass-card p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm text-white/60">{new Date(item.createdAt).toLocaleDateString()}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${item.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                        item.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xl font-bold text-white">${item.amount}</span>
                                    <span className="text-sm text-white/60">• {item.paymentMethod}</span>
                                </div>
                                <div className="text-sm text-white/80">
                                    User: {item.userId?.phone} (Code: {item.userId?.invitationCode})
                                </div>
                                <div className="mt-2 p-2 bg-dark-300 rounded text-xs font-mono text-white/70">
                                    {item.bankDetails.bankName} - {item.bankDetails.accountNumber} ({item.bankDetails.accountName})
                                </div>
                            </div>

                            {item.status === 'pending' && (
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => handleApprove(item._id, item.amount)}
                                        disabled={processingId === item._id}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <CheckCircle size={18} />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(item._id)}
                                        disabled={processingId === item._id}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminWithdrawals;
