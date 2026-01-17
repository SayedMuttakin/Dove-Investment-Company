import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const adminUser = await User.findOne({ $or: [{ phone: 'admin' }, { fullName: 'admin' }] });
        console.log('Admin User:', JSON.stringify(adminUser, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
