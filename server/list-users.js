import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const users = await User.find({}).select('phone role _id').limit(10);

        console.log('\n📋 Users in database:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        users.forEach(user => {
            console.log(`Phone: ${user.phone} | Role: ${user.role || 'user'} | ID: ${user._id}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

listUsers();
