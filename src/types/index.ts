export interface User {
  id: string
  username: string
  email: string
  password: string
  balance: number
  role: 'USER' | 'ADMIN'
  bankName?: string
  bankAccountNumber?: string
  bankAccountName?: string
  createdAt: Date
  updatedAt: Date
}

export interface Transaction {
  id: string
  userId: string
  type: 'DEPOSIT' | 'WITHDRAW'
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'REJECTED'
  createdAt: Date
  updatedAt: Date
  user: {
    username: string
    email: string
    bankName?: string
    bankAccountNumber?: string
    bankAccountName?: string
  }
}

export interface GameHistory {
  id: string
  userId: string
  gameType: string
  betAmount: number
  multiplier: number
  winAmount: number
  result: 'WIN' | 'LOSE'
  createdAt: Date
  user: {
    username: string
  }
}

export interface AdminStats {
  totalUsers: number
  totalBalance: number
  totalTransactions: number
  pendingDeposits: number
  pendingWithdraws: number
  todayTransactions: number
  todayRevenue: number
}