import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Shield, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SecuritySettings = () => {
    const navigate = useNavigate();
    const [loadingPwd, setLoadingPwd] = useState(false);
    const [loadingPin, setLoadingPin] = useState(false);

    const [pwdData, setPwdData] = useState({ newPassword: '', confirmPassword: '' });
    const [pinData, setPinData] = useState({ newPin: '', confirmPin: '' });

    const handlePwdChange = (e) => setPwdData({ ...pwdData, [e.target.name]: e.target.value });
    const handlePinChange = (e) => setPinData({ ...pinData, [e.target.name]: e.target.value });

    const submitPassword = async (e) => {
        e.preventDefault();
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (pwdData.newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoadingPwd(true);
        try {
            await axios.put('/api/auth/password', { newPassword: pwdData.newPassword });
            toast.success('Password updated successfully');
            setPwdData({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setLoadingPwd(false);
        }
    };

    const submitPin = async (e) => {
        e.preventDefault();
        if (pinData.newPin !== pinData.confirmPin) {
            return toast.error('PINs do not match');
        }
        if (pinData.newPin.length !== 6) {
            return toast.error('PIN must be 6 digits');
        }

        setLoadingPin(true);
        try {
            await axios.put('/api/auth/pin', { newPin: pinData.newPin });
            toast.success('Transaction PIN updated successfully');
            setPinData({ newPin: '', confirmPin: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update PIN');
        } finally {
            setLoadingPin(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-300 pb-10 max-w-md mx-auto relative shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-dark-200 p-4 flex items-center gap-3 sticky top-0 z-20 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/60 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-white font-bold text-lg">Security Settings</h1>
            </div>

            <div className="p-4 space-y-6">
                {/* Password Section */}
                <div className="glass-card p-5">
                    <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                        <Lock size={16} className="text-primary" />
                        Change Password
                    </h2>
                    <form onSubmit={submitPassword} className="space-y-3">
                        <input
                            type="password"
                            name="newPassword"
                            value={pwdData.newPassword}
                            onChange={handlePwdChange}
                            placeholder="New Password (min 6 chars)"
                            required
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/20"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={pwdData.confirmPassword}
                            onChange={handlePwdChange}
                            placeholder="Confirm New Password"
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
                            name="newPin"
                            value={pinData.newPin}
                            onChange={handlePinChange}
                            maxLength={6}
                            required
                            placeholder="New 6-Digit PIN"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/20"
                        />
                        <input
                            type="text"
                            name="confirmPin"
                            value={pinData.confirmPin}
                            onChange={handlePinChange}
                            maxLength={6}
                            required
                            placeholder="Confirm New PIN"
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
