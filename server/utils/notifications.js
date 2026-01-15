import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, title, message, type, amount = null, relatedId = null }) => {
    try {
        const notification = new Notification({
            userId,
            title,
            message,
            type,
            amount,
            relatedId
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        // Don't throw error to prevent breaking main transaction
    }
};
