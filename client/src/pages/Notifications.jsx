import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Bell,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    TrendingUp,
    DollarSign,
    Users,
    Info,
    Trash2,
    CheckCheck
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put('/api/notifications/read-all', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const deleteNotification = async (id, e) => {
        e.stopPropagation();
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`/api/notifications/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'deposit': return <TrendingUp className="text-primary" size={20} />;
            case 'withdrawal': return <DollarSign className="text-red-400" size={20} />;
            case 'investment': return <CheckCircle2 className="text-cyan-400" size={20} />;
            case 'commission': return <Users className="text-yellow-400" size={20} />;
            default: return <Info className="text-white/60" size={20} />;
        }
    };

    return (
        <div className="min-h-screen bg-dark-300 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-dark-200/80 backdrop-blur-md border-b border-white/5 py-4 px-4 shadow-lg">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-white leading-none">Notifications</h1>
                            {unreadCount > 0 && (
                                <span className="text-[10px] text-primary font-medium">{unreadCount} unread messages</span>
                            )}
                        </div>
                    </div>
                    {notifications.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-light transition-colors font-medium px-2 py-1 rounded-lg bg-primary/10"
                        >
                            <CheckCheck size={14} />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card p-4 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl shrink-0"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-white/10 rounded w-1/3"></div>
                                        <div className="h-3 bg-white/5 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-20 text-center opacity-60">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Bell size={40} />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-2">No notifications yet</h2>
                        <p className="text-sm">We'll notify you when something important happens.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <div
                                key={notif._id}
                                onClick={() => notif.status === 'unread' && markAsRead(notif._id)}
                                className={`glass-card p-4 transition-all active:scale-[0.98] cursor-pointer group hover:bg-white/[0.03] ${notif.status === 'unread' ? 'border-primary/30 ring-1 ring-primary/20' : 'opacity-80'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${notif.status === 'unread' ? 'bg-primary/20 bg-glow-primary' : 'bg-white/5'
                                        }`}>
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className={`text-sm font-bold truncate pr-2 ${notif.status === 'unread' ? 'text-white' : 'text-white/60'
                                                }`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-[10px] text-white/40 whitespace-nowrap pt-0.5">
                                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed mb-3">
                                            {notif.message}
                                        </p>
                                        <div className="flex justify-between items-end">
                                            {notif.amount && (
                                                <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                    ${notif.amount.toFixed(2)}
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => deleteNotification(notif._id, e)}
                                                className="p-1 -mr-1 text-white/20 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
