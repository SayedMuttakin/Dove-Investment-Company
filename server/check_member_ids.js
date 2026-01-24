import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User from './models/User.js';

const checkMemberIds = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}, 'phone email memberId').sort({ memberId: -1 });

        const results = {
            totalUsers: users.length,
            ids: users.map(u => ({ id: u._id, memberId: u.memberId, identifier: u.phone || u.email }))
        };

        fs.writeFileSync('server/member_ids.json', JSON.stringify(results, null, 2));

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

checkMemberIds();
