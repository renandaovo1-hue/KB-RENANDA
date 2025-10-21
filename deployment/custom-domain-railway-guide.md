# 🌐 Custom Domain Setup - Railway + KB RENAN

## 📋 **Overview**
Guide lengkap untuk setup KB RENAN dengan custom domain di Railway, dari domain purchase hingga aplikasi live dengan domain Anda sendiri.

---

## 🎯 **Why Custom Domain?**

### **✅ Benefits:**
- 🏢 **Professional branding** - `kb-renan.com` vs `kb-renan.railway.app`
- 🔒 **SSL certificate** - HTTPS otomatis dan gratis
- 📧 **Custom email** - `admin@kb-renan.com`
- 📊 **Analytics** - Google Analytics, Search Console
- 🚀 **SEO friendly** - Better search ranking
- 💼 **Trust factor** - Lebih trustworthy untuk users

---

## 🛒 **Step 1: Purchase Domain**

### **Recommended Domain Registrars:**
- **Namecheap** - ~$10/year, termurah
- **GoDaddy** - ~$15/year, populer
- **Cloudflare** - ~$10/year, termasuk DNS management
- **Google Domains** - ~$12/year, reliable

### **Domain Suggestions untuk KB RENAN:**
```
kb-renan.com
kbrenan.com
dadukoprok.com
dadu-koprok.com
koprok-online.com
renan-game.com
```

### **Quick Purchase Steps:**
1. Kunjungi registrar (misal: namecheap.com)
2. Search domain yang tersedia
3. Add to cart dan checkout
4. Complete payment (~$10-15/year)
5. Verify email dan domain ownership

---

## 🚂 **Step 2: Deploy ke Railway**

### **2.1 Setup Railway Project**
Jika belum ada:

1. **Buka Railway**: [railway.app](https://railway.app)
2. **New Project** → **"Deploy from GitHub repo"**
3. **Pilih repository** `kb-renan`
4. **Add PostgreSQL database**
5. **Configure environment variables**:
   ```bash
   DATABASE_URL=postgresql://user:pass@host:port/db
   JWT_SECRET=your-super-secret-jwt-key-32-chars
   NEXTAUTH_SECRET=your-nextauth-secret-key-32-chars
   NEXTAUTH_URL=https://your-domain.com
   NODE_ENV=production
   PORT=3000
   ```

6. **Deploy** dan **seed database**:
   ```bash
   railway run npm run db:seed
   ```

### **2.2 Get Railway URL**
Setelah deploy, Railway akan memberikan URL seperti:
```
https://kb-renan-production.up.railway.app
```
**Copy URL ini untuk Step 3.**

---

## 🌐 **Step 3: Setup Custom Domain di Railway**

### **3.1 Add Custom Domain**
1. **Buka Railway Dashboard**
2. **Pilih project KB RENAN**
3. **Settings** → **"Custom Domains"**
4. **Click "Add Custom Domain"**
5. **Masukkan domain Anda** (misal: `kb-renan.com`)
6. **Click "Add Domain"**

### **3.2 Get DNS Records**
Railway akan menampilkan DNS records yang diperlukan:
```
Type: CNAME
Name: @
Value: cname.railway.app

Type: CNAME  
Name: www
Value: cname.railway.app
```

**Copy DNS records ini untuk Step 4.**

---

## 🔧 **Step 4: Configure DNS Settings**

### **4.1 Login ke Domain Registrar**
Login ke tempat Anda beli domain (Namecheap, GoDaddy, dll)

### **4.2 Update DNS Records**

#### **Option A: CNAME Records (Recommended)**
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

#### **Option B: A Records (Alternative)**
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

### **4.3 DNS Propagation**
- **Wait time**: 5 minutes - 48 hours
- **Average**: 30 minutes
- **Check status**: [dnschecker.org](https://dnschecker.org)

---

## 🔒 **Step 5: SSL Certificate Setup**

### **Automatic SSL (Railway)**
Railway akan otomatis:
- 🔍 Detect custom domain
- 📜 Generate SSL certificate (Let's Encrypt)
- 🔒 Install HTTPS certificate
- ✅ Auto-renew certificate

### **Manual SSL Check**
1. **Buka**: `https://your-domain.com`
2. **Check padlock icon** di browser
3. **Verify certificate** (click padlock → Certificate)

---

## ⚙️ **Step 6: Update Environment Variables**

### **6.1 Update NEXTAUTH_URL**
Di Railway dashboard → Variables:
```bash
# Update dari Railway URL ke custom domain
NEXTAUTH_URL=https://your-domain.com
```

### **6.2 Restart Application**
1. **Railway Dashboard** → **Settings**
2. **Click "Restart"**
3. **Wait for redeployment**

---

## 🧪 **Step 7: Test Domain Setup**

### **7.1 Basic Tests**
```bash
# Test domain resolution
ping your-domain.com

# Test HTTPS
curl -I https://your-domain.com

# Test API endpoints
curl https://your-domain.com/api/health
```

### **7.2 Application Tests**
1. **Buka**: `https://your-domain.com`
2. **Test login**: `admin` / `admin123`
3. **Test game features**
4. **Test admin dashboard**
5. **Test mobile responsiveness**

### **7.3 SSL Certificate Test**
1. **Buka**: [sslchecker.com](https://www.sslshopper.com/ssl-checker.html)
2. **Enter domain**: `your-domain.com`
3. **Verify certificate details**

---

## 📊 **Step 8: Analytics & Monitoring**

### **8.1 Google Analytics**
1. **Buka**: [analytics.google.com](https://analytics.google.com)
2. **Create account** → **Add property**
3. **Enter domain**: `your-domain.com`
4. **Get tracking code**
5. **Add to application** (di `src/app/layout.tsx`)

### **8.2 Google Search Console**
1. **Buka**: [search.google.com](https://search.google.com)
2. **Add property** → `your-domain.com`
3. **Verify ownership** (DNS record)
4. **Submit sitemap**: `https://your-domain.com/sitemap.xml`

---

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **Domain Not Resolving**
```bash
# Check DNS propagation
nslookup your-domain.com

# Check WHOIS
whois your-domain.com

# Wait longer (DNS propagation)
```

#### **SSL Certificate Error**
```bash
# Check certificate
openssl s_client -connect your-domain.com:443

# Force HTTPS redirect
# Add to next.config.ts:
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'x-forwarded-proto',
          value: 'https',
        },
      ],
    },
  ]
}
```

#### **Mixed Content Error**
```bash
# Ensure all resources use HTTPS
# Check browser console for mixed content warnings
```

#### **Railway Deployment Issues**
```bash
# Check Railway logs
# Railway → Your Project → Logs

# Check environment variables
# Railway → Your Project → Variables

# Restart deployment
# Railway → Settings → Restart
```

---

## 💰 **Cost Breakdown**

### **Annual Costs:**
- **Domain**: $10-15/year
- **Railway**: $120-300/year ($10-25/month)
- **Total**: **$130-315/year**

### **Monthly Breakdown:**
- **Railway Hosting**: $10-25/month
- **Domain**: ~$1-2/month (annual cost divided)
- **Total**: **$11-27/month**

---

## 🎯 **Success Checklist**

### **Domain Setup:**
- [ ] Domain purchased and verified
- [ ] DNS records configured correctly
- [ ] Custom domain added to Railway
- [ ] SSL certificate installed
- [ ] HTTPS redirect working

### **Application Setup:**
- [ ] Environment variables updated
- [ ] Application deployed successfully
- [ ] All features tested
- [ ] Mobile responsive verified
- [ ] Admin dashboard working

### **Analytics Setup:**
- [ ] Google Analytics configured
- [ ] Search Console setup
- [ ] Sitemap submitted
- [ ] Performance monitoring

---

## 🚀 **Advanced Configuration**

### **Subdomain Setup**
```
api.kb-renan.com → CNAME → cname.railway.app
admin.kb-renan.com → CNAME → cname.railway.app
```

### **Email Setup**
```bash
# Google Workspace
MX records untuk your-domain.com
admin@kb-renan.com
support@kb-renan.com
```

### **CDN Configuration**
```bash
# Cloudflare (optional)
- Add domain to Cloudflare
- Point nameservers to Cloudflare
- Configure caching rules
```

---

## 📞 **Support Resources**

### **Railway Support:**
- **Docs**: [docs.railway.app/domains](https://docs.railway.app/domains)
- **Discord**: [discord.gg/railway](https://discord.gg/railway)

### **Domain Registrar Support:**
- **Namecheap**: [namecheap.com/support](https://www.namecheap.com/support)
- **GoDaddy**: [godaddy.com/help](https://www.godaddy.com/help)

### **SSL Certificate:**
- **Let's Encrypt**: [letsencrypt.org](https://letsencrypt.org)
- **SSL Checker**: [sslshopper.com](https://www.sslshopper.com/ssl-checker.html)

---

## 🎉 **Success!**

### **Expected Results:**
- 🌐 **Live URL**: `https://your-domain.com`
- 🔒 **SSL Certificate**: Automatic HTTPS
- 📊 **Analytics**: Google Analytics & Search Console
- 📧 **Custom Email**: admin@your-domain.com
- 🚀 **Professional Branding**: Domain sendiri

### **Final URL Structure:**
```
Main Site: https://your-domain.com
Admin: https://your-domain.com/admin
API: https://your-domain.com/api/
Health: https://your-domain.com/api/health
```

---

## 🎊 **Congratulations!**

**🌐 KB RENAN sekarang live dengan custom domain Anda sendiri!**

Anda memiliki:
- ✅ Professional web presence
- ✅ SSL certificate (HTTPS)
- ✅ Custom domain branding
- ✅ Analytics & monitoring
- ✅ Scalable infrastructure

**Ready untuk launch dan dapatkan users! 🚀🎲**

---

*KB RENAN - Professional Dadu Koprok Online Game Platform*  
*Powered by Railway + Custom Domain*