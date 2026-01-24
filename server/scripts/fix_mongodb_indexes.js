import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import User model - adjusting path for scripts directory
import User from '../models/User.js';

dotenv.config({ path: path.join(__dirname, '../.env') });

const fixIndexes = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment variables');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const collection = User.collection;

        console.log('Dropping existing indexes to ensure sparse unique constraints are applied...');
        const indexesToDrop = ['phone_1', 'email_1', 'memberId_1'];

        for (const index of indexesToDrop) {
            try {
                await collection.dropIndex(index);
                console.log(`Successfully dropped index: ${index}`);
            } catch (e) {
                console.log(`Index ${index} not found or already dropped.`);
            }
        }

        console.log('Creating new sparse unique indexes...');
        // Sparse allows multiple documents to have 'undefined' or null for these fields
        // without violating the unique constraint.
        await collection.createIndex({ phone: 1 }, { unique: true, sparse: true });
        console.log('Created sparse unique index for: phone');

        await collection.createIndex({ email: 1 }, { unique: true, sparse: true });
        console.log('Created sparse unique index for: email');

        await collection.createIndex({ memberId: 1 }, { unique: true, sparse: true });
        console.log('Created sparse unique index for: memberId');

        console.log('\nAll indexes fixed successfully! Email registration is now supported alongside Phone registration.');

    } catch (error) {
        console.error('CRITICAL: Error fixing indexes:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

fixIndexes();
