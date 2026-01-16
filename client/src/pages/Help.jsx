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
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        scrollToBottom();
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
            a: "Go to the 'Lend' page, select a VIP level matching your balance, and click on an investment package to start earning daily income."
        },
        {
            q: "How much can I withdrawal?",
            a: "The minimum withdrawal amount depends on your VIP level. Withdrawals are usually processed within 24 hours."
        },
        {
            q: "How to earn team benefits?",
            a: "Share your referral link from the 'Me' page. When your friends invest, you earn a percentage based on your VIP level across 3 levels."
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
            <div className="sticky top-0 z-50 bg-dark-200/80 backdrop-blur-md border-b border-white/5 py-4 px-4 shadow-lg">
                <div className="max-w-md mx-auto flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-white">Customer Support</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-primary/20 to-dark-200 rounded-3xl p-6 border border-white/5 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HelpCircle size={32} className="text-primary" />
                    </div>
                    <h2 className="text-xl font-black text-white mb-2">How can we help?</h2>
                    <p className="text-sm text-white/60">Find answers to frequently asked questions or contact our team.</p>
                </div>

                {/* Live Chat Section */}
                <div className="glass-card rounded-[2rem] overflow-hidden flex flex-col h-[500px] border border-white/5 bg-black/20">
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
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                                <MessageCircle size={40} className="mb-2" />
                                <p className="text-xs">No messages yet. Send a message to start chatting with support.</p>
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
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/5">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Write a message..."
                                className="w-full bg-dark-300 border border-white/10 rounded-full py-3 px-5 pr-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all"
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

                {/* Support Channels */}
                <div className="grid grid-cols-2 gap-3">
                    {supportChannels.map((channel, i) => (
                        <a
                            key={i}
                            href={channel.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`glass-card p-4 transition-all block ${channel.color}`}
                        >
                            <div className="mb-3">{channel.icon}</div>
                            <h3 className="text-sm font-bold text-white mb-0.5">{channel.name}</h3>
                            <p className="text-[10px] text-white/40">{channel.desc}</p>
                        </a>
                    ))}
                </div>

                {/* Quick Guides */}
                <div>
                    <h3 className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3 px-1">Quick Guides</h3>
                    <div className="space-y-2">
                        <button className="w-full glass-card p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                                    <PlayCircle size={18} />
                                </div>
                                <span className="text-sm font-medium text-white/80">Platform Overview</span>
                            </div>
                            <ChevronRight size={16} className="text-white/20 group-hover:text-primary transition-colors" />
                        </button>
                        <button className="w-full glass-card p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center text-purple-400">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-sm font-medium text-white/80">Safety & Security</span>
                            </div>
                            <ChevronRight size={16} className="text-white/20 group-hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div>
                    <h3 className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-3 px-1">Common Questions</h3>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="glass-card p-4">
                                <h4 className="text-sm font-bold text-white mb-2">{faq.q}</h4>
                                <p className="text-xs text-white/60 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center pb-10">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Dove Investment Company v1.2.0</p>
                </div>
            </div>
        </div>
    );
};

export default Help;
