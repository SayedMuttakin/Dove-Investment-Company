import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Globe, DollarSign } from 'lucide-react';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-primary pb-10">
            {/* Header / Back Button */}
            <div className="p-4 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full bg-black/10 text-black hover:bg-black/20 transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className="px-8 pt-4 space-y-8">
                {/* Title & Subtitle */}
                <div className="space-y-2">
                    <h1 className="text-black font-black text-4xl leading-tight tracking-tighter">
                        Dove Investment <br /> Company
                    </h1>
                    <p className="text-black/60 font-medium text-lg max-w-[280px]">
                        The Future of Finance at Your Fingertips
                    </p>
                </div>

                {/* Stats Section */}
                <div className="space-y-6 pt-4">
                    {/* Users Stat */}
                    <div className="flex items-center gap-5 group">
                        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-primary shadow-lg ring-4 ring-black/5 group-hover:scale-110 transition-transform">
                            <Users size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-black font-black text-2xl tracking-tight leading-none">1,041,193</span>
                            <span className="text-black/40 text-sm font-bold uppercase tracking-wider mt-1">Users</span>
                        </div>
                    </div>

                    {/* Countries Stat */}
                    <div className="flex items-center gap-5 group">
                        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-primary shadow-lg ring-4 ring-black/5 group-hover:scale-110 transition-transform">
                            <Globe size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-black font-black text-2xl tracking-tight leading-none">36</span>
                            <span className="text-black/40 text-sm font-bold uppercase tracking-wider mt-1">Across Countries</span>
                        </div>
                    </div>

                    {/* Capital Pool Stat */}
                    <div className="flex items-center gap-5 group">
                        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-primary shadow-lg ring-4 ring-black/5 group-hover:scale-110 transition-transform">
                            <DollarSign size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-black font-black text-2xl tracking-tight leading-none">$2623.13</span>
                            <span className="text-black/40 text-sm font-bold uppercase tracking-wider mt-1">million capital pool</span>
                        </div>
                    </div>
                </div>

                {/* Phone Mockup Section */}
                <div className="relative pt-10 -mx-4 overflow-hidden flex justify-center">
                    <div className="relative z-10 w-[80%] max-w-[320px] transform rotate-[-5deg] hover:rotate-0 transition-all duration-500 shadow-2xl rounded-[3rem] overflow-hidden border-[8px] border-black">
                        <img
                            src="/images/dove-about.png"
                            alt="Dove App Mockup"
                            className="w-full h-auto object-cover"
                        />
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 bg-black/5 -skew-y-6 transform translate-y-20"></div>
                </div>
            </div>

            {/* Bottom Credit */}
            <div className="mt-20 px-8 text-center pb-10">
                <p className="text-black/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Dove Investment Company © 2024
                </p>
            </div>
        </div>
    );
};

export default About;
