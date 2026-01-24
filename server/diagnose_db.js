import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/User.js';

const diagnose = async () => {
    const results = {
        connected: false,
        indexes: null,
        userCount: 0,
        users: [],
        collisions: []
    };

    try {
        if (!process.env.MONGODB_URI) {
            results.error = 'MONGODB_URI is not defined in .env';
            fs.writeFileSync('server/diagnose_debug.json', JSON.stringify(results, null, 2));
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        results.connected = true;

        const collection = mongoose.connection.collection('users');
        results.indexes = await collection.getIndexes();

        const users = await User.find({}, 'phone email fullName role memberId');
        results.userCount = users.length;

        users.forEach(u => {
            results.users.push({
                id: u._id,
                phone: u.phone,
                email: u.email,
                name: u.fullName
            });
        });

        const phoneMap = {};
        const emailMap = {};

        users.forEach(u => {
            if (u.phone) {
                if (phoneMap[u.phone]) results.collisions.push(`PH: ${u.phone} between ${phoneMap[u.phone]} and ${u._id}`);
                phoneMap[u.phone] = u._id;
            }
            if (u.email) {
                if (emailMap[u.email]) results.collisions.push(`EM: ${u.email} between ${emailMap[u.email]} and ${u._id}`);
                emailMap[u.email] = u._id;
            }
        });

    } catch (error) {
        results.error = error.message;
        results.stack = error.stack;
    } finally {
        fs.writeFileSync('server/diagnose_debug.json', JSON.stringify(results, null, 2));
        await mongoose.connection.close();
        process.exit(0);
    }
};

diagnose();
