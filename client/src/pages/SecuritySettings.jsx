import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Shield, Save, Loader2, KeyRound } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SecuritySettings = () => {
    const navigate = useNavigate();
    const [loadingPwd, setLoadingPwd] = useState(false);
    const [loadingPin, setLoadingPin] = useState(false);

    const [pwdData, setPwdData] = useState({ oldPassword: '', newPassword: '' });
    const [pinData, setPinData] = useState({ oldPin: '', newPin: '' });

    const handlePwdChange = (e) => setPwdData({ ...pwdData, [e.target.name]: e.target.value });
    const handlePinChange = (e) => setPinData({ ...pinData, [e.target.name]: e.target.value });

    const submitPassword = async (e) => {
        e.preventDefault();
        setLoadingPwd(true);
        try {
            await axios.put('/api/auth/password', pwdData);
            toast.success('Password updated successfully');
            setPwdData({ oldPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoadingPwd(false);
        }
    };

    const submitPin = async (e) => {
        e.preventDefault();
        setLoadingPin(true);
        try {
            await axios.put('/api/auth/pin', pinData);
            toast.success('Transaction PIN updated successfully');
            setPinData({ oldPin: '', newPin: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update PIN');
        } finally {
            setLoadingPin(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-300 pb-10">
            {/* Header */}
            <div className="bg-dark-200 p-4 flex items-center gap-3 sticky top-0 z-20 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/60 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-white font-bold text-lg">Security Settings</h1>
            </div>

            <div className="p-4 space-y-6 max-w-md mx-auto">
                {/* Password Section */}
                <div className="glass-card p-5">
                    <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                        <Lock size={16} className="text-primary" />
                        Change Password
                    </h2>
                    <form onSubmit={submitPassword} className="space-y-3">
                        <input
                            type="password"
                            name="oldPassword"
                            value={pwdData.oldPassword}
                            onChange={handlePwdChange}
                            placeholder="Current Password"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/20"
                        />
                        <input
                            type="password"
                            name="newPassword"
                            value={pwdData.newPassword}
                            onChange={handlePwdChange}
                            placeholder="New Password (min 6 chars)"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/20"
                        />
                        <button
                            type="submit"
                            disabled={loadingPwd}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg transition-all border border-white/10 flex justify-center hover:border-white/20"
                        >
                            {loadingPwd ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
                        </button>
                    </form>
                </div>

                {/* PIN Section */}
                <div className="glass-card p-5">
                    <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                        <Shield size={16} className="text-primary" />
                        Transaction PIN
                    </h2>
                    <form onSubmit={submitPin} className="space-y-3">
                        <input
                            type="text"
                            name="oldPin"
                            value={pinData.oldPin}
                            onChange={handlePinChange}
                            maxLength={6}
                            placeholder="Current PIN (if set)"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/20"
                        />
                        <input
                            type="text"
                            name="newPin"
                            value={pinData.newPin}
                            onChange={handlePinChange}
                            maxLength={6}
                            required
                            placeholder="New 6-Digit PIN"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/20"
                        />
                        <button
                            type="submit"
                            disabled={loadingPin}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg transition-all border border-white/10 flex justify-center hover:border-white/20"
                        >
                            {loadingPin ? <Loader2 size={18} className="animate-spin" /> : 'Update PIN'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
