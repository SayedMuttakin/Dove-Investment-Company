import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isBlocked, setIsBlocked] = useState(false);
    const pollingRef = useRef(null);
    const interceptorRef = useRef(null);

    // ✅ INSTANT BLOCK LOGOUT: Setup global axios interceptor
    useEffect(() => {
        // Remove any existing interceptor
        if (interceptorRef.current !== null) {
            axios.interceptors.response.eject(interceptorRef.current);
        }

        interceptorRef.current = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status;
                const code = error.response?.data?.code;

                // If server returns 403 ACCOUNT_BLOCKED → instant logout
                if (status === 403 && code === 'ACCOUNT_BLOCKED') {
                    console.warn('[Auth] Account blocked — forcing logout');
                    performLogout(true);
                }
                // If 401 (token invalid/expired) → logout
                else if (status === 401) {
                    const currentToken = localStorage.getItem('token');
                    if (currentToken) {
                        console.warn('[Auth] Unauthorized — forcing logout');
                        performLogout(false);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            if (interceptorRef.current !== null) {
                axios.interceptors.response.eject(interceptorRef.current);
            }
        };
    }, []);

    // Perform logout (optionally mark as blocked)
    const performLogout = (blocked = false) => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsBlocked(blocked);
        delete axios.defaults.headers.common['Authorization'];
        stopPolling();
    };

    // ✅ BLOCK POLLING: Check block status every 15 seconds while logged in
    const startPolling = () => {
        stopPolling();
        pollingRef.current = setInterval(async () => {
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
                stopPolling();
                return;
            }
            try {
                // Lightweight check-block endpoint
                await axios.get('/api/auth/check-block');
            } catch (error) {
                // The interceptor above handles 403/401 automatically
                // No extra handling needed here
            }
        }, 15000); // Poll every 15 seconds
    };

    const stopPolling = () => {
        if (pollingRef.current) {
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    // Start polling only when user is authenticated
    useEffect(() => {
        if (user) {
            startPolling();
        } else {
            stopPolling();
        }
        return () => stopPolling();
    }, [user]);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data);
            setIsBlocked(false);
        } catch (error) {
            // interceptor handles 403/401 — just clean up here
            if (error.response?.data?.code !== 'ACCOUNT_BLOCKED') {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (phone, password) => {
        const response = await axios.post('/api/auth/login', { phone, password });
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setIsBlocked(false);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return response.data;
    };

    const register = async (userData) => {
        const response = await axios.post('/api/auth/register', userData);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser(user);
        setIsBlocked(false);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return response.data;
    };

    const logout = () => {
        performLogout(false);
    };

    const updateUserInfo = (newData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...newData
        }));
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUserInfo,
        isAuthenticated: !!user,
        isBlocked
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
