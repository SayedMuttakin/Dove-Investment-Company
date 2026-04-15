import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No authentication token, access denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.userId;

        // ✅ INSTANT BLOCK CHECK: Verify user is not blocked on every request
        const user = await User.findById(decoded.userId).select('isBlocked role');
        if (!user) {
            return res.status(401).json({ message: 'User not found', code: 'USER_NOT_FOUND' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ 
                message: 'Your account has been blocked. Please contact support.', 
                code: 'ACCOUNT_BLOCKED' 
            });
        }

        req.userRole = user.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
