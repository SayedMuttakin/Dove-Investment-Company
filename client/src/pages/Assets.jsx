import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HelpCircle, ArrowUpRight, ArrowDownLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from '../components/BottomNav';
import PinModal from '../components/PinModal';

const Assets = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showPinModal, setShowModal] = useState(false);
    const [pinMode, setPinMode] = useState('verify'); // 'setup' or 'verify'
    const [actionType, setActionType] = useState(null); // 'deposit' or 'withdraw'
    const [assetsData, setAssetsData] = useState({
        totalAssets: 0,
        availableIncome: 0,
        lendingInvestments: 0,
        redeemable: 0,
        fundInProgress: 0,
        fundRedeemable: 0
    });
    const [loading, setLoading] = useState(true);

    const handleActionClick = (type) => {
        setActionType(type);
        if (user?.hasTransactionPin) {
            setPinMode('verify');
        } else {
            setPinMode('setup');
        }
        setShowModal(true);
    };

    const handlePinSuccess = () => {
        setShowModal(false);
        if (actionType === 'deposit') {
            navigate('/deposit');
        } else if (actionType === 'withdraw') {
            navigate('/withdraw');
        }

        if (pinMode === 'setup') {
            window.location.reload();
        }
    };

    const handleRedeem = async () => {
        try {
            const response = await axios.post('/api/invest/redeem');
            if (response.data.success) {
                // Refresh assets data
                fetchAssets();
                alert(`Successfully redeemed ${response.data.redeemed} USDT to your balance.`);
            }
        } catch (error) {
            console.error('Redeem error:', error);
            alert(error.response?.data?.message || 'Failed to redeem assets');
        }
    };

    const fetchAssets = async () => {
        try {
            // Ensure no caching by adding timestamp
            const response = await axios.get(`/api/invest/assets?t=${new Date().getTime()}`);
            console.log('Assets Data Fetched:', response.data);
            setAssetsData(response.data);
        } catch (error) {
            console.error('Fetch assets error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    return (
        <div className="min-h-screen bg-dark-300 pb-24 text-white">
            <PinModal
                isOpen={showPinModal}
                onClose={() => setShowModal(false)}
                onSuccess={handlePinSuccess}
                mode={pinMode}
            />

            {/* Header */}
            <div className="bg-dark-200 border-b border-white/10">
                <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
                    {/* Page Name - Center */}
                    <div className="flex-1 text-center">
                        <h1 className="text-white font-bold text-lg">Assets</h1>
                    </div>

                    {/* Icons - Right Side */}
                    <div className="flex items-center gap-3">
                        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                            <HelpCircle size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 space-y-6 mt-4">
                {/* Main Asset Card */}
                <div className="bg-gradient-to-br from-black to-gray-900 border border-white/10 rounded-3xl p-5 relative overflow-hidden shadow-lg">
                    {/* Top Section */}
                    <div className="mb-4 relative z-10">
                        <p className="text-gray-400 text-sm mb-1">Total assets (Converted)</p>
                        <h2 className="text-4xl font-bold text-[#b4f000]">{loading ? '...' : assetsData.totalAssets.toFixed(2)} <span className="text-lg text-gray-400 font-normal">USDT</span></h2>
                    </div>

                    {/* Tether Icon Decoration - 3D Coin Style */}
                    <div className="absolute -top-2 -right-2 z-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.6)] border-2 border-emerald-300/50 relative overflow-hidden">
                            {/* Coin Shine Effect */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-full blur-sm"></div>
                            {/* Coin Inner Detail */}
                            <div className="w-12 h-12 rounded-full border border-emerald-800/30 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-800 shadow-inner">
                                <span className="text-white font-bold text-2xl drop-shadow-md">T</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card - Changed Background Color - Using a lighter lime/yellow shade for contrast as requested */}
                    <div className="bg-[#ccff00] text-black rounded-2xl p-4 grid grid-cols-3 gap-2 text-center mb-4 shadow-lg relative z-10 transition-colors">
                        <div>
                            <p className="font-bold text-lg">{loading ? '...' : assetsData.availableIncome.toFixed(2)} <span className="text-xs font-normal">USDT</span></p>
                            <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Available Assets</p>
                        </div>
                        <div className="border-l border-black/10">
                            <p className="font-bold text-lg">{loading ? '...' : assetsData.lendingInvestments.toFixed(0)} <span className="text-xs font-normal">USDT</span></p>
                            <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Lending Investments</p>
                        </div>
                        <div className="border-l border-black/10">
                            <p className="font-bold text-lg">{loading ? '...' : assetsData.redeemable.toFixed(0)} <span className="text-xs font-normal">USDT</span></p>
                            <p className="text-[10px] uppercase tracking-wider font-semibold opacity-70">Redeemable</p>
                        </div>
                    </div>

                    {/* Bottom Stats */}
                    <div className="space-y-1 text-sm text-gray-400">
                        <div className="flex justify-between text-[11px]">
                            <span>Fund investment in progress</span>
                            <span>{loading ? '...' : assetsData.fundInProgress.toFixed(0)} USDT</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                            <span>Fund redeemable</span>
                            <span>{loading ? '...' : assetsData.fundRedeemable.toFixed(0)} USDT</span>
                        </div>
                    </div>

                    {/* Redeem Button if balance exists */}
                    {assetsData.redeemable > 0 && (
                        <button
                            onClick={handleRedeem}
                            className="w-full mt-4 py-3 bg-white/5 border border-white/20 rounded-xl text-[#b4f000] font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Redeem Matured Assets</span>
                            <ArrowUpRight size={16} />
                        </button>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => handleActionClick('deposit')}
                        className="flex items-center justify-center gap-2 glass-card py-3 rounded-xl font-medium hover:bg-glass-medium transition-all text-white"
                    >
                        <ArrowDownLeft className="text-[#b4f000]" size={20} />
                        <span>Deposit</span>
                    </button>
                    <button
                        onClick={() => handleActionClick('withdraw')}
                        className="flex items-center justify-center gap-2 glass-card py-3 rounded-xl font-medium hover:bg-glass-medium transition-all text-white"
                    >
                        <ArrowUpRight className="text-red-500" size={20} />
                        <span>Withdraw</span>
                    </button>
                </div>

                {/* Asset List */}
                <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
                            T
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-lg text-white">USDT</h3>
                                <div className="text-right">
                                    <span className="text-xs text-gray-400 block">Redeemable</span>
                                    <span className="font-medium text-white">{loading ? '...' : assetsData.redeemable.toFixed(0)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div>
                                    <span className="text-gray-400 text-xs block">Available</span>
                                    <span className="font-medium text-white">{loading ? '...' : assetsData.availableIncome.toFixed(2)}</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-gray-400 text-xs block">Investment</span>
                                    <span className="font-medium text-white">{loading ? '...' : assetsData.lendingInvestments.toFixed(0)}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-400 text-xs text-transparent select-none">.</span>
                                    <span className="font-bold block text-white">{loading ? '...' : `${assetsData.totalAssets.toFixed(2)} ≈ ${assetsData.totalAssets.toFixed(2)} USDT`}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Assets;
