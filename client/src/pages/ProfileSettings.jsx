import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { user, updateUserInfo } = useAuth();
    const [loading, setLoading] = useState(false);

    // Initial state from user context
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || user?.email || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare payload
            // If input contains @, treat as email, else phone
            const isEmail = formData.phone.includes('@');
            const payload = {
                fullName: formData.fullName,
                [isEmail ? 'email' : 'phone']: formData.phone
            };

            const res = await axios.put('/api/auth/profile', payload);
            if (res.data.success) {
                updateUserInfo(res.data.user);
                toast.success('Profile updated successfully');
                // navigate(-1); // Optional: go back or stay
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-300">
            {/* Header */}
            <div className="bg-dark-200 p-4 flex items-center gap-3 sticky top-0 z-20 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white/60 hover:text-white">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-white font-bold text-lg">Edit Profile</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md mx-auto">
                <div className="space-y-1">
                    <label className="text-white/60 text-xs font-medium pl-1">Full Name</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full bg-dark-200 border border-white/10 rounded-xl px-10 py-3 text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/20"
                            placeholder="Enter full name"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-white/60 text-xs font-medium pl-1">Phone Number / Email</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                            {formData.phone.includes('@') ? <Mail size={18} /> : <Phone size={18} />}
                        </div>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-dark-200 border border-white/10 rounded-xl px-10 py-3 text-white text-sm focus:border-primary/50 focus:outline-none placeholder:text-white/20"
                            placeholder="Phone number or Email"
                        />
                    </div>
                    <p className="text-white/30 text-[10px] pl-1">
                        This will be used for your login.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary-dark text-black font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 mt-6"
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    <span>Save Changes</span>
                </button>
            </form>
        </div>
    );
};

export default ProfileSettings;
