import express from 'express';
import Notification from '../models/Notification.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            userId: req.user._id,
            status: 'unread'
        });

        res.json({
            notifications,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark all as read
router.put('/read-all', authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, status: 'unread' },
            { status: 'read' }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mark single as read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { status: 'read' },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete notification
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.json({ message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
