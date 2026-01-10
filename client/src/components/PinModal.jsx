import React, { useState } from 'react';
import { X, Lock, KeyRound } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PinModal = ({ isOpen, onClose, onSuccess, mode = 'verify' }) => {
    const [pin, setPin] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, login } = useAuth(); // Need login to update user state if needed

    if (!isOpen) return null;

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`pin-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !pin[index] && index > 0) {
            // Auto-focus prev input on backspace
            const prevInput = document.getElementById(`pin-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async () => {
        const pinString = pin.join('');
        if (pinString.length !== 6) {
            setError('Please enter a 6-digit PIN');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const endpoint = mode === 'setup'
                ? '/api/auth/set-pin'
                : '/api/auth/verify-pin';

            const response = await axios.post(
                endpoint,
                { pin: pinString },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (mode === 'setup') {
                // If setting up, we might want to refresh user state
                // But for now, just success callback is enough
                // Optimistically update user's local state could be complex without a refresh
                // Let's rely on onSuccess to handle reload or navigation
                if (onSuccess) onSuccess();
            } else {
                if (response.data.success) {
                    if (onSuccess) onSuccess();
                }
            }
            // Clear PIN
            setPin(['', '', '', '', '', '']);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-sm glass-card p-6 scale-animation">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        {mode === 'setup' ? (
                            <KeyRound size={32} className="text-primary" />
                        ) : (
                            <Lock size={32} className="text-primary" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                        {mode === 'setup' ? 'Set Transaction PIN' : 'Enter Transaction PIN'}
                    </h2>
                    <p className="text-white/60 text-sm">
                        {mode === 'setup'
                            ? 'Create a 6-digit PIN for secure transactions'
                            : 'Please enter your 6-digit PIN to continue'}
                    </p>
                </div>

                <div className="flex justify-center gap-2 mb-6">
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            id={`pin-${index}`}
                            type="password"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-10 h-12 bg-dark-300 border border-white/10 rounded-lg text-center text-xl font-bold text-white focus:border-primary focus:outline-none transition-colors"
                        />
                    ))}
                </div>

                {error && (
                    <div className="text-red-400 text-sm text-center mb-4 bg-red-500/10 py-2 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading || pin.some(d => !d)}
                    className="w-full py-3 bg-gradient-primary rounded-xl text-white font-bold disabled:opacity-50 hover:shadow-glow transition-all"
                >
                    {loading ? 'Processing...' : (mode === 'setup' ? 'Set PIN' : 'Verify PIN')}
                </button>
            </div>
        </div>
    );
};

export default PinModal;
