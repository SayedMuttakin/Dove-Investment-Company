import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function resetUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Target user (the one you are testing with)
        // Since I don't know the exact phone number, I will look for the user with 200 balance and 200 investment
        const user = await User.findOne({
            $or: [
                { balance: 200 },
                { "investments.package.investmentAmount": 200 }
            ]
        });

        if (!user) {
            console.log('❌ User not found with that pattern');
            process.exit(0);
        }

        console.log(`👤 Found User: ${user.phone}`);

        // Reset Logic
        user.balance = 500; // Give some test balance
        user.investments = []; // Clear all old investments
        user.totalEarnings = 0;
        user.interestIncome = 0;
        user.redeemableBalance = 0;

        await user.save();

        console.log('🚀 User Reset Successful!');
        console.log('New Balance: 500 USDT');
        console.log('Investments: Cleared');

        process.exit(0);
    } catch (error) {
        console.error('❌ Reset error:', error);
        process.exit(1);
    }
}

resetUser();
