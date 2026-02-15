import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronRight, ArrowLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const Settings = () => {
    const navigate = useNavigate();

    const menuItems = [
        { title: 'Profile Settings', icon: User, path: '/settings/profile', subtitle: 'Name, Phone, Email' },
        { title: 'Security', icon: Lock, path: '/settings/security', subtitle: 'Password, Transaction PIN' },
    ];

    return (
        <div className="min-h-screen bg-dark-300 pb-20">
            {/* Header */}
            <div className="bg-dark-200 p-4 flex items-center gap-3 sticky top-0 z-20 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/60 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-white font-bold text-lg">Settings</h1>
            </div>

            <div className="p-4 space-y-3">
                {menuItems.map((item, index) => (
                    <div key={index} onClick={() => navigate(item.path)} className="glass-card p-4 flex items-center justify-between cursor-pointer active:scale-98 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">{item.title}</div>
                                <div className="text-white/40 text-xs">{item.subtitle}</div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-white/20" />
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
};

export default Settings;
