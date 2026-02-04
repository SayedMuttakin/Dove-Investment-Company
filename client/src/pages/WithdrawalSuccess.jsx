import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, Copy, ArrowLeft, Clock, CreditCard, TrendingDown, Hash, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const WithdrawalSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [withdrawal, setWithdrawal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWithdrawalDetails();
    }, [id]);

    const fetchWithdrawalDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/withdrawal/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWithdrawal(res.data);
        } catch (error) {
            console.error('Error fetching withdrawal:', error);
            setError(error.response?.data?.message || 'Failed to load withdrawal details');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Transaction ID copied!');
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-300 flex items-center justify-center">
                <div className="text-primary text-xl">Loading...</div>
            </div>
        );
    }

    if (error || !withdrawal) {
        return (
            <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4">
                <div className="glass-card p-6 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-white mb-2">Error</h2>
                    <p className="text-white/60 mb-6">{error || 'Withdrawal not found'}</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-3 bg-gradient-primary rounded-xl text-white font-bold"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const netAmount = withdrawal.amount;
    const feeAmount = withdrawal.fee || 0;
    const totalDeducted = withdrawal.totalAmount || (netAmount + feeAmount);
    const feePercentage = netAmount > 0 ? ((feeAmount / netAmount) * 100).toFixed(0) : 5;

    return (
        <div className="min-h-screen bg-dark-300 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-dark-200/80 backdrop-blur-md border-b border-white/5 py-4 px-4 shadow-lg">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate('/home')}
                        className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-white">Transaction Details</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-8">
                {/* Success Animation */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/50 animate-scale-in">
                            <CheckCircle2 className="text-white" size={48} strokeWidth={3} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Successful!</h2>
                    <p className="text-white/60 text-center">
                        Your withdrawal has been processed and sent to your account
                    </p>
                </div>

                {/* Main Details Card */}
                <div className="glass-card p-6 mb-4">
                    {/* Transaction Hash */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <Hash size={16} />
                            <span>Transaction ID</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <code className="text-white font-mono text-sm break-all">
                                {withdrawal.transactionId || 'N/A'}
                            </code>
                            {withdrawal.transactionId && (
                                <button
                                    onClick={() => copyToClipboard(withdrawal.transactionId)}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors shrink-0"
                                >
                                    <Copy className="text-primary" size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Amount Breakdown */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">Withdrawal Amount</span>
                            <span className="text-white font-bold text-lg">${netAmount.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm flex items-center gap-1">
                                Processing Fee ({feePercentage}%)
                            </span>
                            <span className="text-red-400 font-semibold">-${feeAmount.toFixed(2)}</span>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-white/80 font-medium">Total Deducted</span>
                                <span className="text-white font-bold text-xl">${totalDeducted.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center">
                                <span className="text-green-400 font-medium">Amount Sent to You</span>
                                <span className="text-green-400 font-bold text-xl">${netAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Details Card */}
                <div className="glass-card p-5 mb-4">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <CreditCard size={18} className="text-primary" />
                        Payment Details
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-white/60">Method</span>
                            <span className="text-white font-medium uppercase">{withdrawal.paymentMethod}</span>
                        </div>
                        {withdrawal.bankDetails && (
                            <>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Bank</span>
                                    <span className="text-white font-medium">{withdrawal.bankDetails.bankName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Account</span>
                                    <span className="text-white font-medium font-mono">{withdrawal.bankDetails.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Account Name</span>
                                    <span className="text-white font-medium">{withdrawal.bankDetails.accountName}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Timestamp Card */}
                <div className="glass-card p-5 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                        <Clock size={16} className="text-primary" />
                        <div className="flex-1">
                            <div className="text-white/60 mb-1">Processed At</div>
                            <div className="text-white font-medium">
                                {formatDate(withdrawal.processedAt || withdrawal.createdAt)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <button
                    onClick={() => navigate('/home')}
                    className="w-full py-4 bg-gradient-primary rounded-2xl text-white font-bold shadow-glow hover:shadow-glow-lg transition-all active:scale-[0.98]"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default WithdrawalSuccess;
