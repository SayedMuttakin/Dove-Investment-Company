import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ArrowLeft, RefreshCw, Globe, Download } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import CountrySelector from '../components/CountrySelector';
import { usePWA } from '../hooks/usePWA';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        countryCode: '+1',
        fullName: '',
        phone: '',
        captcha: '',
        invitationCode: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
    const { isInstallable, installApp } = usePWA();
    const [isReferralLink, setIsReferralLink] = useState(false);

    // Auto-fill invitation code from URL parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        if (refCode) {
            setFormData(prev => ({
                ...prev,
                invitationCode: refCode
            }));
            setIsReferralLink(true);
        }
    }, []);

    const handleDownload = async () => {
        const installed = await installApp();
        if (installed) {
            console.log('App installed successfully');
        }
    };

    function generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

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

        // Validation
        if (formData.captcha !== captchaCode) {
            setError('Captcha code is incorrect');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (!formData.agreedToTerms) {
            setError('Please agree to the Privacy Agreement');
            return;
        }

        setLoading(true);

        try {
            const fullPhone = formData.countryCode + formData.phone;
            await register({
                fullName: formData.fullName,
                phone: fullPhone,
                password: formData.password,
                invitationCode: formData.invitationCode
            });
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const refreshCaptcha = () => {
        setCaptchaCode(generateCaptcha());
        setFormData(prev => ({ ...prev, captcha: '' }));
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
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                        <div className="w-8 h-8 grid grid-cols-2 gap-0.5">
                            <div className="bg-white rounded-sm"></div>
                            <div className="bg-white/70 rounded-sm"></div>
                            <div className="bg-white/70 rounded-sm"></div>
                            <div className="bg-white rounded-sm"></div>
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white mb-1">Welcome To,</h1>
                <p className="text-white/60">Dove Investment Company</p>
            </div>

            {/* Registration Form */}
            <div className="glass-card p-6 space-y-5 shadow-glow">
                <h2 className="text-xl font-semibold text-white mb-4">Account Login</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Please enter your full name"
                            className="input-glass w-full"
                            required
                        />
                    </div>

                    {/* Mobile Phone */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2">Mobile Phone</label>
                        <div className="flex gap-2">
                            <CountrySelector
                                value={formData.countryCode}
                                onChange={handleChange}
                                name="countryCode"
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Please enter your phone number"
                                className="input-glass flex-1"
                                required
                            />
                        </div>
                    </div>

                    {/* Captcha */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2">Captcha</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="captcha"
                                value={formData.captcha}
                                onChange={handleChange}
                                placeholder="Please enter the captcha"
                                className="input-glass flex-1"
                                required
                            />
                            <div className="relative">
                                <div className="input-glass px-4 py-3 font-bold text-lg tracking-wider select-none bg-gradient-to-r from-primary/20 to-primary/10 min-w-[100px] text-center">
                                    {captchaCode}
                                </div>
                                <button
                                    type="button"
                                    onClick={refreshCaptcha}
                                    className="absolute -right-2 -top-2 bg-primary/20 hover:bg-primary/30 rounded-full p-1.5 transition-colors"
                                    title="Refresh Captcha"
                                >
                                    <RefreshCw size={14} className="text-primary" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Invitation Code */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2">Invitation Code</label>
                        <input
                            type="text"
                            name="invitationCode"
                            value={formData.invitationCode}
                            onChange={handleChange}
                            placeholder="PM57X8 (Optional)"
                            className="input-glass w-full"
                            readOnly={isReferralLink}
                            disabled={isReferralLink}
                        />
                        {isReferralLink && (
                            <p className="text-xs text-primary mt-1">✓ Referral code applied from link</p>
                        )}
                    </div>

                    {/* Login Password */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2">Login Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Please enter a password (6-20 alphanumeric)"
                                className="input-glass w-full pr-12"
                                required
                                minLength={6}
                                maxLength={20}
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-white/80 text-sm mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Please enter your password again"
                                className="input-glass w-full pr-12"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Privacy Agreement */}
                    <div className="flex items-start gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="agreedToTerms"
                            checked={formData.agreedToTerms}
                            onChange={handleChange}
                            className="w-4 h-4 mt-0.5 rounded border-white/20 bg-glass-light text-primary focus:ring-primary/50"
                            required
                        />
                        <label className="text-white/80">
                            I Have Read The{' '}
                            <Link to="/privacy" className="text-primary hover:text-primary-light transition-colors">
                                Privacy Agreement
                            </Link>
                        </label>
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
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <>
                                <span>Register</span>
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

            {/* Login Link */}
            <div className="text-center mt-6">
                <span className="text-white/60">Already have an account? </span>
                <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition-colors">
                    Login Now
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Register;
