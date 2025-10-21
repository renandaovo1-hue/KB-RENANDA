# 🎲 KB RENAN - Dadu Koprok Online Game

## 📋 **Overview**
KB RENAN adalah platform game dadu koprok online modern dengan real-time multiplayer, admin dashboard, dan sistem transaksi lengkap.

## 🚀 **Quick Deploy**

### **Railway (Recommended)**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/your-username/kb-renan)

### **Vercel**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/kb-renan)

---

## 🎮 **Features**

### **Game Features**
- 🎲 **Real-time Dadu Koprok** - 9 dice game dengan betting system
- 👥 **Multiplayer** - Real-time gameplay dengan Socket.IO
- 💰 **Betting System** - Small/Big betting dengan tax calculation
- 🏆 **Win/Loss Tracking** - Complete game history
- ⏱️ **Room Management** - Auto-expiring game rooms

### **User Features**
- 🔐 **Secure Authentication** - JWT-based login system
- 👤 **User Profiles** - Balance management and history
- 🏦 **Bank Integration** - Deposit/withdraw system
- 📊 **Statistics** - Personal game statistics
- 📱 **Responsive Design** - Mobile-friendly interface

### **Admin Features**
- 👑 **Admin Dashboard** - Complete management system
- 👥 **User Management** - View and manage all users
- 🏠 **Room Monitoring** - Active game room oversight
- 💸 **Transaction Control** - Deposit/withdraw approval
- 📈 **Analytics** - Revenue and usage statistics

---

## 🛠️ **Tech Stack**

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **shadcn/ui** - Component library
- **Socket.IO Client** - Real-time communication

### **Backend**
- **Node.js** - Server runtime
- **Prisma ORM** - Database management
- **PostgreSQL** - Production database
- **Socket.IO** - Real-time server
- **JWT** - Authentication

### **Infrastructure**
- **Railway** - Primary hosting platform
- **Vercel** - Alternative hosting
- **GitHub** - Version control & CI/CD

---

## 🚀 **Deployment Options**

### **1. Railway (Recommended)**
```bash
# Quick deploy with GitHub integration
git push origin main
# Railway auto-deploys! 🚂
```
📖 **Guide**: [deployment/railway-deployment-guide.md](./deployment/railway-deployment-guide.md)

### **2. VPS (Professional)**
```bash
# Use automated setup script
./scripts/vps-setup.sh
```
📖 **Guide**: [deployment/vps-deployment-guide.md](./deployment/vps-deployment-guide.md)

### **3. Vercel (Beginner)**
```bash
# Connect repository to Vercel
# Auto-deploy on push
```
📖 **Guide**: [deployment/vercel-deployment-guide.md](./deployment/vercel-deployment-guide.md)

### **4. cPanel (Budget)**
📖 **Guide**: [deployment/cpanel-deployment-guide.md](./deployment/cpanel-deployment-guide.md)

---

## 📦 **Local Development**

### **Prerequisites**
- Node.js 18+
- PostgreSQL or SQLite
- Git

### **Setup**
```bash
# Clone repository
git clone https://github.com/your-username/kb-renan.git
cd kb-renan

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your settings

# Setup database
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

### **Environment Variables**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/kb-renan"
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

### **Test Application**
```bash
# Test all features
node scripts/test-local.js

# Test Railway readiness
node scripts/test-railway-readiness.js
```

---

## 🎯 **Game Rules**

### **Dadu Koprok Rules**
- **9 Dice** - Total range: 9-54
- **Small (Kecil)** - Total 9-31 (win probability: ~50%)
- **Big (Besar)** - Total 32-54 (win probability: ~50%)
- **Tax** - 15% on winnings
- **Betting** - Minimum Rp 10,000

### **How to Play**
1. **Login** ke akun Anda
2. **Top up** balance melalui bank
3. **Create room** atau **join existing room**
4. **Place bet** (Small/Big)
5. **Roll dice** dan tunggu hasil
6. **Win/Loss** dihitung otomatis
7. **Withdraw** kemenangan

---

## 👥 **User Roles**

### **Admin**
- Full system access
- User management
- Transaction approval
- Analytics viewing
- System configuration

### **Player**
- Game participation
- Balance management
- Transaction history
- Statistics viewing

---

## 🏗️ **Project Structure**

```
kb-renan/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── admin/          # Admin dashboard
│   │   ├── game/           # Game pages
│   │   └── (auth)/         # Authentication pages
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── game/          # Game components
│   │   └── admin/         # Admin components
│   ├── lib/               # Utilities and configs
│   └── hooks/             # Custom React hooks
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding
├── public/               # Static assets
├── scripts/              # Utility scripts
├── deployment/           # Deployment guides
└── docs/                # Documentation
```

---

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### **Game**
- `POST /api/rooms` - Create game room
- `POST /api/rooms/[code]/join` - Join room
- `POST /api/games/[id]/roll` - Roll dice

### **Admin**
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `POST /api/transactions` - Process transactions

### **Utilities**
- `GET /api/health` - Health check
- `POST /api/seed` - Database seeding

---

## 🎨 **UI Components**

### **Game Interface**
- Dice rolling animation
- Real-time score updates
- Betting interface
- Chat system

### **Admin Dashboard**
- User management table
- Transaction overview
- Analytics charts
- System settings

### **Responsive Design**
- Mobile-first approach
- Touch-friendly controls
- Progressive enhancement

---

## 📊 **Database Schema**

### **Core Models**
- **User** - User accounts and profiles
- **Room** - Game rooms and settings
- **Game** - Individual game sessions
- **GamePlayer** - Player participation
- **Round** - Dice roll results
- **Transaction** - Financial transactions
- **Bank** - Bank account information

---

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Input Validation** - Zod schema validation
- **Rate Limiting** - API protection
- **CORS Configuration** - Cross-origin security
- **Environment Variables** - Secure configuration

---

## 🧪 **Testing**

### **Local Testing**
```bash
# Test all features locally
npm run test:local

# Test API endpoints
npm run test:api

# Test database operations
npm run test:db
```

### **Deployment Testing**
```bash
# Railway readiness test
node scripts/test-railway-readiness.js

# Vercel readiness test
node scripts/test-vercel-readiness.js
```

---

## 📈 **Monitoring & Analytics**

### **Application Monitoring**
- Health checks (`/api/health`)
- Performance metrics
- Error tracking
- User analytics

### **Business Analytics**
- Revenue tracking
- Game statistics
- User engagement
- Transaction history

---

## 🔄 **CI/CD Pipeline**

### **GitHub Actions**
- Automated testing
- Build validation
- Deployment triggers
- Rollback capabilities

### **Railway Integration**
- Auto-deployment on push
- Preview deployments
- Environment management
- Health monitoring

---

## 💰 **Pricing & Monetization**

### **Operating Costs**
- **Railway**: $10-25/month
- **Custom Domain**: $10/year
- **Total**: ~$20-35/month

### **Revenue Streams**
- **Game Tax** - 15% on winnings
- **Transaction Fees** - Deposit/withdraw fees
- **Premium Features** - VIP rooms, special bets

---

## 🤝 **Contributing**

### **Development Workflow**
1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

### **Code Standards**
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

---

## 📞 **Support & Community**

### **Documentation**
- [Deployment Guides](./deployment/)
- [API Documentation](./docs/api.md)
- [User Manual](./docs/user-guide.md)

### **Community**
- **Discord**: [Join our server](https://discord.gg/kb-renan)
- **GitHub Issues**: [Report bugs](https://github.com/your-username/kb-renan/issues)
- **Discussions**: [Feature requests](https://github.com/your-username/kb-renan/discussions)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎊 **Acknowledgments**

- **Next.js Team** - Excellent framework
- **Prisma** - Modern database toolkit
- **Railway** - Amazing hosting platform
- **shadcn/ui** - Beautiful components
- **Socket.IO** - Real-time communication

---

## 🚀 **Quick Start**

1. **⭐ Star this repository**
2. **🍴 Fork to your account**
3. **🚂 Deploy to Railway**
4. **🎮 Start playing!**

---

**🎲 Selamat bermain di KB RENAN!**

*Made with ❤️ using Next.js, TypeScript, and Railway*#   K B - R E N A N D A  
 