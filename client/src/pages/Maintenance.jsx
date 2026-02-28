import React from 'react';
import { Settings, Wrench, AlertTriangle } from 'lucide-react';

const Maintenance = () => {
    return (
        <div className="min-h-screen bg-dark-300 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 glass-card p-10 max-w-lg w-full text-center border border-white/10 shadow-2xl rounded-3xl backdrop-blur-xl">
                {/* Animated Icon */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
                    <div className="relative bg-dark-200 w-full h-full rounded-full flex items-center justify-center border-2 border-primary/50 shadow-[0_0_30px_rgba(164,241,58,0.3)]">
                        <Settings className="text-primary w-12 h-12 animate-[spin_3s_linear_infinite]" />
                        <Wrench className="text-cyan-400 w-6 h-6 absolute bottom-2 right-2 animate-bounce" />
                    </div>
                </div>

                <h1 className="text-3xl font-black text-white mb-4 tracking-tight">
                    System Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Maintenance</span>
                </h1>

                <p className="text-white/60 mb-8 leading-relaxed">
                    We are currently performing scheduled processing to improve your experience. System access is temporarily paused.
                </p>

                <div className="space-y-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 text-left">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <AlertTriangle className="text-yellow-500 w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white text-sm font-bold">Don't Worry</h3>
                            <p className="text-white/40 text-xs">Your funds and data are completely safe.</p>
                        </div>
                    </div>

                    <div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-white/40">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Expected completion: Soon
                    </div>
                </div>

                <div className="mt-8 text-white/20 text-xs">
                    Dove Investment Gold Mine &copy; 2026
                </div>
            </div>
        </div>
    );
};

export default Maintenance;
