import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Users, Globe, DollarSign } from 'lucide-react';

const About = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        users: '1,000',
        capitalPool: '2623.13'
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/home/about-stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching about stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-primary">
            <div className="max-w-md mx-auto min-h-screen flex flex-col">
                {/* Header / Back Button */}
                <div className="p-4 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-black/10 text-black hover:bg-black/20 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </div>

                <div className="px-8 pt-4 flex-1 space-y-8 pb-10">
                    {/* Title & Subtitle */}
                    <div className="space-y-2">
                        <h1 className="text-black font-extrabold text-4xl leading-tight tracking-tighter">
                            Dove Investment <br /> Company
                        </h1>
                        <p className="text-black/60 font-semibold text-lg max-w-[280px]">
                            The Future of Finance at Your Fingertips
                        </p>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-1 gap-6 pt-4">
                        {/* Users Stat */}
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-primary shadow-lg">
                                <Users size={28} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-black font-black text-2xl tracking-tight leading-none">{stats.users}</span>
                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mt-1">Users</span>
                            </div>
                        </div>

                        {/* Countries Stat */}
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-primary shadow-lg">
                                <Globe size={28} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-black font-black text-2xl tracking-tight leading-none">36</span>
                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mt-1">Across Countries</span>
                            </div>
                        </div>

                        {/* Capital Pool Stat */}
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-primary shadow-lg">
                                <DollarSign size={28} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-black font-black text-2xl tracking-tight leading-none">${stats.capitalPool}</span>
                                <span className="text-black/40 text-[10px] font-bold uppercase tracking-widest mt-1">million capital pool</span>
                            </div>
                        </div>
                    </div>

                    {/* Phone Mockup Section - Simplified */}
                    <div className="flex justify-center pt-2">
                        <div className="w-full max-w-[280px]">
                            <img
                                src="/images/dove-about-final.png"
                                alt="Dove App Mockup"
                                className="w-full h-auto mix-blend-multiply"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Credit */}
                <div className="px-8 text-center pb-8 opacity-20 mt-auto">
                    <p className="text-black text-[9px] font-bold uppercase tracking-[0.3em]">
                        Dove Investment Company © 2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
