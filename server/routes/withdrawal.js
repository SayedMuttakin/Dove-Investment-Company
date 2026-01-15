import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';
import Withdrawal from '../models/Withdrawal.js';
import User from '../models/User.js';
import AdminLog from '../models/AdminLog.js';
import { createNotification } from '../utils/notifications.js';

const router = express.Router();

// Create withdrawal request
router.post('/request', authMiddleware, async (req, res) => {
    try {
        const { amount, bankDetails, paymentMethod } = req.body;
        const userId = req.userId;

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Auto-process matured investments before withdrawal
        const now = new Date();
        let maturedAmount = 0;
        let maturedCount = 0;

        user.investments.forEach(inv => {
            if (inv.status === 'active' && new Date(inv.endDate) <= now) {
                // Investment has matured/completed
                inv.status = 'completed';
                // Return principal amount to balance
                user.balance += inv.package.investmentAmount;
                maturedAmount += inv.package.investmentAmount;
                maturedCount++;

                console.log(`[Withdrawal] Auto-matured investment: ${inv.package.name} - Principal: ${inv.package.investmentAmount} USDT`);
            }
        });

        // Save if any investments were matured
        if (maturedCount > 0) {
            await user.save();
            console.log(`[Withdrawal] ${maturedCount} investments matured. Total returned: ${maturedAmount} USDT. New balance: ${user.balance}`);
        }

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid withdrawal amount' });
        }

        // Check if user has sufficient balance
        if (user.balance < amount) {
            return res.status(400).json({
                message: 'Insufficient balance',
                currentBalance: user.balance
            });
        }

        // Validate bank details
        if (!bankDetails || !bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName) {
            return res.status(400).json({ message: 'Please provide complete bank details' });
        }

        // Create withdrawal request
        const withdrawal = new Withdrawal({
            userId,
            amount,
            bankDetails,
            paymentMethod: paymentMethod || 'bank',
            status: 'pending'
        });

        await withdrawal.save();

        // Notification: Withdrawal Requested
        await createNotification({
            userId,
            title: 'Withdrawal Requested',
            message: `Your withdrawal request for $${amount} has been submitted.`,
            type: 'withdrawal',
            amount,
            relatedId: withdrawal._id
        });

        res.status(201).json({
            message: 'Withdrawal request submitted successfully',
            withdrawal
        });

    } catch (error) {
        console.error('Withdrawal request error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user's withdrawal history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        const withdrawals = await Withdrawal.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(withdrawals);
    } catch (error) {
        console.error('Withdrawal history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single withdrawal details
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const withdrawal = await Withdrawal.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        res.json(withdrawal);
    } catch (error) {
        console.error('Withdrawal details error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all withdrawals (with filters)
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status, limit = 100 } = req.query;
        console.log(`[Admin] Fetching all withdrawals (Status: ${status || 'all'}, Limit: ${limit})...`);
        const query = status ? { status } : {};

        const withdrawals = await Withdrawal.find(query)
            .populate('userId', 'phone invitationCode balance')
            .populate('processedBy', 'phone')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(withdrawals);
    } catch (error) {
        console.error('Admin withdrawals error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Approve withdrawal
router.post('/admin/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { transactionId, adminNote } = req.body;
        const withdrawalId = req.params.id;
        const adminId = req.userId;

        const withdrawal = await Withdrawal.findById(withdrawalId);
        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        if (withdrawal.status !== 'pending') {
            return res.status(400).json({ message: 'Withdrawal already processed' });
        }

        // Get user
        const user = await User.findById(withdrawal.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user still has sufficient balance
        if (user.balance < withdrawal.amount) {
            return res.status(400).json({
                message: 'User has insufficient balance',
                userBalance: user.balance,
                withdrawalAmount: withdrawal.amount
            });
        }

        // Deduct from user balance
        user.balance -= withdrawal.amount;
        await user.save();

        // Update withdrawal
        withdrawal.status = 'approved';
        withdrawal.transactionId = transactionId || `TXN${Date.now()}`;
        withdrawal.processedBy = adminId;
        withdrawal.processedAt = new Date();
        withdrawal.adminNote = adminNote;
        await withdrawal.save();

        // Notification: Withdrawal Approved
        await createNotification({
            userId: user._id,
            title: 'Withdrawal Approved',
            message: `Your withdrawal of $${withdrawal.amount} has been approved and processed.`,
            type: 'withdrawal',
            amount: withdrawal.amount,
            relatedId: withdrawal._id
        });

        // Log admin action
        const log = new AdminLog({
            adminId,
            action: 'withdrawal_approved',
            targetUserId: user._id,
            targetResource: {
                resourceType: 'withdrawal',
                resourceId: withdrawal._id
            },
            changes: {
                amount: withdrawal.amount,
                transactionId: withdrawal.transactionId,
                userBalanceBefore: user.balance + withdrawal.amount,
                userBalanceAfter: user.balance
            },
            description: `Approved withdrawal of ৳${withdrawal.amount} for user ${user.phone}`
        });
        await log.save();

        res.json({
            message: 'Withdrawal approved successfully',
            withdrawal,
            userNewBalance: user.balance
        });

    } catch (error) {
        console.error('Approve withdrawal error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Reject withdrawal
router.post('/admin/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { rejectionReason, adminNote } = req.body;
        const withdrawalId = req.params.id;
        const adminId = req.userId;

        const withdrawal = await Withdrawal.findById(withdrawalId);
        if (!withdrawal) {
            return res.status(404).json({ message: 'Withdrawal not found' });
        }

        if (withdrawal.status !== 'pending') {
            return res.status(400).json({ message: 'Withdrawal already processed' });
        }

        const user = await User.findById(withdrawal.userId);

        // Update withdrawal
        withdrawal.status = 'rejected';
        withdrawal.rejectionReason = rejectionReason || 'No reason provided';
        withdrawal.processedBy = adminId;
        withdrawal.processedAt = new Date();
        withdrawal.adminNote = adminNote;
        await withdrawal.save();

        // Notification: Withdrawal Rejected
        await createNotification({
            userId: withdrawal.userId,
            title: 'Withdrawal Rejected',
            message: `Your withdrawal of $${withdrawal.amount} has been rejected. Reason: ${withdrawal.rejectionReason}`,
            type: 'withdrawal',
            amount: withdrawal.amount,
            relatedId: withdrawal._id
        });

        // Log admin action
        const log = new AdminLog({
            adminId,
            action: 'withdrawal_rejected',
            targetUserId: withdrawal.userId,
            targetResource: {
                resourceType: 'withdrawal',
                resourceId: withdrawal._id
            },
            changes: {
                amount: withdrawal.amount,
                rejectionReason: withdrawal.rejectionReason
            },
            description: `Rejected withdrawal of ৳${withdrawal.amount} for user ${user?.phone || 'Unknown'}: ${rejectionReason}`
        });
        await log.save();

        res.json({
            message: 'Withdrawal rejected',
            withdrawal
        });

    } catch (error) {
        console.error('Reject withdrawal error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
