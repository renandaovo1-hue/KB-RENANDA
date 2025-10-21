# Database Production Setup Guide

## Options for Production Database

### 1. PostgreSQL (Recommended for Production)
**Setup di VPS:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE kbrenan_prod;
CREATE USER kbrenan_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE kbrenan_prod TO kbrenan_user;
\q
```

**Environment Variable:**
```bash
DATABASE_URL="postgresql://kbrenan_user:your-secure-password@localhost:5432/kbrenan_prod"
```

### 2. MySQL/MariaDB
**Setup di VPS:**
```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server

# Create database and user
sudo mysql
CREATE DATABASE kbrenan_prod;
CREATE USER 'kbrenan_user'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON kbrenan_prod.* TO 'kbrenan_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Environment Variable:**
```bash
DATABASE_URL="mysql://kbrenan_user:your-secure-password@localhost:3306/kbrenan_prod"
```

### 3. SQLite (Good for Small Scale)
**Untuk aplikasi kecil-menengah:**
```bash
# Environment Variable
DATABASE_URL="file:./production.db"

# Setup permissions
touch production.db
chmod 660 production.db
```

### 4. Cloud Database Options

#### Supabase (PostgreSQL)
1. Sign up di supabase.com
2. Create new project
3. Get connection string dari Settings → Database
4. Update DATABASE_URL

#### PlanetScale (MySQL)
1. Sign up di planetscale.com
2. Create database
3. Get connection string
4. Update DATABASE_URL

#### Railway (PostgreSQL)
1. Sign up di railway.app
2. Add PostgreSQL service
3. Get connection string
4. Update DATABASE_URL

## Database Migration

### 1. Update Prisma Schema
```bash
# Edit prisma/schema.prisma
# Ganti provider sesuai database yang dipilih
datasource db {
  provider = "postgresql"  # atau "mysql"
  url      = env("DATABASE_URL")
}
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Push Schema to Production
```bash
npx prisma db push
```

### 4. Seed Data (Optional)
```bash
npx prisma db seed
```

## Database Backup

### PostgreSQL
```bash
# Backup
pg_dump -h localhost -U kbrenan_user kbrenan_prod > backup.sql

# Restore
psql -h localhost -U kbrenan_user kbrenan_prod < backup.sql
```

### MySQL
```bash
# Backup
mysqldump -u kbrenan_user -p kbrenan_prod > backup.sql

# Restore
mysql -u kbrenan_user -p kbrenan_prod < backup.sql
```

### SQLite
```bash
# Backup (copy file)
cp production.db production.db.backup

# Restore
cp production.db.backup production.db
```

## Performance Tips

1. **Connection Pooling**: Gunakan connection pool untuk production
2. **Indexing**: Add indexes untuk query yang sering digunakan
3. **Regular Backups**: Setup automated backups
4. **Monitoring**: Monitor database performance
5. **Scaling**: Scale database sesuai kebutuhan

## Security Tips

1. **Strong Passwords**: Gunakan password yang kuat
2. **Limited Access**: Batasi akses database
3. **SSL**: Gunakan SSL untuk koneksi database
4. **Regular Updates**: Update database software
5. **Audit Logs**: Enable audit logs