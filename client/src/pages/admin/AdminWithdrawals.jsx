import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, CheckCircle, XCircle, Clock, Search, Hash, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminWithdrawals = () => {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [processingId, setProcessingId] = useState(null);
    const [approveModal, setApproveModal] = useState({
        isOpen: false,
        withdrawalId: null,
        amount: 0,
        transactionHash: ''
    });

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

    const openApproveModal = (id, amount) => {
        setApproveModal({
            isOpen: true,
            withdrawalId: id,
            amount,
            transactionHash: ''
        });
    };

    const closeApproveModal = () => {
        setApproveModal({
            isOpen: false,
            withdrawalId: null,
            amount: 0,
            transactionHash: ''
        });
    };

    const handleApprove = async () => {
        const { withdrawalId, transactionHash } = approveModal;

        if (!transactionHash || transactionHash.trim().length === 0) {
            toast.error('Please enter transaction hash');
            return;
        }

        setProcessingId(withdrawalId);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/withdrawal/admin/${withdrawalId}/approve`,
                { transactionId: transactionHash.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchWithdrawals();
            toast.success('Withdrawal approved successfully');
            closeApproveModal();
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
        <div className="p-2 md:p-6">
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
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
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
                                <div className="text-sm text-white/80 space-y-1">
                                    <div>User: <span className="text-primary font-bold">{item.userId?.fullName || item.userId?.phone}</span></div>
                                    <div className="flex gap-4 text-xs">
                                        <span className="bg-white/5 px-2 py-1 rounded">Total Deposit: ${item.totalDeposits || 0}</span>
                                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">Active Members: {item.activeReferrals || 0}</span>
                                    </div>
                                </div>
                                <div className="mt-3 p-3 bg-dark-300 rounded border border-white/5 text-xs font-mono text-white/70 break-all">
                                    {item.bankDetails.bankName} - {item.bankDetails.accountNumber} ({item.bankDetails.accountName})
                                </div>
                            </div>

                            {item.status === 'pending' && (
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => openApproveModal(item._id, item.amount)}
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

            {/* Transaction Hash Modal */}
            {approveModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-card w-full max-w-md p-6 relative">
                        <button
                            onClick={closeApproveModal}
                            className="absolute top-4 right-4 p-1 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Hash className="text-green-500" />
                            Enter Transaction Hash
                        </h3>

                        <div className="mb-6">
                            <p className="text-white/60 text-sm mb-4">
                                Approving withdrawal of <span className="text-white font-bold">${approveModal.amount}</span>
                            </p>

                            <label className="block text-sm text-white/80 mb-2">
                                Transaction Hash / ID *
                            </label>
                            <input
                                type="text"
                                value={approveModal.transactionHash}
                                onChange={(e) => setApproveModal({ ...approveModal, transactionHash: e.target.value })}
                                placeholder="e.g., 0xabc123... or TXN123456"
                                className="w-full px-4 py-3 bg-dark-300 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary"
                                autoFocus
                            />
                            <p className="text-xs text-white/40 mt-2">
                                Enter the blockchain transaction hash or payment reference ID
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={closeApproveModal}
                                className="flex-1 px-4 py-3 bg-dark-300 hover:bg-dark-200 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={processingId === approveModal.withdrawalId}
                                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 font-bold"
                            >
                                {processingId === approveModal.withdrawalId ? 'Processing...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWithdrawals;
