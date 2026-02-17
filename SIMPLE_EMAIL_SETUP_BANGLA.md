# 📧 Email Setup - সহজ বাংলা গাইড

## Goal: `noreply@doveinvestment.cloud` থেকে email পাঠাবেন যা **Inbox এ যাবে**

---

## ✅ Step 1: Brevo Account তৈরি করুন (5 মিনিট)

1. এই লিংকে যান: https://app.brevo.com/account/register
2. Sign up করুন (আপনার Gmail দিয়ে)
3. Email verify করুন যা আপনার inbox এ আসবে
4. Login করুন

---

## ✅ Step 2: Domain Verify করুন (10 মিনিট)

### Brevo তে:
1. Login করার পর **Settings** → **Senders & IP** এ যান
2. **"Domains"** tab এ ক্লিক করুন
3. **"Add a domain"** button এ ক্লিক করুন
4. লিখুন: `doveinvestment.cloud`
5. Submit করুন

### Brevo আপনাকে দেখাবে কিছু DNS Records:

**Example:**
```
Record Type: TXT
Host: @
Value: brevo-code-abc123xyz456...

Record Type: TXT  
Host: mail._domainkey
Value: k=rsa; p=MIGfMA0GCS...

Record Type: TXT
Host: _dmarc
Value: v=DMARC1; p=none;...
```

### এই DNS Records আপনার Domain Provider এ যোগ করতে হবে:

**আপনার domain কোথায় কিনেছেন?** (Namecheap / GoDaddy / Hostinger / অন্য কোথাও?)

#### Hostinger Domain হলে:
1. https://hpanel.hostinger.com এ login করুন
2. **Domains** → `doveinvestment.cloud` select করুন
3. **DNS / Name Servers** → **DNS Records** এ যান
4. Brevo থেকে পাওয়া প্রতিটা record **"Add Record"** দিয়ে যোগ করুন:
   - Type: TXT
   - Name: @ (বা যা Brevo বলবে)
   - Value: Brevo থেকে copy করা value paste করুন
   - TTL: 14400 (default রাখুন)

#### অন্য provider হলে:
- তাদের DNS management section এ যান
- TXT records যোগ করুন same way তে

### Verification:
- DNS records add করার 10-30 মিনিট পর Brevo তে ফিরে যান
- **"Check DNS records"** বা **"Verify domain"** button এ click করুন
- ✅ Green checkmark দেখাবে যখন verify হবে

---

## ✅ Step 3: SMTP Credentials নিন (2 মিনিট)

1. Brevo তে **Settings** → **SMTP & API** যান
2. নিচের তথ্য copy করুন:
   ```
   SMTP Server: smtp-relay.brevo.com
   Port: 587
   Login: your-email@gmail.com (যা দিয়ে sign up করেছেন)
   SMTP Key: xsmtpsib-abc123... (Show করুন)
   ```

---

## ✅ Step 4: Sender Email তৈরি করুন (1 মিনিট)

1. Brevo তে **Settings** → **Senders & IP** → **Senders** tab
2. **"Add a sender"** ক্লিক করুন
3. Fill করুন:
   - **From Email:** `noreply@doveinvestment.cloud`
   - **From Name:** `NovaEarn`
4. Save করুন

---

## ✅ Step 5: VPS এ Code Update করুন (5 মিনিট)

### SSH করুন VPS এ:
```bash
ssh root@your-vps-ip
```

### .env File Edit করুন:
```bash
cd /var/www/novaearn/server
nano .env
```

### এই lines যোগ করুন/update করুন:
```env
# Email Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xsmtpsib-your-smtp-key-here
SMTP_FROM_EMAIL=noreply@doveinvestment.cloud
SMTP_FROM_NAME=NovaEarn
```

**Replace করবেন:**
- `your-email@gmail.com` → আপনার Brevo login email
- `xsmtpsib-your-smtp-key-here` → Step 3 এ পাওয়া SMTP key

**Save করুন:** `Ctrl+O` → Enter → `Ctrl+X`

---

## ✅ Step 6: Code Update করুন (Local Machine এ)

আমি এই code টা update করে দিচ্ছি এখনি।

---

## ✅ Step 7: Deploy করুন VPS এ (3 মিনিট)

### Local machine থেকে Git Push:
```bash
cd C:\Users\User\Desktop\NovaEarn
git add .
git commit -m "Updated email service for custom domain"
git push origin master
```

### VPS এ Pull করুন:
```bash
cd /var/www/novaearn
git pull origin master

cd server
npm install

pm2 restart all
```

---

## ✅ Step 8: Test করুন (2 মিনিট)

1. Website এ যান: https://doveinvestment.cloud
2. একটা test withdrawal request করুন (ছোট amount)
3. **আপনার email inbox check করুন**
4. Email এসেছে কিনা দেখুন **from: noreply@doveinvestment.cloud**

---

## 🎯 Summary চেকলিস্ট:

- [ ] Brevo account তৈরি করা হয়েছে
- [ ] Domain verify করা হয়েছে (DNS records added)
- [ ] SMTP credentials নেয়া হয়েছে
- [ ] Sender email (`noreply@doveinvestment.cloud`) add করা হয়েছে
- [ ] VPS .env file update করা হয়েছে
- [ ] Code deploy করা হয়েছে
- [ ] PM2 restart করা হয়েছে
- [ ] Test email পাঠানো হয়েছে ✅

---

## 🚨 Common Problems & Solutions:

### Problem 1: DNS records verify হচ্ছে না
**Solution:** 
- 30 মিনিট wait করুন (DNS propagation time)
- Records ঠিকমতো copy/paste হয়েছে কিনা check করুন
- `@` symbol বা trailing dots remove করুন

### Problem 2: Email যাচ্ছে না
**Solution:**
- PM2 logs check করুন: `pm2 logs`
- .env file এ SMTP credentials ঠিক আছে কিনা check করুন
- Brevo dashboard এ email sending stats দেখুন

### Problem 3: Email Spam folder এ যাচ্ছে
**Solution:**
- প্রথম কিছু email spam এ যেতে পারে
- User দের বলুন "Not Spam" mark করতে
- DNS verification সঠিকভাবে হয়েছে কিনা ensure করুন

---

## 📞 Support:

কোনো সমস্যা হলে আমাকে বলুন:
1. কোন step এ আটকে গেছেন
2. কি error দেখাচ্ছে
3. Screenshot পাঠান (যদি দরকার হয়)
