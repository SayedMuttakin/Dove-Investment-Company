# 📧 Gmail দিয়ে Email Setup (সবচেয়ে সহজ)

## Goal: Gmail থেকে email পাঠাবেন (কোনো domain verification লাগবে না)

---

## ✅ Step 1: Gmail App Password তৈরি করুন (5 মিনিট)

### 1. Google Account এ 2-Step Verification চালু করুন:
1. যান: https://myaccount.google.com/security
2. **"2-Step Verification"** খুঁজুন
3. যদি বন্ধ থাকে, **"Get started"** ক্লিক করুন
4. আপনার phone number দিন verification এর জন্য
5. Complete করুন

### 2. App Password তৈরি করুন:
1. যান: https://myaccount.google.com/apppasswords
2. লগইন করুন যদি চায়
3. **"Select app"** → **"Mail"** select করুন
4. **"Select device"** → **"Other (Custom name)"** select করুন
5. লিখুন: `NovaEarn Server`
6. **"Generate"** button এ click করুন

### 3. Password Copy করুন:
- একটা **16 digit password** দেখাবে (যেমন: `abcd efgh ijkl mnop`)
- এটা কোথাও save করে রাখুন (এখনি কাজে লাগবে)

---

## ✅ Step 2: VPS এ Setup করুন (3 মিনিট)

### SSH করুন আপনার VPS এ:
```bash
ssh root@your-vps-ip
```

### .env File Edit করুন:
```bash
cd /var/www/novaearn/server
nano .env
```

### এই lines যোগ/update করুন:
```env
# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=NovaEarn
```

**Replace করুন:**
- `your-email@gmail.com` → আপনার Gmail address (2 জায়গায়)
- `abcd efgh ijkl mnop` → Step 1 এ পাওয়া 16 digit password (spaces থাকবে)

**Save করুন:**
- Press: `Ctrl + O` (Save)
- Press: `Enter` (Confirm)
- Press: `Ctrl + X` (Exit)

---

## ✅ Step 3: Code Deploy করুন (3 মিনিট)

### Local Machine থেকে Git Push করুন:
```bash
cd C:\Users\User\Desktop\NovaEarn
git add .
git commit -m "Email service setup"
git push origin master
```

### VPS এ Pull + Restart করুন:
```bash
cd /var/www/novaearn
git pull origin master

cd server
npm install

pm2 restart all
```

---

## ✅ Step 4: Test করুন (2 মিনিট)

### Test করার জন্য:
1. Website এ login করুন: https://doveinvestment.cloud
2. একটা ছোট withdrawal request করুন (test)
3. **আপনার email inbox check করুন**
4. Email এসেছে কিনা দেখুন!

---

## ✅ Step 5: Verify করুন (1 মিনিট)

### PM2 Logs দেখুন:
```bash
pm2 logs
```

যদি email সফল হয়, দেখবেন:
```
✅ Email sent successfully: <message-id>
```

যদি error থাকে, দেখবেন error message।

---

## 🎯 Summary - মাত্র 3টা কাজ:

1. ✅ Gmail App Password বানান
2. ✅ VPS .env file এ Gmail credentials দিন
3. ✅ Code deploy করুন (git pull + pm2 restart)

**ব্যাস হয়ে গেলো!** কোনো domain verification লাগবে না।

---

## ⚠️ Important Notes:

### সুবিধা:
✅ খুবই সহজ setup (5 মিনিট)  
✅ কোনো domain verification লাগবে না  
✅ কোনো DNS records add করতে হবে না  
✅ Immediately কাজ করবে  

### সীমাবদ্ধতা:
⚠️ দিনে সর্বোচ্চ 500 emails পাঠাতে পারবেন  
⚠️ Email "from" address হবে: `your-email@gmail.com`  
⚠️ Custom domain email (`noreply@doveinvestment.cloud`) না  

### পরবর্তীতে আপগ্রেড:
যখন আপনার বেশি user হবে এবং custom domain email চাইবেন, তখন Brevo setup করতে পারবেন। কিন্তু **এখনকার জন্য Gmail perfect!**

---

## 🚨 Troubleshooting:

### Problem 1: App Password option দেখা যাচ্ছে না
**Solution:**  
- প্রথমে 2-Step Verification চালু করুন
- তারপর আবার App Passwords page এ যান

### Problem 2: Email যাচ্ছে না
**Solution:**  
- PM2 logs check করুন: `pm2 logs`
- Gmail credentials ঠিক আছে কিনা verify করুন
- Password এ spaces আছে কিনা check করুন

### Problem 3: "Less secure app" error
**Solution:**  
- App Password ব্যবহার করলে এই error আসবে না
- Regular password দিলে এই error আসতে পারে
- App Password generate করুন

---

## 📞 কোনো সমস্যা?

বলুন:
1. কোন step এ আটকে গেছেন?
2. কি error দেখাচ্ছে?
3. Screenshot পাঠাতে পারেন (যদি দরকার হয়)
