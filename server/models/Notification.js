import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'investment', 'commission', 'bonus', 'system'],
        default: 'system'
    },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread'
    },
    amount: {
        type: Number,
        default: null
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
