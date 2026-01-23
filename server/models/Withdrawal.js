import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    fee: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    bankDetails: {
        accountName: {
            type: String,
            required: true
        },
        accountNumber: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            required: true
        },
        branchName: {
            type: String,
            default: null
        }
    },
    paymentMethod: {
        type: String,
        enum: ['bank', 'bkash', 'nagad', 'rocket', 'trc20', 'btc', 'eth', 'bsc'],
        default: 'bank'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'processing'],
        default: 'pending'
    },
    transactionId: {
        type: String,
        default: null
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    processedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    },
    adminNote: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Index for faster queries
withdrawalSchema.index({ userId: 1, status: 1 });
withdrawalSchema.index({ createdAt: -1 });

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export default Withdrawal;
