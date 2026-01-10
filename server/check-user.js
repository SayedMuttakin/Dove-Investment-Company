import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkStatus = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const phone = '+1123456789'; // The user reported
        const user = await User.findOne({ phone: phone });

        if (!user) {
            console.log(`❌ User ${phone} not found!`);
            // List all users to see if phone format mismatch
            const users = await User.find({}).select('phone balance totalEarnings');
            console.log('\nAvailable Users:');
            users.forEach(u => console.log(`- ${u.phone}: Balance ${u.balance}`));
            process.exit(0);
        }

        console.log('\nUser Details:');
        console.log(`Phone: ${user.phone}`);
        console.log(`ID: ${user._id}`);
        console.log(`Balance: ${user.balance}`);
        console.log(`Total Earnings: ${user.totalEarnings}`);
        console.log(`Role: ${user.role}`);

        console.log('\nInvestments:');
        if (user.investments && user.investments.length > 0) {
            user.investments.forEach((inv, i) => {
                console.log(`${i + 1}. Package: ${inv.package.name} | Status: ${inv.status} | Amount: ${inv.package.investmentAmount}`);
            });
        } else {
            console.log('No investments found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkStatus();
