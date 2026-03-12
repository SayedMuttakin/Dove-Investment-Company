import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    code: {
        type: String,
        required: true
    },
    // The document will automatically be deleted 5 minutes (300 seconds) after creation 
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    }
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
