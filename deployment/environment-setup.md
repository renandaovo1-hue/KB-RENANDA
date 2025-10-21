# Environment Variables Production Setup

## Required Variables

### 1. Database
```bash
DATABASE_URL="file:./production.db"
# Untuk production, gunakan database yang lebih robust:
# DATABASE_URL="postgresql://username:password@host:port/database"
# DATABASE_URL="mysql://username:password@host:port/database"
```

### 2. JWT Secret (VERY IMPORTANT!)
```bash
# Generate secure random string:
JWT_SECRET="your-super-secure-jwt-secret-key-minimum-32-characters-long"
# Cara generate:
# openssl rand -base64 32
# atau
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Application
```bash
NODE_ENV="production"
PORT=3000
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 4. Email (Optional)
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="noreply@your-domain.com"
```

## Setup by Platform

### Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable
3. Redeploy

### VPS
1. Create .env file:
```bash
nano .env
```
2. Add all variables
3. Set permissions:
```bash
chmod 600 .env
```

### cPanel
1. Go to Node.js Setup → Environment Variables
2. Add each variable

### Docker
1. Create docker-compose.yml:
```yaml
version: '3.8'
services:
  app:
    build: .
    environment:
      - DATABASE_URL=file:./production.db
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=production
```

## Security Tips
1. Never commit .env file to Git
2. Use different secrets for development/production
3. Rotate JWT secrets periodically
4. Use long, random strings for secrets
5. Don't use default values in production