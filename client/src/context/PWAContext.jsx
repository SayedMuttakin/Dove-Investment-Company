import React, { createContext, useContext, useEffect, useState } from 'react';

const PWAContext = createContext(null);

export const PWAProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            setIsInstallable(true);
            console.log('PWA Install Prompt captured');
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstallable(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) {
            return false;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        // We've used the prompt, so clear it
        setDeferredPrompt(null);
        setIsInstallable(false);

        return outcome === 'accepted';
    };

    return (
        <PWAContext.Provider value={{ isInstallable, installApp }}>
            {children}
        </PWAContext.Provider>
    );
};

export const usePWAContext = () => {
    const context = useContext(PWAContext);
    if (!context) {
        throw new Error('usePWAContext must be used within a PWAProvider');
    }
    return context;
};
