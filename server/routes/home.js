import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import SystemSettings from '../models/SystemSettings.js';
import Banner from '../models/Banner.js';

const router = express.Router();

// Get platform statistics
router.get('/stats', async (req, res) => {
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
            platformStatus: settings.maintenanceMode ? 'maintenance' : 'operational'
        });

    } catch (error) {
        console.error('Platform stats error:', error);
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
                title: 'Welcome to NovaEarn',
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
