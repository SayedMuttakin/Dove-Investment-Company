import express from 'express';
import Package from '../models/Package.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all investment packages
router.get('/packages', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        const requestedVipLevel = req.query.vipLevel !== undefined ? parseInt(req.query.vipLevel) : (user.vipLevel || 0);

        const packages = await Package.find({
            isActive: true,
            vipLevel: requestedVipLevel
        }).sort({ duration: 1 });
        res.json(packages);
    } catch (error) {
        console.error('Get packages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create investment
router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { packageId, amount } = req.body;

        // Validation
        const pkg = await Package.findById(packageId);
        if (!pkg) {
            return res.status(404).json({ message: 'Package not found' });
        }

        if (!pkg.isActive) {
            return res.status(400).json({ message: 'Package is not active' });
        }

        if (amount < pkg.minAmount || amount > pkg.maxAmount) {
            return res.status(400).json({
                message: `Investment amount must be between $${pkg.minAmount} and $${pkg.maxAmount}`
            });
        }

        const user = await User.findById(req.user.userId);
        if (user.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        // Deduct balance
        user.balance -= amount;

        // Calculate total return for record keeping
        const dailyReturn = amount * (pkg.dailyRate / 100);
        const totalReturn = amount + (dailyReturn * pkg.duration);

        // Add investment
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + pkg.duration);

        user.investments.push({
            package: {
                packageNumber: pkg.duration, // Using duration as an identifier for now or add a code
                name: pkg.name,
                investmentAmount: amount,
                dailyEarning: dailyReturn,
                duration: pkg.duration,
                totalReturn: totalReturn
            },
            startDate: startDate,
            endDate: endDate,
            totalEarned: 0,
            status: 'active'
        });

        await user.save();

        res.status(201).json({
            message: 'Investment created successfully',
            balance: user.balance,
            investment: user.investments[user.investments.length - 1]
        });

    } catch (error) {
        console.error('Create investment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get claimable income
router.get('/income', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const now = new Date();
        let totalClaimable = 0;
        let claimableCount = 0;
        const activeIncome = [];

        // Check active investments for claimable income
        user.investments.forEach(inv => {
            if (inv.status === 'active') {
                const lastClaim = inv.lastEarningDate || inv.startDate;
                const hoursSince = (now - new Date(lastClaim)) / (1000 * 60 * 60);

                // Allow claim if 24 hours passed
                if (hoursSince >= 24) {
                    const days = Math.floor(hoursSince / 24);
                    const amount = days * inv.package.dailyEarning;

                    if (amount > 0) {
                        totalClaimable += amount;
                        claimableCount++;
                        activeIncome.push({
                            package: inv.package.name,
                            amount: amount,
                            days: days
                        });
                    }
                }
            }
        });

        res.json({
            totalClaimable,
            claimableCount,
            details: activeIncome,
            stats: {
                totalEarnings: user.totalEarnings,
                interestIncome: user.interestIncome,
                teamIncome: user.teamIncome,
                bonusIncome: user.bonusIncome
            }
        });
    } catch (error) {
        console.error('Get income error:', error);
        res.status(500).json({ message: 'Server error parsing income' });
    }
});

// Collect income
router.post('/collect', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const now = new Date();
        let collectedTotal = 0;
        let completedPackages = [];

        // Iterate and collect
        user.investments.forEach(inv => {
            if (inv.status === 'active') {
                const lastClaim = inv.lastEarningDate || inv.startDate;
                const timeDiff = now - new Date(lastClaim);
                const hoursSince = timeDiff / (1000 * 60 * 60);

                // Income Collection Logic
                if (hoursSince >= 24) {
                    const days = Math.floor(hoursSince / 24);
                    const amount = days * inv.package.dailyEarning;

                    if (amount > 0) {
                        collectedTotal += amount;
                        inv.totalEarned += amount;

                        const lastDate = new Date(lastClaim);
                        lastDate.setDate(lastDate.getDate() + days); // Move forward by claimable days
                        inv.lastEarningDate = lastDate;
                    }
                }

                // Expiration Logic
                if (new Date(inv.endDate) <= now) {
                    inv.status = 'completed';
                    // Return Principal
                    user.balance += inv.package.investmentAmount;
                    completedPackages.push(inv.package.name);

                    // Log completion
                    console.log(`[Invest] Package expired/completed: ${inv.package.name} for user ${user.phone}`);
                }
            }
        });

        if (collectedTotal > 0 || completedPackages.length > 0) {
            user.balance += collectedTotal;
            user.totalEarnings += collectedTotal;
            user.interestIncome += collectedTotal; // Track specifically as interest income
            await user.save();

            res.json({
                success: true,
                collected: collectedTotal,
                newBalance: user.balance,
                completed: completedPackages
            });
        } else {
            res.status(400).json({ message: 'No income available to collect yet' });
        }

    } catch (error) {
        console.error('Collect income error:', error);
        res.status(500).json({ message: 'Server error collecting income' });
    }
});

// Get assets summary
router.get('/assets', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`[Assets] Request from User ID: ${req.userId}`);
        console.log(`[Assets] Found Database User: ${user.phone} (${user._id})`);
        console.log(`[Assets] Active Investments Count: ${user.investments.filter(i => i.status === 'active').length}`);
        console.log(`[Assets] Current Balance: ${user.balance}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const now = new Date();
        let totalInvested = 0;
        let availableIncome = 0;
        let redeemableAmount = 0;
        let maturedAmount = 0;
        let maturedCount = 0;

        // Auto-process matured investments
        user.investments.forEach(inv => {
            if (inv.status === 'active' && new Date(inv.endDate) <= now) {
                // Investment has matured/completed
                inv.status = 'completed';
                // Return principal amount to balance
                user.balance += inv.package.investmentAmount;
                maturedAmount += inv.package.investmentAmount;
                maturedCount++;

                console.log(`[Assets] Auto-matured investment: ${inv.package.name} - Principal: ${inv.package.investmentAmount} USDT`);
            }
        });

        // Save if any investments were matured
        if (maturedCount > 0) {
            await user.save();
            console.log(`[Assets] ${maturedCount} investments matured. Total returned: ${maturedAmount} USDT. New balance: ${user.balance}`);
        }

        // Calculate investment statistics
        if (user.investments && user.investments.length > 0) {
            user.investments.forEach(inv => {
                if (inv.status === 'active') {
                    // Add to total invested (principal amount)
                    if (inv.package && inv.package.investmentAmount) {
                        totalInvested += inv.package.investmentAmount;
                    }
                }
            });
        }

        // Available income is the user's current balance (collected earnings + deposits)
        availableIncome = user.balance || 0;
        const totalAssets = totalInvested + availableIncome + redeemableAmount;

        res.json({
            totalAssets: totalAssets,
            availableIncome: availableIncome,
            lendingInvestments: totalInvested,
            redeemable: redeemableAmount,
            fundInProgress: totalInvested, // Same as lending investments
            fundRedeemable: redeemableAmount
        });
    } catch (error) {
        console.error('Get assets error:', error);
        res.status(500).json({ message: 'Server error fetching assets' });
    }
});

export default router;
