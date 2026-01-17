import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        companyName: '',
        companyDescription: '',
        companyEmail: '',
        companyPhone: '',
        minWithdrawalAmount: '',
        minDepositAmount: '',
        maintenanceMode: false,
        walletTRC20: '',
        walletBTC: '',
        walletETH: '',
        walletBSC: '',
        appDownloadUrl: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/settings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(res.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('/api/admin/settings', settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Settings updated successfully');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update settings');
        }
    };

    if (loading) return <div className="p-6 text-white">Loading settings...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Settings className="text-blue-500" />
                System Settings
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Info */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">
                        Company Information
                    </h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="text-white/60 text-sm mb-1 block">Company Name</label>
                            <input
                                type="text"
                                className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                value={settings.companyName}
                                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-white/60 text-sm mb-1 block">Description</label>
                            <textarea
                                className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 h-24"
                                value={settings.companyDescription}
                                onChange={(e) => setSettings({ ...settings, companyDescription: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">Support Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={settings.companyEmail}
                                    onChange={(e) => setSettings({ ...settings, companyEmail: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">Support Phone</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={settings.companyPhone}
                                    onChange={(e) => setSettings({ ...settings, companyPhone: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wallet Management */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">
                        Wallet Addresses (Deposit)
                    </h3>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">USDT (TRC20)</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    value={settings.walletTRC20}
                                    onChange={(e) => setSettings({ ...settings, walletTRC20: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">Bitcoin (BTC)</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    value={settings.walletBTC}
                                    onChange={(e) => setSettings({ ...settings, walletBTC: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">Ethereum (ETH)</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    value={settings.walletETH}
                                    onChange={(e) => setSettings({ ...settings, walletETH: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">BSC (BNB/USDT)</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    value={settings.walletBSC}
                                    onChange={(e) => setSettings({ ...settings, walletBSC: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">App Download URL (APK Link)</label>
                                <input
                                    type="text"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono text-sm"
                                    value={settings.appDownloadUrl}
                                    onChange={(e) => setSettings({ ...settings, appDownloadUrl: e.target.value })}
                                    placeholder="https://example.com/app.apk"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform Config */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 border-b border-white/10 pb-2">
                        Platform Configuration
                    </h3>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">Min Withdrawal Amount (USDT)</label>
                                <input
                                    type="number"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={settings.minWithdrawalAmount}
                                    onChange={(e) => setSettings({ ...settings, minWithdrawalAmount: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">Min Deposit Amount (USDT)</label>
                                <input
                                    type="number"
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={settings.minDepositAmount}
                                    onChange={(e) => setSettings({ ...settings, minDepositAmount: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg mt-2">
                            <AlertCircle className="text-red-400" size={24} />
                            <div className="flex-1">
                                <h4 className="text-red-400 font-medium">Maintenance Mode</h4>
                                <p className="text-red-400/60 text-xs">Enable to block all user access for updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-dark-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-all font-bold text-lg shadow-lg hover:shadow-blue-500/20"
                    >
                        <Save size={20} />
                        Save All Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
