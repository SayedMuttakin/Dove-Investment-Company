import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Wallet, AlertCircle, Bell, HelpCircle, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import SuccessModal from '../components/SuccessModal';

const Withdraw = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('trc20');
    const [showSuccess, setShowSuccess] = useState(false);
    const [blockMessage, setBlockMessage] = useState(null);

    useEffect(() => {
        if (user && user.withdrawalBlockMessage) {
            setBlockMessage(user.withdrawalBlockMessage);
        }
    }, [user]);

    // Crypto Details
    const [details, setDetails] = useState({
        address: ''
    });

    const [loading, setLoading] = useState(false);

    const methods = [
        { id: 'trc20', name: 'USDT (TRC20)', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
        { id: 'btc', name: 'Bitcoin', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
        { id: 'eth', name: 'Ethereum', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
        { id: 'bsc', name: 'BSC', logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' }
    ];

    const isCrypto = true; // All methods are now crypto

    const handleMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const bankData = {
                accountName: user.phone, // Using phone as reference name
                accountNumber: details.address,
                bankName: paymentMethod.toUpperCase(),
            };

            await axios.post('/api/withdrawal/request', {
                amount: Number(amount),
                paymentMethod,
                bankDetails: bankData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowSuccess(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-300 pb-20">
            {/* Header - Matching Home.jsx */}
            <div className="bg-dark-200 border-b border-white/10">
                <div className="max-w-md mx-auto px-4 py-1.5 flex items-center justify-between relative">
                    <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white relative z-10">
                        <ArrowLeft size={22} />
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <h1 className="text-white font-bold text-lg">Withdraw</h1>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                            <Bell size={20} />
                        </button>
                        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
                            <HelpCircle size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6 max-w-md mx-auto">

                {/* Balance Card - Refined */}
                <div className="glass-card p-6 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <span className="text-white/60 text-sm font-medium mb-1">Available Balance</span>
                        <h2 className="text-4xl font-bold text-white tracking-tight">${user?.balance?.toFixed(2) || '0.00'}</h2>
                    </div>
                </div>

                {/* Blocked Message Banner */}
                {blockMessage && (
                    <div className="glass-card p-5 border border-red-500/30 bg-red-500/10 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="flex gap-3 relative z-10">
                            <div className="bg-red-500/20 p-2 rounded-full h-fit flex-shrink-0">
                                <AlertCircle className="text-red-500" size={24} />
                            </div>
                            <div className="space-y-1 my-0.5">
                                <h3 className="text-red-400 font-bold text-sm">Withdrawals Temporarily Blocked</h3>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    {blockMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}



                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Amount */}
                    <div className="space-y-2">
                        <label className="text-white/80 text-sm font-semibold ml-1">Withdrawal Amount</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">$</span>
                            <input
                                type="number"
                                required
                                min="10"
                                placeholder="0.00"
                                className="w-full bg-dark-200 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white text-xl font-bold focus:outline-none focus:border-primary focus:bg-dark-100 transition-all"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between px-1">
                            <p className="text-white/40 text-xs text-secondary">Minimum withdrawal: $10</p>
                            <button
                                type="button"
                                onClick={() => setAmount(user?.balance?.toFixed(0))}
                                className="text-primary text-xs font-bold hover:underline"
                            >
                                Max Amount
                            </button>
                        </div>
                    </div>

                    {/* Payment Method - New Grid Layout */}
                    <div className="space-y-3">
                        <label className="text-white/80 text-sm font-semibold ml-1">Select Method</label>
                        <div className="grid grid-cols-4 gap-2">
                            {methods.map(method => (
                                <button
                                    key={method.id}
                                    type="button"
                                    onClick={() => handleMethodChange(method.id)}
                                    className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all aspect-square ${paymentMethod === method.id
                                        ? 'bg-primary border-primary shadow-glow shadow-primary/20'
                                        : 'bg-dark-200 border-white/5 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden ${paymentMethod === method.id ? 'bg-white' : 'bg-white/10'}`}>
                                        {method.logo ? (
                                            <img src={method.logo} alt={method.name} className="w-6 h-6 object-contain" />
                                        ) : (
                                            <div className={paymentMethod === method.id ? 'text-primary' : 'text-white'}>{method.icon}</div>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold truncate w-full text-center ${paymentMethod === method.id ? 'text-white' : 'text-white/60'}`}>
                                        {method.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Account/Wallet Details */}
                    <div className="glass-card p-5 space-y-4 border border-white/5">
                        <h3 className="text-white font-bold text-sm tracking-wide flex items-center gap-2">
                            <Lock size={16} className="text-primary" />
                            {isCrypto ? 'CRYPTO WALLET DETAILS' : 'ACCOUNT INFORMATION'}
                        </h3>

                        <div className="animate-fade-in">
                            <label className="text-white/50 text-[11px] font-bold uppercase tracking-wider mb-1.5 block">Recipient Wallet Address ({paymentMethod.toUpperCase()})</label>
                            <input
                                type="text"
                                required
                                placeholder="Paste your wallet address here"
                                className="w-full bg-dark-300 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-primary font-mono"
                                value={details.address}
                                onChange={(e) => setDetails({ ...details, address: e.target.value })}
                            />
                            <p className="text-yellow-500/80 text-[10px] mt-2 italic flex items-start gap-1">
                                <AlertCircle size={10} className="mt-0.5 flex-shrink-0" />
                                Ensure address is correct for {paymentMethod.toUpperCase()} network. Incorrect address leads to permanent loss.
                            </p>
                        </div>
                    </div>

                    {/* Fee and Total Deduction Details */}
                    {amount && Number(amount) >= 10 && (
                        <div className="glass-card p-4 space-y-2 border border-primary/10 bg-primary/5">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-white/60">Processing Fee (5%)</span>
                                <span className="text-red-400 font-semibold">${(Number(amount) * 0.05).toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-white/10 my-1"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-white font-bold">Total Deduction</span>
                                <span className="text-primary font-bold text-lg">${(Number(amount) * 1.05).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !!blockMessage}
                        className="w-full bg-gradient-primary text-white font-bold py-4 rounded-2xl shadow-glow-lg hover:shadow-glow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>Confirm Withdrawal</>
                        )}
                    </button>

                    <p className="text-center text-white/30 text-[11px] px-6 leading-relaxed">
                        Processing time: 72-96 hours depending on network traffic and bank hours. 5% processing fee applies.
                    </p>
                </form>
            </div>

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => {
                    setShowSuccess(false);
                    navigate('/me');
                }}
                title="Withdrawal Requested!"
                message={`Your withdrawal request for $${amount} has been submitted successfully.`}
            />
        </div>
    );
};

export default Withdraw;
