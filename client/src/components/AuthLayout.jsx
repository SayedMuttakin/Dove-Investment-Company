import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen relative bg-dark-300">
            {/* Background Image - Fixed positioned container covering viewport */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url(/images/tech-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            ></div>

            {/* Background gradient overlay */}
            <div className="fixed inset-0 bg-gradient-to-b from-dark-300/80 via-dark-300/70 to-dark-300/90 z-0 pointer-events-none"></div>

            {/* Animated background circles */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow z-0 pointer-events-none"></div>
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow z-0 pointer-events-none" style={{ animationDelay: '1s' }}></div>

            {/* Content Container - Centered nicely */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
