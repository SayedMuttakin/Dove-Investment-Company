import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    minAmount: {
        type: Number,
        required: true
    },
    maxAmount: {
        type: Number,
        required: true
    },
    dailyRate: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        default: 'from-blue-500 to-cyan-400'
    },
    bg: {
        type: String,
        default: 'bg-blue-500/10'
    },
    border: {
        type: String,
        default: 'border-blue-500/20'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    vipLevel: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Package = mongoose.model('Package', packageSchema);

export default Package;
