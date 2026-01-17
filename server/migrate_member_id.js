import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const migrateMemberIds = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find all users sorted by creation date
        const users = await User.find({ memberId: { $exists: false } }).sort({ createdAt: 1 });

        console.log(`Found ${users.length} users needing memberId.`);

        const totalUsers = await User.countDocuments();
        let startingId = totalUsers - users.length + 1;

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            user.memberId = startingId + i;
            await user.save();
            console.log(`Assigned memberId ${user.memberId} to user ${user.phone}`);
        }

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateMemberIds();
