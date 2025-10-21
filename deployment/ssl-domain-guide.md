# SSL & Domain Configuration Guide

## Domain Setup

### 1. Point Domain to Server

#### A. A Record (Recommended)
```
Type: A
Name: @ (or your-domain.com)
Value: YOUR_SERVER_IP
TTL: 3600 (or default)
```

#### B. WWW Subdomain
```
Type: A
Name: www
Value: YOUR_SERVER_IP
TTL: 3600 (or default)
```

#### C. CNAME (Alternative untuk WWW)
```
Type: CNAME
Name: www
Value: your-domain.com
TTL: 3600
```

### 2. DNS Propagation
```bash
# Check DNS propagation
dig your-domain.com
nslookup your-domain.com
# Atau gunakan: whatsmydns.net
```

## SSL Setup Options

### 1. Let's Encrypt (Free & Recommended)

#### Install Certbot
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx
```

#### Get SSL Certificate
```bash
# Single domain
sudo certbot --nginx -d your-domain.com

# Multiple domains
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Non-interactive
sudo certbot --nginx -d your-domain.com -d www.your-domain.com --non-interactive --agree-tos --email admin@your-domain.com
```

#### Auto-renewal Setup
```bash
# Test renewal
sudo certbot renew --dry-run

# Setup cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 2. Cloudflare SSL (Easy Setup)

#### Setup Cloudflare
1. Sign up di cloudflare.com
2. Add your domain
3. Update nameservers ke Cloudflare
4. Enable SSL/TLS → Full (Strict)

#### Nginx Configuration untuk Cloudflare
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Cloudflare IP ranges
    set_real_ip_from 103.21.244.0/22;
    set_real_ip_from 103.22.200.0/22;
    set_real_ip_from 103.31.4.0/22;
    # ... (tambah semua Cloudflare IP ranges)
    real_ip_header CF-Connecting-IP;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}
```

### 3. Commercial SSL

#### Generate CSR
```bash
openssl req -new -newkey rsa:2048 -nodes -keyout your-domain.key -out your-domain.csr
```

#### Install SSL Certificate
```bash
# Upload certificate files ke server
# /etc/ssl/certs/your-domain.crt
# /etc/ssl/private/your-domain.key
# /etc/ssl/certs/chain.crt
```

## Nginx SSL Configuration

### Complete SSL Config
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS (Optional)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rest of your configuration...
}
```

## Security Headers

### Add to Nginx Config
```nginx
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Testing SSL

### Online Tools
1. SSL Labs: https://www.ssllabs.com/ssltest/
2. Why No Padlock: https://www.whynopadlock.com/
3. SSL Checker: https://www.sslshopper.com/ssl-checker.html

### Command Line
```bash
# Check certificate
openssl s_client -connect your-domain.com:443

# Check SSL Labs rating
curl -s https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com&hideResults=on
```

## Troubleshooting

### Common Issues

#### 1. Certificate Not Found
```bash
# Check certificate path
sudo nginx -t
ls -la /etc/letsencrypt/live/your-domain.com/
```

#### 2. Mixed Content Warning
```bash
# Check for HTTP resources
grep -r "http://" /var/www/your-app/
```

#### 3. DNS Propagation
```bash
# Check DNS
dig your-domain.com
nslookup your-domain.com
```

#### 4. Firewall Issues
```bash
# Open port 443
sudo ufw allow 443/tcp
sudo ufw reload
```

## Maintenance

### Renew SSL
```bash
# Manual renewal
sudo certbot renew

# Check renewal status
sudo certbot certificates
```

### Backup SSL
```bash
# Backup Let's Encrypt
sudo tar -czf letsencrypt-backup.tar.gz /etc/letsencrypt/
```

### Monitor SSL
```bash
# Add to crontab untuk monitoring
0 6 * * * /usr/bin/certbot renew --quiet && systemctl reload nginx
```