import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    imageUrl: {
        type: String,
        required: true
    },
    linkUrl: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Index for sorting by display order
bannerSchema.index({ displayOrder: 1, isActive: 1 });

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
