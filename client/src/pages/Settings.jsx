import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ChevronRight, ArrowLeft, Moon, Sun } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const navigate = useNavigate();

    const menuItems = [
        { title: 'Profile Settings', icon: User, path: '/settings/profile', subtitle: 'Name, Phone, Email' },
        { title: 'Security', icon: Lock, path: '/settings/security', subtitle: 'Password, Transaction PIN' },
    ];

    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-300 pb-20 max-w-md mx-auto relative shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-dark-200 p-4 flex items-center gap-3 sticky top-0 z-20 border-b border-slate-200 dark:border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-900/60 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-gray-900 dark:text-white font-bold text-lg">Settings</h1>
            </div>

            <div className="p-4 space-y-3">
                {/* Theme Toggle */}
                <div onClick={toggleTheme} className="glass-card p-4 flex items-center justify-between cursor-pointer active:scale-98 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                        </div>
                        <div>
                            <div className="text-gray-900 dark:text-white font-bold text-sm">Appearance</div>
                            <div className="text-gray-900/40 dark:text-white/40 text-xs">Day / Night Mode</div>
                        </div>
                    </div>
                    <div className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none" style={{ backgroundColor: theme === 'dark' ? '#00D9B5' : '#ccc' }}>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                </div>

                {menuItems.map((item, index) => (
                    <div key={index} onClick={() => navigate(item.path)} className="glass-card p-4 flex items-center justify-between cursor-pointer active:scale-98 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <item.icon size={20} />
                            </div>
                            <div>
                                <div className="text-gray-900 dark:text-white font-bold text-sm">{item.title}</div>
                                <div className="text-gray-900/40 dark:text-white/40 text-xs">{item.subtitle}</div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-900/20 dark:text-white/20" />
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
};

export default Settings;
