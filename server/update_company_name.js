import dotenv from 'dotenv';
import mongoose from 'mongoose';
import SystemSettings from './models/SystemSettings.js';

dotenv.config();

const updateCompanyName = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const result = await SystemSettings.updateMany(
            {},
            { $set: { companyName: 'Dove Investment Gold Mine' } }
        );

        console.log(`✅ Updated ${result.modifiedCount} document(s). Company name is now "Dove Investment Gold Mine"`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateCompanyName();
