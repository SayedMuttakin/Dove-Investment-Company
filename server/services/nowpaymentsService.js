import axios from 'axios';
import crypto from 'crypto';

const API_KEY = process.env.NOWPAYMENTS_API_KEY;
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;
const BASE_URL = process.env.NOWPAYMENTS_API_URL || 'https://api.nowpayments.io/v1';

// Map our network IDs → NowPayments currency codes
const NETWORK_CURRENCY_MAP = {
    TRC20: 'usdttrc20',
    BSC:   'usdtbsc',
    ETH:   'usdterc20',
    BTC:   'btc',
};

/**
 * Create a NowPayments payment order
 */
export const createPayment = async ({ amount, network, orderId, orderDescription }) => {
    const currency = NETWORK_CURRENCY_MAP[network] || 'usdttrc20';

    const payload = {
        price_amount: amount,
        price_currency: 'usd',
        pay_currency: currency,
        order_id: orderId,
        order_description: orderDescription || `Deposit ${amount} USDT`,
        ipn_callback_url: `${process.env.SERVER_URL || 'https://doveinvestment.cloud'}/api/recharge/nowpayments/webhook`,
        is_fixed_rate: false,
        is_fee_paid_by_user: false,
    };

    console.log('[NowPayments] Creating payment:', payload);

    const response = await axios.post(`${BASE_URL}/payment`, payload, {
        headers: {
            'x-api-key': API_KEY,
            'Content-Type': 'application/json',
        },
    });

    console.log('[NowPayments] Payment created:', response.data);
    return response.data;
};

/**
 * Get payment status from NowPayments
 */
export const getPaymentStatus = async (paymentId) => {
    const response = await axios.get(`${BASE_URL}/payment/${paymentId}`, {
        headers: { 'x-api-key': API_KEY },
    });
    return response.data;
};

/**
 * Check API health
 */
export const checkApiStatus = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/status`, {
            headers: { 'x-api-key': API_KEY },
        });
        return res.data?.message === 'OK';
    } catch {
        return false;
    }
};

/**
 * Verify IPN signature — HMAC-SHA512 of sorted JSON body
 */
export const verifyIpnSignature = (body, receivedSig) => {
    try {
        let stringified;
        if (Buffer.isBuffer(body)) {
            const parsed = JSON.parse(body.toString('utf8'));
            stringified = JSON.stringify(sortObjectKeys(parsed));
        } else {
            stringified = JSON.stringify(sortObjectKeys(body));
        }

        const hmac = crypto.createHmac('sha512', IPN_SECRET);
        hmac.update(stringified);
        const computedSig = hmac.digest('hex');

        return computedSig === receivedSig;
    } catch (err) {
        console.error('[NowPayments] Signature error:', err.message);
        return false;
    }
};

/** Recursively sort object keys alphabetically */
function sortObjectKeys(obj) {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return obj;
    return Object.keys(obj).sort().reduce((acc, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
    }, {});
}

/** Statuses that mean payment is fully complete */
export const CONFIRMED_STATUSES = ['finished', 'confirmed', 'complete'];
