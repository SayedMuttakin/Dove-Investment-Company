import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/User.js';

const test = async () => {
    const results = {};
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const collection = mongoose.connection.collection('users');

        results.detailedIndexes = await collection.listIndexes().toArray();

        // Try to register a user with email only
        const email = `test_manual_${Date.now()}@test.com`;
        const count = await User.countDocuments();
        const inv = await User.generateInvitationCode();

        try {
            const user = new User({
                email,
                fullName: 'Manual Test',
                password: 'password',
                invitationCode: inv,
                memberId: count + 1000 // avoid collisions
            });
            await user.save();
            results.success = true;
            results.userId = user._id;
        } catch (regError) {
            results.regError = {
                message: regError.message,
                name: regError.name,
                code: regError.code,
                keyPattern: regError.keyPattern,
                keyValue: regError.keyValue
            };
        }

    } catch (err) {
        results.fatalError = err.message;
    } finally {
        fs.writeFileSync('server/test_reg_error.json', JSON.stringify(results, null, 2));
        await mongoose.connection.close();
        process.exit(0);
    }
};

test();
