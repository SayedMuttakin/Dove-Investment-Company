import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Commission from '../models/Commission.js';
import User from '../models/User.js';

const router = express.Router();

// Get unclaimed team commissions
router.get('/unclaimed', authMiddleware, async (req, res) => {
    try {
        const unclaimedCommissions = await Commission.find({
            toUser: req.userId,
            claimed: false
        }).populate('fromUser', 'fullName phone invitationCode');

        const totalUnclaimed = unclaimedCommissions.reduce((sum, c) => sum + c.amount, 0);

        res.json({
            commissions: unclaimedCommissions,
            totalAmount: totalUnclaimed,
            count: unclaimedCommissions.length
        });
    } catch (error) {
        console.error('Get unclaimed commissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Claim all team commissions
router.post('/claim', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all unclaimed commissions
        const unclaimedCommissions = await Commission.find({
            toUser: req.userId,
            claimed: false
        });

        if (unclaimedCommissions.length === 0) {
            return res.status(400).json({ message: 'No commissions to claim' });
        }

        // Calculate total amount
        const totalAmount = unclaimedCommissions.reduce((sum, c) => sum + c.amount, 0);

        // Mark all as claimed
        await Commission.updateMany(
            { toUser: req.userId, claimed: false },
            {
                $set: {
                    claimed: true,
                    claimedAt: new Date()
                }
            }
        );

        // Add to user's balance and teamIncome
        user.balance += totalAmount;
        user.teamIncome = (user.teamIncome || 0) + totalAmount;
        user.teamEarnings = (user.teamEarnings || 0) + totalAmount;
        await user.save();

        res.json({
            message: 'Commissions claimed successfully',
            amount: totalAmount,
            count: unclaimedCommissions.length,
            newBalance: user.balance
        });
    } catch (error) {
        console.error('Claim commissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get commission history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const commissions = await Commission.find({
            toUser: req.userId
        })
            .populate('fromUser', 'fullName phone invitationCode')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ commissions });
    } catch (error) {
        console.error('Get commission history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
