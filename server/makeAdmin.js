import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const phone = process.argv[2]; // Get phone from command line arg

        if (!phone) {
            console.error('Please provide a phone number: node makeAdmin.js <phone>');
            process.exit(1);
        }

        const user = await User.findOne({ phone });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();
        console.log(`✅ User ${phone} is now an Admin!`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
