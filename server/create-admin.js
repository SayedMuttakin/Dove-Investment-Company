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
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('ℹ️  Admin account already exists:', existingAdmin.phone);
            console.log('📧 Phone:', existingAdmin.phone);
            process.exit(0);
        }

        // Create default admin
        const adminPhone = 'admin';
        const adminPassword = 'admin123';

        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const invitationCode = await User.generateInvitationCode();

        const admin = new User({
            phone: adminPhone,
            password: hashedPassword,
            invitationCode: invitationCode,
            role: 'admin',
            balance: 0,
            vipLevel: 0
        });

        await admin.save();

        console.log('🎉 Default admin account created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📱 Phone: admin');
        console.log('🔐 Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createDefaultAdmin();
