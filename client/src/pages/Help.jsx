import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft,
    MessageCircle,
    Send,
    FileText,
    ShieldCheck,
    HelpCircle,
    ChevronRight,
    PlayCircle,
    User,
    Shield
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Help = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/support/messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Fetch messages error:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Use a small timeout to ensure DOM is updated before scrolling
        const timer = setTimeout(scrollToBottom, 50);
        return () => clearTimeout(timer);
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/support/send',
                { message: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Send message error:', error);
        } finally {
            setLoading(false);
        }
    };

    const faqs = [
        {
            q: "How to invest in packages?",
            a: "Go to the 'Lend' page, select a level matching your balance, and click on an investment package to start earning daily income."
        },
        {
            q: "How much can I withdrawal?",
            a: "The minimum withdrawal amount depends on your level. Withdrawals are usually processed within 24 hours."
        },
        {
            q: "How to earn team benefits?",
            a: "Share your referral link from the 'Me' page. When your friends invest, you earn a percentage based on your level across 3 levels."
        }
    ];

    const supportChannels = [
        {
            name: "WhatsApp Support",
            icon: <MessageCircle className="text-[#25D366]" size={24} />,
            desc: "9:00 AM - 10:00 PM",
            link: "https://wa.me/447476591257",
            color: "hover:bg-[#25D366]/10"
        },
        {
            name: "Telegram Channel",
            icon: <Send className="text-[#0088cc]" size={24} />,
            desc: "Official Updates",
            link: "https://t.me/doveinvestment",
            color: "hover:bg-[#0088cc]/10"
        }
    ];

    return (
        <div className="min-h-screen bg-dark-300 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-dark-200/80 backdrop-blur-md border-b border-white/5 py-1.5 px-4 shadow-lg">
                <div className="max-w-md mx-auto flex items-center justify-between relative h-8">
                    <div className="relative z-10 w-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-base font-bold text-white">Support</h1>
                    </div>
                    <div className="w-10"></div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
                {/* Live Chat Section */}
                <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col h-[550px] border border-white/5 bg-black/20 shadow-2xl">
                    <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Shield size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Live Support Chat</h3>
                            <p className="text-[10px] text-primary">Admin is Online</p>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
                    >
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                                <MessageCircle size={40} className="mb-2" />
                                <p className="text-xs px-10">No messages yet. Send a message to start chatting with support.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.isAdmin
                                        ? 'bg-dark-200 text-white rounded-tl-none border border-white/5'
                                        : 'bg-primary text-black font-medium rounded-tr-none'
                                        }`}>
                                        <p className="leading-relaxed">{msg.message}</p>
                                        <div className={`text-[9px] mt-1 opacity-50 ${msg.isAdmin ? 'text-white/60' : 'text-black/60'}`}>
                                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/5">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write a message..."
                                className="w-full bg-dark-300 border border-white/10 rounded-full py-3 px-5 pr-12 text-sm text-white focus:outline-none focus:border-primary/50 transition-all"
                            />
                            <button
                                type="submit"
                                disabled={loading || !newMessage.trim()}
                                className={`absolute right-2 p-2 rounded-full transition-all ${newMessage.trim() ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 text-white/20'
                                    }`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="text-center pb-10">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Dove Investment Gold Mine Growth v1.2.0</p>
                </div>
            </div>
        </div>
    );
};

export default Help;
