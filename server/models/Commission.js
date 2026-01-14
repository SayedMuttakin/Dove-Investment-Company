import mongoose from 'mongoose';

const commissionSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    },
    investmentAmount: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    vipLevel: {
        type: Number,
        required: true
    },
    claimed: {
        type: Boolean,
        default: false
    },
    claimedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Commission = mongoose.model('Commission', commissionSchema);

export default Commission;
