import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const promoteToAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get phone number from command line
        const phone = process.argv[2];

        if (!phone) {
            console.log('❌ Please provide a phone number');
            console.log('Usage: node server/promote-admin.js <phone>');
            process.exit(1);
        }

        // Find user
        const user = await User.findOne({ phone: phone });

        if (!user) {
            console.log(`❌ User with phone ${phone} not found`);
            process.exit(1);
        }

        // Update role to admin
        user.role = 'admin';
        await user.save();

        console.log('✅ User promoted to admin successfully!');
        console.log('📱 Phone:', user.phone);
        console.log('👤 Role:', user.role);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

promoteToAdmin();
