import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';
import User from '../models/User.js';
import Deposit from '../models/Deposit.js';
import Package from '../models/Package.js';
import Withdrawal from '../models/Withdrawal.js';
import SystemSettings from '../models/SystemSettings.js';
import Banner from '../models/Banner.js';
import multer from 'multer';
import path from 'path';
import AdminLog from '../models/AdminLog.js';
import { createNotification } from '../utils/notifications.js';
import { distributeCommissions } from '../utils/teamCommissions.js';
import Commission from '../models/Commission.js';

const router = express.Router();

// Multer Config for Package Images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/packages/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'pkg-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp|svg/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed (jpg, png, webp, svg)'));
    }
});

// Upload Package Image
router.post('/upload-image', authMiddleware, adminMiddleware, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        const filePath = `/uploads/packages/${req.file.filename}`;
        res.json({ url: filePath });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

// Get Dashboard Stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
    console.log('[Admin] Fetching dashboard stats...');
    try {
        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });

        const totalDeposits = await Deposit.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalWithdrawals = await Withdrawal.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const pendingDeposits = await Deposit.countDocuments({ status: 'pending' });
        const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });

        // Calculate total user balances
        const userBalances = await User.aggregate([
            { $group: { _id: null, total: { $sum: "$balance" } } }
        ]);

        res.json({
            totalUsers,
            totalDepositsAmount: totalDeposits[0]?.total || 0,
            totalWithdrawalsAmount: totalWithdrawals[0]?.total || 0,
            pendingDepositsCount: pendingDeposits,
            pendingWithdrawalsCount: pendingWithdrawals,
            totalUserBalance: userBalances[0]?.total || 0
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ================= USER MANAGEMENT =================

// Get All Users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { search, sortBy = 'createdAt', order = 'desc', limit = 100 } = req.query;
        console.log(`[Admin] Fetching users (Search: "${search || ''}", Limit: ${limit})...`);

        const query = { role: { $ne: 'admin' } };
        if (search) {
            query.$or = [
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { invitationCode: { $regex: search, $options: 'i' } }
            ];
        }

        const sortOptions = {};
        sortOptions[sortBy] = order === 'desc' ? -1 : 1;

        const users = await User.find(query)
            .select('-password -transactionPin')
            .sort(sortOptions)
            .limit(parseInt(limit));

        res.json(users);
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update User (Balance, VIP, etc)
router.patch('/user/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { balance, vipLevel, password } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const changes = {};

        if (balance !== undefined && balance !== user.balance) {
            changes.oldBalance = user.balance;
            changes.newBalance = balance;
            user.balance = balance;
        }

        if (vipLevel !== undefined && vipLevel !== user.vipLevel) {
            changes.oldVip = user.vipLevel;
            changes.newVip = vipLevel;
            user.vipLevel = vipLevel;
        }

        if (password) {
            // Ideally password should be hashed here, but relying on model middleware or pre-save if exists
            // For now assuming plain text update is needed or hashing utility is imported
            // Security Note: In production use bcrypt here
            user.password = password;
            changes.passwordChanged = true;
        }

        await user.save();

        if (Object.keys(changes).length > 0) {
            await AdminLog.create({
                adminId: req.userId,
                action: 'user_updated',
                targetUserId: user._id,
                targetResource: { resourceType: 'user', resourceId: user._id },
                changes,
                description: `Updated user ${user.phone}`
            });
        }

        res.json({ message: 'User updated successfully', user });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User Investment History
router.get('/user/:id/investments', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('investments');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.investments);
    } catch (error) {
        console.error('User investments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ================= PACKAGE MANAGEMENT =================

// Get all packages (including active/inactive)
router.get('/packages', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const packages = await Package.find({}).sort({ minAmount: 1 });
        res.json(packages);
    } catch (error) {
        console.error('Admin packages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Package
router.post('/packages', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const newPackage = new Package(req.body);
        await newPackage.save();

        await AdminLog.create({
            adminId: req.userId,
            action: 'package_created',
            targetResource: { resourceType: 'package', resourceId: newPackage._id },
            changes: req.body,
            description: `Created package ${newPackage.name}`
        });

        res.status(201).json(newPackage);
    } catch (error) {
        console.error('Create package error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Package
router.put('/packages/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });

        await AdminLog.create({
            adminId: req.userId,
            action: 'package_updated',
            targetResource: { resourceType: 'package', resourceId: pkg._id },
            changes: req.body,
            description: `Updated package ${pkg.name}`
        });

        res.json(pkg);
    } catch (error) {
        console.error('Update package error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Package
router.delete('/packages/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const pkg = await Package.findByIdAndDelete(req.params.id);

        await AdminLog.create({
            adminId: req.userId,
            action: 'package_deleted',
            description: `Deleted package ${pkg?.name || req.params.id}`
        });

        res.json({ message: 'Package deleted' });
    } catch (error) {
        console.error('Delete package error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ================= SYSTEM SETTINGS =================

// Get Settings
router.get('/settings', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings();
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Settings
router.put('/settings', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        let settings = await SystemSettings.findOne();
        if (!settings) {
            settings = new SystemSettings(req.body);
        } else {
            Object.assign(settings, req.body);
        }
        await settings.save();

        await AdminLog.create({
            adminId: req.userId,
            action: 'settings_updated',
            changes: req.body,
            description: 'Updated system settings'
        });

        res.json(settings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ================= BANNER MANAGEMENT =================

// Get All Banners
router.get('/banners', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ displayOrder: 1 });
        res.json(banners);
    } catch (error) {
        console.error('Admin banners error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Banner
router.post('/banners', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const banner = new Banner(req.body);
        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        console.error('Create banner error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Banner
router.put('/banners/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(banner);
    } catch (error) {
        console.error('Update banner error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Banner
router.delete('/banners/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Banner deleted' });
    } catch (error) {
        console.error('Delete banner error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ================= DEPOSIT MANAGEMENT =================

// Get Deposits (with filter)
router.get('/deposits', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { status } = req.query;
        console.log(`[Admin] Fetching deposits (Status: ${status || 'all'})...`);
        const query = status ? { status } : {};

        const deposits = await Deposit.find(query)
            .populate('userId', 'phone invitationCode fullName')
            .sort({ createdAt: -1 });

        res.json(deposits);
    } catch (error) {
        console.error('Admin deposits error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve Deposit
router.post('/deposit/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
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

        // ADD TO BALANCE ONLY
        const user = await User.findById(deposit.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add to balance
        user.balance += deposit.amount;
        user.isTeamMember = true; // Mark as active team member on first deposit
        console.log(`[Admin] $${deposit.amount} added to balance and marked as team member for user ${user._id}`);

        await AdminLog.create({
            adminId: req.userId,
            action: 'deposit_approved',
            targetUserId: user._id,
            description: `Approved deposit ${deposit.amount} to balance`
        });

        await user.save();

        // Distribute team commissions for the deposit
        try {
            await distributeCommissions(user, deposit.amount);
            console.log(`✅ Commissions distributed for deposit of $${deposit.amount} for user ${user._id}`);
        } catch (commissionError) {
            console.error('Commission distribution error:', commissionError);
            // Don't fail the approval if commission fails
        }

        // Notification: Deposit Approved
        await createNotification({
            userId: user._id,
            title: 'Deposit Approved',
            message: `Your deposit of $${deposit.amount} has been approved and added to your balance.`,
            type: 'deposit',
            amount: deposit.amount,
            relatedId: deposit._id
        });

        res.json({ message: 'Deposit approved and added to wallet balance', deposit });

    } catch (error) {
        console.error('Approve deposit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Reject Deposit
router.post('/deposit/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const depositId = req.params.id;
        const deposit = await Deposit.findById(depositId);

        if (!deposit) {
            return res.status(404).json({ message: 'Deposit not found' });
        }

        if (deposit.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot reject processed deposit' });
        }

        deposit.status = 'rejected';
        await deposit.save();

        // Notification: Deposit Rejected
        await createNotification({
            userId: deposit.userId,
            title: 'Deposit Rejected',
            message: `Your deposit of $${deposit.amount} has been rejected. Please contact support for details.`,
            type: 'deposit',
            amount: deposit.amount,
            relatedId: deposit._id
        });

        await AdminLog.create({
            adminId: req.userId,
            action: 'deposit_rejected',
            targetUserId: deposit.userId,
            description: `Rejected deposit ${deposit.amount}`
        });

        res.json({ message: 'Deposit rejected' });
    } catch (error) {
        console.error('Reject deposit error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
