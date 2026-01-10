import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionHash: {
        type: String,
        required: true,
        unique: true
    },
    network: {
        type: String,
        required: true
    },
    packageId: {
        type: String,
        default: null
    },
    packageName: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Deposit = mongoose.model('Deposit', depositSchema);

export default Deposit;
