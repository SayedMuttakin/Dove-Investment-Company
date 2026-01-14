import User from '../models/User.js';
import Commission from '../models/Commission.js';

// Commission rates by VIP level [1st, 2nd, 3rd]
const COMMISSION_RATES = {
    0: [0.09, 0.06, 0.03],
    1: [0.10, 0.07, 0.04],
    2: [0.11, 0.08, 0.05],
    3: [0.12, 0.09, 0.06],
    4: [0.13, 0.10, 0.07],
    5: [0.14, 0.11, 0.08]
};

/**
 * Get upline users (referrers) up to specified levels
 * @param {String} invitationCode - Starting user's invitation code
 * @param {Number} levels - How many levels to go up (default 3)
 * @returns {Array} Array of upline users with their level
 */
export async function getUplineUsers(invitationCode, levels = 3) {
    const upline = [];
    let currentCode = invitationCode;

    for (let level = 1; level <= levels; level++) {
        const user = await User.findOne({ invitationCode: currentCode });
        if (!user || !user.referredBy) break;

        const referrer = await User.findOne({ invitationCode: user.referredBy });
        if (!referrer) break;

        upline.push({
            user: referrer,
            level: level
        });

        currentCode = referrer.invitationCode;
    }

    return upline;
}

/**
 * Calculate commission amount based on VIP level and investment
 * @param {Number} vipLevel - VIP level of the receiver
 * @param {Number} teamLevel - Level (1, 2, or 3)
 * @param {Number} investmentAmount - Investment amount
 * @returns {Number} Commission amount
 */
export function calculateCommission(vipLevel, teamLevel, investmentAmount) {
    const rates = COMMISSION_RATES[vipLevel] || COMMISSION_RATES[0];
    const rate = rates[teamLevel - 1] || 0;
    return investmentAmount * rate;
}

/**
 * Distribute commissions to upline users
 * @param {Object} investor - User who made the investment
 * @param {Number} investmentAmount - Investment amount
 * @returns {Array} Array of commission records
 */
export async function distributeCommissions(investor, investmentAmount) {
    const commissions = [];

    // Get upline users (up to 3 levels)
    const upline = await getUplineUsers(investor.invitationCode, 3);

    for (const { user: referrer, level } of upline) {
        // Calculate commission based on referrer's VIP level
        const commissionAmount = calculateCommission(
            referrer.vipLevel,
            level,
            investmentAmount
        );

        if (commissionAmount > 0) {
            // Add commission to referrer's balance and teamEarnings
            referrer.balance += commissionAmount;
            referrer.teamEarnings = (referrer.teamEarnings || 0) + commissionAmount;
            referrer.teamIncome = (referrer.teamIncome || 0) + commissionAmount;
            await referrer.save();

            // Create commission record
            const commissionRecord = await Commission.create({
                fromUser: investor._id,
                toUser: referrer._id,
                amount: commissionAmount,
                level: level,
                investmentAmount: investmentAmount,
                percentage: COMMISSION_RATES[referrer.vipLevel][level - 1] * 100,
                vipLevel: referrer.vipLevel
            });

            commissions.push(commissionRecord);
        }
    }

    return commissions;
}
