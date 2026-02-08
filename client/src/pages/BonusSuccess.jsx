import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle2, ArrowLeft, Clock, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

const BonusSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotificationDetails();
    }, [id]);

    const fetchNotificationDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotification(res.data);
        } catch (error) {
            console.error('Error fetching notification:', error);
            setError(error.response?.data?.message || 'Failed to load bonus details');
        } finally {
            setLoading(false);
        }
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
                <div className="text-primary text-xl animate-pulse font-bold">Loading Bonus Info...</div>
            </div>
        );
    }

    if (error || !notification) {
        return (
            <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4 text-white">
                <div className="glass-card p-6 max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="text-white/60 mb-6">{error || 'Notification not found'}</p>
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

    return (
        <div className="min-h-screen bg-dark-300 pb-20 text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-dark-200/80 backdrop-blur-md border-b border-white/5 py-4 px-4 shadow-lg">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold">Bonus Details</h1>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-8">
                {/* Success Animation */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/50 animate-scale-in">
                            <CheckCircle2 size={48} strokeWidth={3} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Bonus Received!</h2>
                    <p className="text-white/60 text-center">
                        An administrative bonus has been added to your account balance.
                    </p>
                </div>

                {/* Main Details Card */}
                <div className="glass-card p-6 mb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={80} />
                    </div>

                    <div className="flex flex-col items-center mb-6">
                        <span className="text-white/60 text-sm mb-1 uppercase tracking-wider font-medium">Bonus Amount</span>
                        <div className="text-4xl font-black text-green-400 drop-shadow-glow">
                            ${notification.amount?.toFixed(2) || '0.00'}
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="flex justify-between items-start">
                            <span className="text-white/60 text-sm italic">Message from Admin:</span>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                            "{notification.message}"
                        </p>
                    </div>
                </div>

                {/* Info List */}
                <div className="glass-card p-5 mb-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                        <Clock size={18} className="text-primary" />
                        <div className="flex-1">
                            <div className="text-white/60 text-xs">Received At</div>
                            <div className="text-white font-medium">
                                {formatDate(notification.createdAt)}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <DollarSign size={18} className="text-primary" />
                        <div className="flex-1">
                            <div className="text-white/60 text-xs">Income Category</div>
                            <div className="text-white font-medium uppercase tracking-tight">Administrative Bonus</div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/income')}
                        className="w-full py-4 bg-gradient-primary rounded-2xl text-white font-bold shadow-glow hover:shadow-glow-lg transition-all active:scale-[0.98]"
                    >
                        View My Income
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white/80 font-bold hover:bg-white/10 transition-all active:scale-[0.98]"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BonusSuccess;
