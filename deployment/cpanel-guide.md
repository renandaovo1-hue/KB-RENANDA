# KB RENAN - cPanel Deployment Guide

## Requirements
- cPanel with Node.js support
- SSH access to your hosting
- Domain pointed to your hosting

## Steps

### 1. Upload Files
```bash
# Upload your project folder to cPanel
# Or use Git if available
git clone your-repo-url
```

### 2. Setup Node.js in cPanel
1. Login to cPanel
2. Go to "Setup Node.js App"
3. Create new application:
   - Node.js version: 18.x
   - Application mode: Production
   - Application root: kb-renan
   - Application URL: your-domain.com
   - Application startup file: server.js

### 3. Install Dependencies
```bash
cd ~/kb-renan
npm install --production
```

### 4. Setup Environment
In cPanel Node.js setup, add environment variables:
```
NODE_ENV=production
DATABASE_URL=file:./production.db
JWT_SECRET=your-jwt-secret
```

### 5. Build Application
```bash
npm run build
```

### 6. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 7. Restart Application
Click "Restart" in cPanel Node.js setup

### 8. Setup .htaccess for routing
Create .htaccess file in public_html:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L]
```