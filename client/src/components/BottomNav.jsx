import React from 'react';
import { Home, Wallet, DollarSign, User, Briefcase } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { icon: Home, label: 'Home', path: '/home' },
        { icon: Briefcase, label: 'Lend', path: '/lend' },
        { icon: DollarSign, label: 'Income', path: '/income', isCenter: true },
        { icon: Wallet, label: 'Assets', path: '/wallet' },
        { icon: User, label: 'Me', path: '/me' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-200 border-t border-white/10 safe-area-pb">
            <div className="flex items-center justify-around px-4 py-1 max-w-md mx-auto">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="flex flex-col items-center gap-0.5 transition-all"
                        >
                            <div className={`p-2 rounded-xl transition-all ${active ? 'bg-primary/20' : ''
                                }`}>
                                <Icon
                                    size={22}
                                    className={active ? 'text-primary' : 'text-white/60'}
                                />
                            </div>
                            <span className={`text-xs ${active ? 'text-primary font-medium' : 'text-white/60'
                                }`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;
