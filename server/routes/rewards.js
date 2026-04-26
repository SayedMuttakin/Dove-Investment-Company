import express from 'express';
import User from '../models/User.js';
import Deposit from '../models/Deposit.js';
import { authMiddleware } from '../middleware/auth.js';
import { createNotification } from '../utils/notifications.js';

const router = express.Router();

// 💎 DOVE INVESTMENT GOLD MINE — DIAMOND SALARY LEVELS
const DIAMOND_SALARY_LEVELS = [
    {
        id: 'diamond1',
        level: 1,
        aRequired: 20,
        bcRequired: 70,
        monthlyUSD: 150,
        gift: 'Smart Phone',
        giftEmoji: '📱',
        giftType: 'phone'
    },
    {
        id: 'diamond2',
        level: 2,
        aRequired: 30,
        bcRequired: 150,
        monthlyUSD: 250,
        gift: 'Laptop',
        giftEmoji: '💻',
        giftType: 'laptop'
    },
    {
        id: 'diamond3',
        level: 3,
        aRequired: 35,
        bcRequired: 510,
        monthlyUSD: 350,
        gift: 'iPhone 17 Pro Max',
        giftEmoji: '📱',
        giftType: 'iphone'
    },
    {
        id: 'diamond4',
        level: 4,
        aRequired: 55,
        bcRequired: 1010,
        monthlyUSD: 450,
        gift: '2 Wheeler Scooty',
        giftEmoji: '🛵',
        giftType: 'scooty'
    },
    {
        id: 'diamond5',
        level: 5,
        aRequired: 65,
        bcRequired: 1510,
        monthlyUSD: 1000,
        gift: 'Super Bike',
        giftEmoji: '🏍️',
        giftType: 'bike'
    },
    {
        id: 'diamond6',
        level: 6,
        aRequired: 85,
        bcRequired: 2510,
        monthlyUSD: 2000,
        gift: '4 Wheeler Car',
        giftEmoji: '🚗',
        giftType: 'car'
    }
];

// GET /api/rewards/salary-status — returns team counts + salary level info
router.get('/salary-status', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Count Gen A (direct referrals with approved deposit)
        const directs = await User.find({ referredBy: user.invitationCode });
        const directIds = directs.map(u => u._id);
        const depositedDirectIds = await Deposit.distinct('userId', {
            userId: { $in: directIds },
            status: 'approved'
        });
        const aCount = depositedDirectIds.length;

        // Count Gen B+C (2nd + 3rd gen with approved deposit)
        // Gen B — referrals of active Gen A members
        const depositedDirectUsers = directs.filter(u =>
            depositedDirectIds.some(id => id.equals(u._id))
        );
        const genACodes = depositedDirectUsers.map(u => u.invitationCode);

        const genBUsers = await User.find({ referredBy: { $in: genACodes } });
        const genBIds = genBUsers.map(u => u._id);
        const depositedGenBIds = await Deposit.distinct('userId', {
            userId: { $in: genBIds },
            status: 'approved'
        });
        const bCount = depositedGenBIds.length;

        // Gen C — referrals of active Gen B members
        const depositedGenBUsers = genBUsers.filter(u =>
            depositedGenBIds.some(id => id.equals(u._id))
        );
        const genBCodes = depositedGenBUsers.map(u => u.invitationCode);

        let cCount = 0;
        if (genBCodes.length > 0) {
            const genCUsers = await User.find({ referredBy: { $in: genBCodes } });
            const genCIds = genCUsers.map(u => u._id);
            const depositedGenCIds = await Deposit.distinct('userId', {
                userId: { $in: genCIds },
                status: 'approved'
            });
            cCount = depositedGenCIds.length;
        }

        const bcCount = bCount + cCount;

        // Determine current achieved salary level
        let achievedLevel = 0;
        for (const lvl of DIAMOND_SALARY_LEVELS) {
            if (aCount >= lvl.aRequired && bcCount >= lvl.bcRequired) {
                achievedLevel = lvl.level;
            }
        }

        res.json({
            aCount,
            bCount,
            cCount,
            bcCount,
            achievedLevel,
            claimedSalaryLevels: user.claimedSalaryLevels || [],
            levels: DIAMOND_SALARY_LEVELS,
            // maintenance ratio info
            maintenanceRatioMin: 28,
            maintenanceRatioMax: 30
        });
    } catch (error) {
        console.error('Diamond salary status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/rewards/claim-salary — claim the one-time gift for a salary level
router.post('/claim-salary', authMiddleware, async (req, res) => {
    try {
        const { levelId } = req.body;
        const salaryLevel = DIAMOND_SALARY_LEVELS.find(l => l.id === levelId);
        if (!salaryLevel) return res.status(400).json({ message: 'Invalid salary level' });

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const claimed = user.claimedSalaryLevels || [];
        if (claimed.includes(levelId)) {
            return res.status(400).json({ message: 'Gift for this level already claimed' });
        }

        // Verify they actually qualify
        const directs = await User.find({ referredBy: user.invitationCode });
        const directIds = directs.map(u => u._id);
        const depositedDirectIds = await Deposit.distinct('userId', {
            userId: { $in: directIds },
            status: 'approved'
        });
        const aCount = depositedDirectIds.length;

        const depositedDirectUsers = directs.filter(u =>
            depositedDirectIds.some(id => id.equals(u._id))
        );
        const genACodes = depositedDirectUsers.map(u => u.invitationCode);
        const genBUsers = await User.find({ referredBy: { $in: genACodes } });
        const genBIds = genBUsers.map(u => u._id);
        const depositedGenBIds = await Deposit.distinct('userId', {
            userId: { $in: genBIds },
            status: 'approved'
        });
        const bCount = depositedGenBIds.length;

        const depositedGenBUsers = genBUsers.filter(u =>
            depositedGenBIds.some(id => id.equals(u._id))
        );
        const genBCodes = depositedGenBUsers.map(u => u.invitationCode);
        let cCount = 0;
        if (genBCodes.length > 0) {
            const genCUsers = await User.find({ referredBy: { $in: genBCodes } });
            const genCIds = genCUsers.map(u => u._id);
            const depositedGenCIds = await Deposit.distinct('userId', {
                userId: { $in: genCIds },
                status: 'approved'
            });
            cCount = depositedGenCIds.length;
        }
        const bcCount = bCount + cCount;

        if (aCount < salaryLevel.aRequired || bcCount < salaryLevel.bcRequired) {
            return res.status(400).json({ message: 'You do not meet the requirements for this salary level' });
        }

        // Record the claim
        user.claimedSalaryLevels = [...claimed, levelId];
        await user.save();

        await createNotification({
            userId: user._id,
            title: `💎 Diamond Level ${salaryLevel.level} Gift Claimed!`,
            message: `Congratulations! You have claimed your ${salaryLevel.gift} (One Time Gift) for Diamond Level ${salaryLevel.level}. Your monthly salary of $${salaryLevel.monthlyUSD} is now active!`,
            type: 'reward'
        });

        res.json({
            message: `Successfully claimed Diamond Level ${salaryLevel.level} gift: ${salaryLevel.gift}!`,
            level: salaryLevel.level
        });
    } catch (error) {
        console.error('Diamond salary claim error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── Legacy star routes kept for backward compat (returns empty/no-op) ───────
router.get('/status', authMiddleware, async (req, res) => {
    res.json({ points: 0, aCount: 0, bCount: 0, claimed: [], tiers: [], missionStart: null, missionEnd: null });
});

router.post('/claim', authMiddleware, async (req, res) => {
    res.status(410).json({ message: 'Star rewards system has been replaced with Diamond Salary system.' });
});

export default router;
