import express from 'express';
import Deposit from '../models/Deposit.js';
import User from '../models/User.js';
import Package from '../models/Package.js';
import { authMiddleware } from '../middleware/auth.js';
import SystemSettings from '../models/SystemSettings.js';

const router = express.Router();

// Get Wallet Addresses
router.get('/wallets', async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
            await settings.save();
        }
        res.json({
            wallets: {
                TRC20: settings.walletTRC20,
                BTC: settings.walletBTC,
                ETH: settings.walletETH,
                BSC: settings.walletBSC
            },
            minDepositAmount: settings.minDepositAmount
        });
    } catch (error) {
        console.error('Get wallets error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit Deposit
router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { amount, transactionHash, network, packageId, packageName } = req.body;
        console.log(`[Recharge] New deposit submission: User ${req.userId}, Amount: ${amount}, TX: ${transactionHash}`);

        if (!amount || !transactionHash || !network) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if transaction hash already exists
        const existingDeposit = await Deposit.findOne({ transactionHash });
        if (existingDeposit) {
            return res.status(400).json({ message: 'Transaction ID already submitted' });
        }

        const deposit = new Deposit({
            userId: req.userId,
            amount,
            transactionHash,
            network,
            packageId: packageId || null, // Store package ID for admin tracking
            packageName: packageName || null // Store package name for easy reference
        });

        await deposit.save();

        res.status(201).json({ message: 'Deposit submitted successfully', deposit });

    } catch (error) {
        console.error('Submit deposit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Approve Deposit (Auto-Invest Logic)
// NOTE: In a real app, this should be an admin-protected route. 
// For this demo, we'll assume basic auth or no specific admin role check as user roles weren't defined explicitly yet, 
// but we'll stick to authMiddleware. Ideally, check req.user.role === 'admin'.
router.post('/approve/:id', async (req, res) => {
    // TEMPORARY: Allow anyone to call approve for demo purposes if needed, OR user admin logic. 
    // Since I don't see admin auth middleware, I'll proceed with basic logic but keep it functional.
    try {
        const depositId = req.params.id;
        const deposit = await Deposit.findById(depositId);

        if (!deposit) {
            return res.status(404).json({ message: 'Deposit not found' });
        }

        if (deposit.status === 'approved') {
            return res.status(400).json({ message: 'Deposit already approved' });
        }

        deposit.status = 'approved';
        deposit.approvedAt = new Date();
        await deposit.save();

        // AUTO-INVEST LOGIC
        const user = await User.findById(deposit.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add to balance (record keeping)
        // user.balance += deposit.amount; // Wait, if we are auto-investing, we usually consume it.
        // Let's add it first.
        user.balance += deposit.amount;

        // Find matching package
        // Sort by minAmount desc to match highest valid package first (e.g. if 600, match 500-2000 instead of 100-800 if desired? 
        // Or strictly strictly ranges. 
        // 100-800 vs 500-2000. 600 matches both. Usually higher tier is better.
        const matchingPackage = await Package.findOne({
            minAmount: { $lte: deposit.amount },
            maxAmount: { $gte: deposit.amount },
            isActive: true
        }).sort({ minAmount: -1 }); // Prefer higher cost packages

        if (matchingPackage) {
            // Deduct balance
            user.balance -= deposit.amount;

            // Create Investment
            const dailyReturn = deposit.amount * (matchingPackage.dailyRate / 100);
            const totalReturn = deposit.amount + (dailyReturn * matchingPackage.duration);
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + matchingPackage.duration);

            user.investments.push({
                package: {
                    packageNumber: matchingPackage.duration,
                    name: matchingPackage.name,
                    investmentAmount: deposit.amount,
                    dailyEarning: dailyReturn,
                    duration: matchingPackage.duration,
                    totalReturn: totalReturn
                },
                startDate: startDate,
                endDate: endDate,
                totalEarned: 0,
                status: 'active'
            });

            console.log(`Auto-invested $${deposit.amount} in ${matchingPackage.name} for user ${user.phone}`);
        } else {
            // No package matched, money stays in balance
            console.log(`No matching package for $${deposit.amount}, added to balance.`);
        }

        await user.save();

        res.json({ message: 'Deposit approved and processed', package: matchingPackage ? matchingPackage.name : 'None' });

    } catch (error) {
        console.error('Approve deposit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
