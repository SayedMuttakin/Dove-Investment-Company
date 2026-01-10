import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'phone role vipLevel');
        console.log('Registered Phones:');
        users.forEach(u => console.log(`- ${u.phone} (Role: ${u.role}, VIP: ${u.vipLevel})`));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

listUsers();
