import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedDefaultAccounts = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Helper to create or update account
        const upsertAccount = async (accountData) => {
            const { phone, role, password } = accountData;
            
            // Search by phone/id
            let user = await User.findOne({ phone });

            if (user) {
                console.log(`ℹ️  Account '${phone}' already exists. Updating password...`);
            } else {
                console.log(`👤 Creating account '${phone}'...`);
                user = new User({ phone });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Set/Update fields
            user.password = hashedPassword;
            user.role = role;
            
            if (!user.invitationCode) {
                user.invitationCode = await User.generateInvitationCode();
            }

            if (!user.memberId) {
                const lastUser = await User.findOne({}, 'memberId').sort({ memberId: -1 });
                user.memberId = (lastUser?.memberId || 0) + 1;
            }

            // Reset balance for testing if needed
            user.balance = role === 'admin' ? 0 : 8;
            
            await user.save();
            console.log(`✅ Account '${phone}' ready.`);
            return user;
        };

        // Create Admin
        await upsertAccount({
            phone: 'admin',
            password: 'admin',
            role: 'admin'
        });

        // Create User (with country code prefix as frontend prepends it by default)
        await upsertAccount({
            phone: '+880user',
            password: 'user',
            role: 'user'
        });

        console.log('\n🎉 Default accounts created/updated successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👑 Admin:');
        console.log('   ID: admin');
        console.log('   PW: admin');
        console.log('👤 User:');
        console.log('   ID: user');
        console.log('   PW: user');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding accounts:', error.message);
        process.exit(1);
    }
};

seedDefaultAccounts();
