import React from 'react';
import { X } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card w-full max-w-sm p-8 flex flex-col items-center text-center relative animate-modal-in overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/20 rounded-full blur-3xl -mt-20"></div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Animated checkmark */}
                <div className="relative mb-6 mt-2">
                    <svg className="w-20 h-20" viewBox="0 0 52 52">
                        <circle
                            className="text-primary/20 fill-none stroke-current animate-checkmark-circle"
                            cx="26" cy="26" r="25" strokeWidth="2"
                        />
                        <circle
                            className="text-primary fill-none stroke-current animate-checkmark-circle"
                            cx="26" cy="26" r="25" strokeWidth="2"
                        />
                        <path
                            className="text-primary fill-none stroke-current animate-checkmark"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{title || 'Successful!'}</h2>
                <p className="text-white/60 mb-8 leading-relaxed max-w-[240px]">
                    {message || 'Your request has been submitted and is pending approval.'}
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-gradient-primary rounded-2xl text-white font-bold shadow-glow hover:shadow-glow-lg transition-all active:scale-[0.98]"
                >
                    Great!
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
