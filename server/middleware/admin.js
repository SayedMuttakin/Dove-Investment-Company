import User from '../models/User.js';

export const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            console.log(`[AdminMiddleware] Access denied for user ${user.phone}. Role: ${user.role}`);
            return res.status(403).json({ message: 'Access denied. Admin rights required.' });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
