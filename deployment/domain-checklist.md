# 📋 Domain Setup Checklist - KB RENAN

## 🎯 **Quick Setup Checklist**

### **Phase 1: Preparation**
- [ ] **Purchase domain** dari registrar (Namecheap/GoDaddy/Cloudflare)
- [ ] **Deploy KB RENAN** ke Railway
- [ ] **Get Railway URL** (production.up.railway.app)
- [ ] **Verify application working** di Railway URL

### **Phase 2: Domain Configuration**
- [ ] **Add custom domain** di Railway dashboard
- [ ] **Copy DNS records** dari Railway
- [ ] **Login ke domain registrar**
- [ ] **Update DNS records** (CNAME ke cname.railway.app)
- [ ] **Wait DNS propagation** (5 min - 48 jam)

### **Phase 3: SSL & Security**
- [ ] **Verify SSL certificate** otomatis terinstall
- [ ] **Test HTTPS redirect** berfungsi
- [ ] **Check padlock icon** di browser
- [ ] **Update NEXTAUTH_URL** ke custom domain
- [ ] **Restart application** di Railway

### **Phase 4: Testing**
- [ ] **Test main domain**: https://your-domain.com
- [ ] **Test admin login**: admin/admin123
- [ ] **Test game features**
- [ ] **Test mobile responsiveness**
- [ ] **Test API endpoints**

### **Phase 5: Analytics**
- [ ] **Setup Google Analytics**
- [ ] **Setup Google Search Console**
- [ ] **Submit sitemap**
- [ ] **Verify domain ownership**

---

## 🔧 **DNS Records Template**

### **CNAME Records (Recommended)**
```
Type: CNAME
Name: @ (atau kosong)
Value: cname.railway.app
TTL: 1 Hour

Type: CNAME
Name: www
Value: cname.railway.app
TTL: 1 Hour
```

### **A Records (Alternative)**
```
Type: A
Name: @ (atau kosong)
Value: 34.117.59.81
TTL: 1 Hour

Type: A
Name: www
Value: 34.117.59.81
TTL: 1 Hour
```

---

## ⚙️ **Environment Variables**

### **Required Variables**
```bash
DATABASE_URL=postgresql://user:pass@host:port/database
JWT_SECRET=your-super-secret-jwt-key-32-chars
NEXTAUTH_SECRET=your-nextauth-secret-key-32-chars
NEXTAUTH_URL=https://your-domain.com
NODE_ENV=production
PORT=3000
```

---

## 🧪 **Testing Commands**

### **Domain Resolution**
```bash
# Test DNS resolution
ping your-domain.com
nslookup your-domain.com
dig your-domain.com
```

### **SSL Certificate**
```bash
# Test SSL certificate
curl -I https://your-domain.com
openssl s_client -connect your-domain.com:443
```

### **Application Health**
```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Test API
curl https://your-domain.com/api/seed
```

---

## 📊 **Cost Estimation**

### **Annual Costs**
- **Domain Name**: $10-15/year
- **Railway Hosting**: $120-300/year
- **Total**: **$130-315/year**

### **Monthly Breakdown**
- **Railway**: $10-25/month
- **Domain**: ~$1-2/month
- **Total**: **$11-27/month**

---

## 🎯 **Success Indicators**

### **✅ Domain Working**
- Domain resolves ke Railway application
- HTTPS works dengan SSL certificate
- No mixed content warnings
- Fast loading times

### **✅ Application Working**
- Login berfungsi (admin/admin123)
- Game features working
- Admin dashboard accessible
- Mobile responsive

### **✅ Professional Setup**
- Custom email addresses possible
- Analytics tracking installed
- Search engine friendly
- Professional branding

---

## 🚨 **Troubleshooting**

### **Domain Not Working**
1. **Check DNS propagation**: dnschecker.org
2. **Verify DNS records** di registrar
3. **Wait longer** (up to 48 hours)
4. **Contact registrar support**

### **SSL Certificate Issues**
1. **Wait 10-15 minutes** after DNS propagation
2. **Check certificate**: sslshopper.com
3. **Force HTTPS** di application
4. **Restart Railway deployment**

### **Application Issues**
1. **Check Railway logs**
2. **Verify environment variables**
3. **Restart deployment**
4. **Check database connection**

---

## 📞 **Support Contacts**

### **Railway**
- **Docs**: docs.railway.app
- **Discord**: discord.gg/railway
- **Support**: support@railway.app

### **Domain Registrars**
- **Namecheap**: namecheap.com/support
- **GoDaddy**: godaddy.com/help
- **Cloudflare**: cloudflare.com/support

---

## 🎉 **Final Verification**

### **URL Tests**
- [ ] `https://your-domain.com` - Main page loads
- [ ] `https://your-domain.com/admin` - Admin accessible
- [ ] `https://your-domain.com/api/health` - API working
- [ ] `https://www.your-domain.com` - WWW redirect working

### **Functionality Tests**
- [ ] User registration/login
- [ ] Game room creation
- [ ] Dice rolling functionality
- [ ] Transaction processing
- [ ] Mobile compatibility

### **Professional Features**
- [ ] Custom email setup possible
- [ ] Google Analytics tracking
- [ ] Search Console verification
- [ ] SSL certificate valid

---

**🎯 Complete semua checklist untuk domain setup yang sukses!**