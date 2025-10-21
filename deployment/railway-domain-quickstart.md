# 🚀 Railway + Custom Domain - Quick Start

## 🎯 **5 Minutes to Professional Domain**

### **Prerequisites:**
- ✅ KB RENAN deployed di Railway
- ✅ Domain sudah dibeli (Namecheap/GoDaddy/Cloudflare)
- ✅ Railway project sudah running

---

## ⚡ **Super Quick Setup**

### **Step 1: Add Domain di Railway (1 menit)**
1. **Railway Dashboard** → **Settings** → **"Custom Domains"**
2. **"Add Custom Domain"**
3. **Masukkan domain**: `your-domain.com`
4. **Click "Add Domain"**

### **Step 2: Copy DNS Records (30 detik)**
Railway akan menampilkan:
```
Type: CNAME
Name: @
Value: cname.railway.app

Type: CNAME
Name: www  
Value: cname.railway.app
```

### **Step 3: Update DNS di Domain Registrar (2 menit)**
1. **Login** ke tempat beli domain
2. **DNS Management** → **Add Records**
3. **Copy DNS records** dari Railway
4. **Save changes**

### **Step 4: Wait & Test (2 menit)**
1. **Wait 5-30 minutes** untuk DNS propagation
2. **Test**: Buka `https://your-domain.com`
3. **Verify**: Padlock icon HTTPS muncul

---

## 🔧 **Environment Variables Update**

### **Update NEXTAUTH_URL**
Di Railway → Variables:
```bash
# Ganti dari Railway URL ke custom domain
NEXTAUTH_URL=https://your-domain.com
```

### **Restart Application**
Railway → Settings → **"Restart"**

---

## 🧪 **Quick Tests**

### **Basic Tests**
```bash
# Test domain
ping your-domain.com

# Test HTTPS
curl -I https://your-domain.com

# Test application
curl https://your-domain.com/api/health
```

### **Browser Tests**
1. **Buka**: `https://your-domain.com`
2. **Login**: `admin` / `admin123`
3. **Test**: Game features
4. **Check**: Mobile responsive

---

## 📊 **Expected Results**

### **After 5-30 Minutes:**
- 🌐 **Live URL**: `https://your-domain.com`
- 🔒 **SSL Certificate**: Otomatis terinstall
- 📱 **Mobile Friendly**: Responsive design
- 🎮 **Full Functionality**: Semua fitur bekerja

### **Professional Features:**
- ✅ Custom branding
- ✅ HTTPS security
- ✅ Fast loading
- ✅ Analytics ready

---

## 💰 **Cost Summary**

### **Monthly Costs:**
- **Railway**: $10-25/month
- **Domain**: ~$1-2/month
- **Total**: **$11-27/month**

### **Annual Costs:**
- **Total**: **$130-315/year**

---

## 🎯 **Success Checklist**

- [ ] Domain added ke Railway
- [ ] DNS records configured
- [ ] HTTPS working
- [ ] Application functional
- [ ] Mobile responsive
- [ ] Admin accessible

---

## 🚨 **Quick Troubleshooting**

### **Domain Not Working?**
1. **Wait longer** (DNS propagation 5 min - 48 jam)
2. **Check DNS records** di registrar
3. **Verify CNAME points to**: `cname.railway.app`

### **SSL Not Working?**
1. **Wait 10-15 minutes** setelah domain active
2. **Force refresh browser** (Ctrl+F5)
3. **Check certificate**: Click padlock icon

### **Application Not Working?**
1. **Check Railway logs**
2. **Verify environment variables**
3. **Restart deployment**

---

## 🎉 **Congratulations!**

**🌐 KB RENAN sekarang live dengan custom domain!**

### **What You Have:**
- ✅ Professional web presence
- ✅ SSL certificate (HTTPS)
- ✅ Custom domain branding
- ✅ Fast, reliable hosting
- ✅ Mobile-friendly application

### **Next Steps:**
1. **Setup Google Analytics**
2. **Configure custom email**
3. **Submit to search engines**
4. **Start marketing!**

---

**🚀 Ready untuk launch dengan domain profesional!**