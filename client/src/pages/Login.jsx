import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, RefreshCw, Globe, Download } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import CountrySelector from '../components/CountrySelector';
import { usePWA } from '../hooks/usePWA';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        countryCode: '+880',
        phone: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { isInstallable, installApp } = usePWA();

    const handleDownload = async () => {
        const installed = await installApp();
        if (installed) {
            console.log('App installed successfully');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let fullPhone = formData.phone;
            if (!formData.phone.includes('@')) {
                fullPhone = formData.countryCode + formData.phone;
            }
            await login(fullPhone, formData.password);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Header */}
            <div className="text-center mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 top-0 p-2 text-white/60 hover:text-white transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="flex items-center justify-center gap-2 mb-2">
                    <Globe size={20} className="text-white/60" />
                    <RefreshCw size={20} className="text-white/60" />
                </div>

                <div className="flex items-center justify-center gap-3 mb-3">
                    {/* Logo */}
                    <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-lg transition-transform hover:scale-110 overflow-hidden">
                        <img
                            src="/pwa-icon-192.png"
                            alt="Dove Logo"
                            className="w-full h-full object-cover p-1"
                        />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-1">Hello,</h1>
                <p className="text-white/60">Welcome Dove Investment Company</p>
            </div>

            {/* Login Form */}
            <div className="glass-card p-6 space-y-5 shadow-glow">
                <h2 className="text-xl font-semibold text-white mb-4">Account Login</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email or Phone Number */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2">Email or Phone Number</label>
                        <div className="flex gap-2">
                            {!formData.phone.includes('@') && (
                                <CountrySelector
                                    value={formData.countryCode}
                                    onChange={handleChange}
                                    name="countryCode"
                                />
                            )}
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Email or phone number"
                                className="input-glass flex-1"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Please enter your password"
                                className="input-glass w-full pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-white/20 bg-glass-light text-primary focus:ring-primary/50"
                            />
                            <span className="text-white/80">Remember Account Password</span>
                        </label>
                        <Link to="/forgot-password" className="text-primary hover:text-primary-light transition-colors">
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? (
                            <>
                                <RefreshCw size={20} className="animate-spin" />
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <span>Login</span>
                                <span>→</span>
                            </>
                        )}
                    </button>
                </form>

                {/* App Download Button */}
                {isInstallable && (
                    <div className="pt-4 border-t border-white/10">
                        <button
                            onClick={handleDownload}
                            className="btn-glass w-full flex items-center justify-center gap-2 hover:shadow-glow"
                        >
                            <Download size={20} className="text-primary" />
                            <span>Install App</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Register Link */}
            <div className="text-center mt-6">
                <span className="text-white/60">No Account </span>
                <Link to="/register" className="text-primary hover:text-primary-light font-semibold transition-colors">
                    Register Now
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;
