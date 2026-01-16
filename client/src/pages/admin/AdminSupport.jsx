import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    MessageCircle,
    Send,
    User,
    Search,
    Clock,
    CheckCheck,
    ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AdminSupport = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/support/admin/conversations', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setConversations(res.data);
        } catch (error) {
            console.error('Fetch conversations error:', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/support/admin/messages/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (error) {
            console.error('Fetch messages error:', error);
        }
    };

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(() => {
            fetchConversations();
            if (selectedUser) {
                fetchMessages(selectedUser._id);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            scrollToBottom();
        }
    }, [messages]);

    const handleSelectUser = (conv) => {
        setSelectedUser({ ...conv.userInfo, _id: conv._id });
        fetchMessages(conv._id);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/support/admin/reply',
                { userId: selectedUser._id, message: newMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages([...messages, res.data]);
            setNewMessage('');
            fetchConversations(); // Update last message in list
        } catch (error) {
            console.error('Send reply error:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(conv => {
        const fullName = conv.userInfo?.fullName || '';
        const phone = conv.userInfo?.phone || '';
        return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phone.includes(searchTerm);
    });

    return (
        <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6">
            {/* Conversations List */}
            <div className={`w-full md:w-80 flex flex-col bg-dark-200 rounded-3xl border border-white/5 overflow-hidden ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white mb-4">Support Chats</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                        <input
                            type="text"
                            placeholder="Search user..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-dark-300 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary/50"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                    {filteredConversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 text-center opacity-40">
                            <MessageCircle size={32} className="mb-2" />
                            <p className="text-xs">No conversations found</p>
                        </div>
                    ) : (
                        filteredConversations.map((conv) => (
                            <button
                                key={conv._id}
                                onClick={() => handleSelectUser(conv)}
                                className={`w-full p-4 flex gap-3 text-left transition-all hover:bg-white/5 border-b border-white/5 ${selectedUser?._id === conv._id ? 'bg-white/5' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
                                    {conv.userInfo.profileImage ? (
                                        <img src={conv.userInfo.profileImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={24} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className="text-sm font-black text-white truncate">{conv.userInfo.fullName}</p>
                                        <span className="text-[10px] text-white/40 whitespace-nowrap">
                                            {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-primary mb-1 font-bold">{conv.userInfo.phone}</p>
                                    <p className="text-[11px] text-white/60 truncate italic">"{conv.lastMessage}"</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-dark-200 rounded-3xl border border-white/5 overflow-hidden ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
                {selectedUser ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="md:hidden p-2 -ml-2 text-white/60 hover:text-white"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary relative overflow-hidden">
                                    {selectedUser.profileImage ? (
                                        <img src={selectedUser.profileImage} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">{selectedUser.fullName}</h3>
                                    <p className="text-[10px] text-white/40">{selectedUser.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-black/20">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${msg.isAdmin
                                        ? 'bg-primary text-black font-medium rounded-tr-none'
                                        : 'bg-dark-300 text-white rounded-tl-none border border-white/5'
                                        }`}>
                                        <p className="leading-relaxed">{msg.message}</p>
                                        <div className={`text-[9px] mt-1 opacity-50 flex items-center gap-1 ${msg.isAdmin ? 'text-black/60' : 'text-white/60'}`}>
                                            <Clock size={8} />
                                            {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5">
                            <div className="relative flex items-center gap-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your reply..."
                                    className="flex-1 bg-dark-300 border border-white/10 rounded-2xl py-3 px-5 text-sm text-white focus:outline-none focus:border-primary/50"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !newMessage.trim()}
                                    className={`p-3 rounded-2xl transition-all ${newMessage.trim() ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 text-white/20'
                                        }`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                        <MessageCircle size={64} className="mb-4" />
                        <h2 className="text-xl font-bold text-white">Select a conversation</h2>
                        <p className="text-sm">Click on a user from the list to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSupport;
