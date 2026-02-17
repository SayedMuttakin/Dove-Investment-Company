# NovaEarn Email Service Setup Guide

## 📧 Email Service is Now Ready!

আপনার NovaEarn প্রজেক্টে এখন সুন্দর ইমেইল সিস্টেম যুক্ত হয়েছে। এই গাইড ফলো করে VPS এ সেটআপ করুন।

## ✨ Features Implemented

✅ **Beautiful HTML Email Templates** with:
- NovaEarn branding (Purple gradient design)
- Company logo text
- Professional card layouts
- Amount highlighting
- Transaction details
- Status badges

✅ **Email Notifications for**:
1. **Withdrawal Request** - User withdraws
2. **Withdrawal Approved** - Admin approves
3. **Deposit Approved** - Admin approves deposit

## 🚀 VPS Deployment Steps

### Step 1: Deploy Code to Server

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Navigate to project
cd /var/www/novaearn

# Pull latest code
git pull origin master

# Backend updates
cd server
npm install
```

### Step 2: Configure SMTP (Email Settings)

VPS এর `.env` ফাইলে এই settings যোগ করুন:

```bash
nano /var/www/novaearn/server/.env
```

**Gmail ব্যবহার করলে:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-app-password
```

**Brevo (Sendinblue) ব্যবহার করলে:**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-email
SMTP_PASSWORD=your-brevo-smtp-key
```

### Step 3: Gmail App Password তৈরি

যদি Gmail ব্যবহার করতে চান:

1. যান: https://myaccount.google.com/apppasswords
2. 2-Factor Authentication চালু করুন (যদি না থাকে)
3. "App passwords" এ ক্লিক করুন
4. "Select app" → "Mail" চয়ন করুন
5. "Select device" → "Other" (নাম দিন "NovaEarn")
6. Generate করুন
7. 16-digit password কপি করুন
8. এটা `.env` এর `SMTP_PASSWORD` তে পেস্ট করুন

### Step 4: Restart Application

```bash
# Restart PM2
pm2 restart all

# Check logs
pm2 logs
```

## 🎨 Email Template Preview

### Withdrawal Request Email
- **Subject:** 🔔 Withdrawal Request Received - NovaEarn
- **Shows:** Amount, Fee (5%), Total Deducted, Payment Method, Status Badge

### Withdrawal Approved Email
- **Subject:** ✅ Withdrawal Approved - NovaEarn
- **Shows:** Amount, Transaction ID, Payment Method, Processed Date

### Deposit Approved Email
- **Subject:** ✅ Deposit Confirmed - NovaEarn
- **Shows:** Amount, New Balance, Transaction ID, Date

## 📝 Important Notes

1. **User Email Required**: Emails শুধুমাত্র তাদের কাছে যাবে যাদের `email` field আছে User model এ।

2. **Test First**: প্রথমে একটা test withdrawal/deposit করে দেখুন email আসছে কিনা।

3. **Gmail Daily Limit**: Gmail দিয়ে দিনে সর্বোচ্চ 500 emails পাঠাতে পারবেন।

4. **Professional Solution**: বেশি user এর জন্য Brevo ব্যবহার করুন (Free: 300/day)।

## 🔍 Troubleshooting

**Email না গেলে:**
```bash
# Check PM2 logs
pm2 logs

# Look for email errors
# If you see "SMTP not configured" - check .env file
```

**Spam folder এ গেলে:**
- Domain verification করুন (SPF, DKIM records add করুন)
- Brevo/SendGrid ব্যবহার করুন better deliverability এর জন্য

## 🎯 Next Steps (Optional)

1. **Custom Domain Email**: `noreply@doveinvestment.cloud` setup করুন
2. **Email Analytics**: Brevo dashboard এ tracking দেখুন
3. **More Templates**: Welcome email, daily earnings summary ইত্যাদি যুক্ত করুন
