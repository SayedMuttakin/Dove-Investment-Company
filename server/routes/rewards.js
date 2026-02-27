import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';
import { createNotification } from '../utils/notifications.js';

const router = express.Router();

const REWARD_TIERS = [
    { id: 'tier1', points: 7, amount: 50, icon: '🎇' },
    { id: 'tier2', points: 12, amount: 85, icon: '🎇🎇' },
    { id: 'tier3', points: 18, amount: 130, icon: '🎇🎇🎇' }
];

// Get reward status
router.get('/status', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Calculate points based on referrals in the last 10 days
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        // Gen 1 (Directs)
        const directs = await User.find({
            referredBy: user.invitationCode,
            createdAt: { $gte: tenDaysAgo }
        });
        const aCount = directs.length;

        // Gen 2 (Indirects)
        const directCodes = directs.map(u => u.invitationCode);
        const secondGen = await User.find({
            referredBy: { $in: directCodes },
            createdAt: { $gte: tenDaysAgo }
        });
        const bCount = secondGen.length;

        // Formula: A + B/2
        const totalPoints = aCount + Math.floor(bCount / 2);

        res.json({
            points: totalPoints,
            aCount,
            bCount,
            claimed: user.claimedStarRewards || [],
            tiers: REWARD_TIERS,
            windowDays: 10
        });
    } catch (error) {
        console.error('Reward status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Claim reward
router.post('/claim', authMiddleware, async (req, res) => {
    try {
        const { tierId } = req.body;
        const tier = REWARD_TIERS.find(t => t.id === tierId);
        if (!tier) return res.status(400).json({ message: 'Invalid tier' });

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.claimedStarRewards?.includes(tierId)) {
            return res.status(400).json({ message: 'Reward already claimed' });
        }

        // Re-calculate points for verification
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        const directs = await User.find({
            referredBy: user.invitationCode,
            createdAt: { $gte: tenDaysAgo }
        });
        const aCount = directs.length;

        const directCodes = directs.map(u => u.invitationCode);
        const secondGen = await User.find({
            referredBy: { $in: directCodes },
            createdAt: { $gte: tenDaysAgo }
        });
        const bCount = secondGen.length;

        const totalPoints = aCount + Math.floor(bCount / 2);

        if (totalPoints < tier.points) {
            return res.status(400).json({ message: `Insufficient points. You need ${tier.points} points.` });
        }

        // Update user
        user.balance += tier.amount;
        user.bonusIncome = (user.bonusIncome || 0) + tier.amount;
        user.claimedStarRewards.push(tierId);
        await user.save();

        // Notification
        await createNotification({
            userId: user._id,
            title: 'Star Reward Claimed! 🎇',
            message: `Congratulations! You've received $${tier.amount} for reaching ${tier.points} Star Points!`,
            type: 'bonus'
        });

        res.json({
            success: true,
            message: 'Reward claimed successfully',
            newBalance: user.balance,
            claimed: user.claimedStarRewards
        });
    } catch (error) {
        console.error('Claim reward error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
