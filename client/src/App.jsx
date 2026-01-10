import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Deposit from './pages/Deposit';
import Lend from './pages/Lend';
import Income from './pages/Income';
import Me from './pages/Me';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDeposits from './pages/admin/AdminDeposits';
import AdminUsers from './pages/admin/AdminUsers';
import Withdraw from './pages/Withdraw';
import AdminPackages from './pages/admin/AdminPackages';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReports from './pages/admin/AdminReports';
import Assets from './pages/Assets';

// Restoring Placeholder components
const Market = () => <div className="min-h-screen bg-dark-300 text-white flex items-center justify-center"><h1 className="text-2xl">Market Page - Coming Soon</h1></div>;
const Community = () => <div className="min-h-screen bg-dark-300 text-white flex items-center justify-center"><h1 className="text-2xl">Community Page - Coming Soon</h1></div>;
const Mine = () => <div className="min-h-screen bg-dark-300 text-white flex items-center justify-center"><h1 className="text-2xl">Mine Page - Coming Soon</h1></div>;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-300 flex items-center justify-center">
                <div className="text-primary text-xl">Loading...</div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-300 flex items-center justify-center">
                <div className="text-primary text-xl">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user?.role !== 'admin') {
        return <Navigate to="/home" replace />;
    }

    return children;
};

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User Routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/deposit" element={<ProtectedRoute><Deposit /></ProtectedRoute>} />
            <Route path="/withdraw" element={<ProtectedRoute><Withdraw /></ProtectedRoute>} />
            <Route path="/lend" element={<ProtectedRoute><Lend /></ProtectedRoute>} />
            <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
            <Route path="/me" element={<ProtectedRoute><Me /></ProtectedRoute>} />
            <Route path="/market" element={<ProtectedRoute><Market /></ProtectedRoute>} />
            <Route path="/assets" element={<ProtectedRoute><Assets /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/mine" element={<ProtectedRoute><Mine /></ProtectedRoute>} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="deposits" element={<AdminDeposits />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="withdrawals" element={<AdminWithdrawals />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="reports" element={<AdminReports />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

export default App;
