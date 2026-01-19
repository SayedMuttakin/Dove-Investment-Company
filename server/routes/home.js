import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import SystemSettings from '../models/SystemSettings.js';
import Notification from '../models/Notification.js';
import Deposit from '../models/Deposit.js';

const router = express.Router();

// Get platform statistics
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        // Get total users
        const totalUsers = await User.countDocuments({ role: 'user' });

        // Get active investments count
        const usersWithInvestments = await User.aggregate([
            { $match: { role: 'user' } },
            { $unwind: '$investments' },
            { $match: { 'investments.status': 'active' } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        const activeInvestments = usersWithInvestments[0]?.count || 0;

        // Get total earnings distributed
        const earningsData = await User.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
        ]);

        const totalEarnings = earningsData[0]?.total || 0;

        // Get unread notifications for current user
        // Note: req.userId comes from authMiddleware
        const unreadNotifications = await Notification.countDocuments({
            userId: req.userId,
            status: 'unread'
        });

        // Get system settings for additional info
        let settings = await SystemSettings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = new SystemSettings();
            await settings.save();
        }

        res.json({
            totalUsers,
            activeInvestments,
            totalEarningsDistributed: totalEarnings,
            platformStatus: settings.maintenanceMode ? 'maintenance' : 'operational',
            unreadNotifications // Added this field
        });

    } catch (error) {
        console.error('Platform stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get about page statistics
router.get('/about-stats', async (req, res) => {
    try {
        // 1. Total Users (Base 1,000 + actual count)
        const actualUserCount = await User.countDocuments({ role: 'user' });
        const displayUsers = 1000 + actualUserCount;

        // 2. Capital Pool (Base 2623.13 + actual approved deposits)
        // Note: Deposits are in USD now ($10 minimum)
        const deposits = await Deposit.find({ status: 'approved' });
        const totalDeposited = deposits.reduce((sum, d) => sum + d.amount, 0);

        // Convert totalDeposited to "million" context if needed, 
        // but user says "add to the current amount".
        // Current amount is 2623.13 million. 
        // If we just add raw dollars, it won't make sense unless we scale it.
        // However, the user said "akhn je amount ace setai thakbe sudhu next joto deposite hbe ekhane ei amount tar sathe add hote thakbe".
        // This suggests a simple sum, but since it's "million capital pool", 
        // maybe we should add (totalDeposited / 1,000,000) to 2623.13.
        // OR the user might just want the raw number to increase.
        // Let's assume the base is 2623.13 and we add real-time growth.

        const displayCapitalPool = (2623.13 + (totalDeposited / 1000000)).toFixed(2);

        res.json({
            users: displayUsers.toLocaleString(),
            capitalPool: displayCapitalPool
        });
    } catch (error) {
        console.error('About stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get company information
router.get('/company-info', async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();

        if (!settings) {
            settings = new SystemSettings();
            await settings.save();
        }

        res.json({
            name: settings.companyName,
            description: settings.companyDescription,
            email: settings.companyEmail,
            phone: settings.companyPhone,
            address: settings.companyAddress,
            appDownloadUrl: settings.appDownloadUrl
        });

    } catch (error) {
        console.error('Company info error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get active banners
router.get('/banners', async (req, res) => {
    try {
        const now = new Date();

        const banners = await Banner.find({
            isActive: true,
            $or: [
                { startDate: null, endDate: null },
                { startDate: { $lte: now }, endDate: null },
                { startDate: null, endDate: { $gte: now } },
                { startDate: { $lte: now }, endDate: { $gte: now } }
            ]
        }).sort({ displayOrder: 1 });

        res.json(banners);

    } catch (error) {
        console.error('Banners error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user notifications (authenticated)
router.get('/notifications', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        // For now, return a simple structure
        // You can extend this with a Notification model later
        const notifications = [
            {
                id: '1',
                type: 'system',
                title: 'Welcome to Dove Investment',
                message: 'Start investing today and earn daily returns!',
                read: false,
                createdAt: new Date()
            }
        ];

        res.json(notifications);

    } catch (error) {
        console.error('Notifications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get available packages for home page display
router.get('/packages', async (req, res) => {
    try {
        const packages = await Package.find({ isActive: true })
            .sort({ minAmount: 1 })
            .limit(10);

        res.json(packages);

    } catch (error) {
        console.error('Packages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
