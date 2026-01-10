import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createDefaultAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ phone: 'admin' });

        if (existingAdmin) {
            console.log('ℹ️  Default admin already exists');
            console.log('📱 Phone: admin');
            console.log('🔑 Password: admin123');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Generate invitation code
        const invitationCode = await User.generateInvitationCode();

        // Create admin user
        const admin = new User({
            phone: 'admin',
            password: hashedPassword,
            invitationCode: invitationCode,
            role: 'admin',
            balance: 0,
            totalEarnings: 0,
            interestIncome: 0,
            teamIncome: 0,
            bonusIncome: 0,
            vipLevel: 0
        });

        await admin.save();

        console.log('\n🎉 Default admin account created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📱 Phone: admin');
        console.log('🔑 Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Please login at: http://localhost:3000/admin/login');
        console.log('⚠️  Change the password after first login!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createDefaultAdmin();
