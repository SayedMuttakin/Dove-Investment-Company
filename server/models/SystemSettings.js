import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema({
    // Company Information
    companyName: {
        type: String,
        default: 'Dove Investment Gold Mine Growth'
    },
    companyDescription: {
        type: String,
        default: 'Your trusted partner in financial growth. We provide secure and profitable investment solutions with transparency and excellence.'
    },
    companyEmail: {
        type: String,
        default: 'info@doveinvest.com'
    },
    companyPhone: {
        type: String,
        default: '+880-1XXX-XXXXXX'
    },
    companyAddress: {
        type: String,
        default: 'Dhaka, Bangladesh'
    },

    // Platform Settings
    minWithdrawalAmount: {
        type: Number,
        default: 100
    },
    maxWithdrawalAmount: {
        type: Number,
        default: 100000
    },
    withdrawalFeePercentage: {
        type: Number,
        default: 0
    },
    minDepositAmount: {
        type: Number,
        default: 50
    },

    // Wallet Addresses
    walletTRC20: {
        type: String,
        default: 'TWTLHHvdcPT9RKHxUavSVujcZXgFgYjbDP'
    },
    walletBTC: {
        type: String,
        default: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    },
    walletETH: {
        type: String,
        default: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
    },
    walletBSC: {
        type: String,
        default: '0x28C6c06298d514Db089934071355E5743bf21d60'
    },
    appDownloadUrl: {
        type: String,
        default: '#'
    },

    // Platform Statistics (Updated by system)
    totalUsersCount: {
        type: Number,
        default: 0
    },
    totalInvestmentsAmount: {
        type: Number,
        default: 0
    },
    totalEarningsDistributed: {
        type: Number,
        default: 0
    },

    // Feature Toggles
    registrationEnabled: {
        type: Boolean,
        default: true
    },
    withdrawalEnabled: {
        type: Boolean,
        default: true
    },
    depositEnabled: {
        type: Boolean,
        default: true
    },
    investmentEnabled: {
        type: Boolean,
        default: true
    },

    // Maintenance
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    maintenanceMessage: {
        type: String,
        default: 'System is under maintenance. Please check back later.'
    }
}, {
    timestamps: true
});

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;
