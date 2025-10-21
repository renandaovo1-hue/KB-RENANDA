'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Crown,
  Wallet,
  Gamepad2,
  Eye,
  Building,
  CreditCard,
  Upload,
  Trash2,
  Plus,
  Loader2
} from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  name: string
  role: string
  balance: number
  createdAt: string
  banks?: any[]
}

interface GameStats {
  totalGames: number
  totalPlayers: number
  totalBets: number
  totalTax: number
  activeRooms: number
}

interface Bank {
  id: string
  userId: string
  bankName: string
  accountName: string
  accountNumber: string
  qrisImage?: string
  createdAt: string
  user: {
    username: string
    email: string
  }
}

interface Transaction {
  id: string
  userId: string
  type: string
  amount: number
  description?: string
  status: string
  createdAt: string
  user: {
    username: string
    email: string
    bankName?: string
    bankAccountNumber?: string
    bankAccountName?: string
  }
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [banks, setBanks] = useState<Bank[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<GameStats>({
    totalGames: 0,
    totalPlayers: 0,
    totalBets: 0,
    totalTax: 0,
    activeRooms: 0
  })
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editBalance, setEditBalance] = useState('')
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showBankModal, setShowBankModal] = useState(false)
  const [showEditBankModal, setShowEditBankModal] = useState(false)
  const [showQrisModal, setShowQrisModal] = useState(false)
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [editingBank, setEditingBank] = useState<Bank | null>(null)
  const [newBank, setNewBank] = useState({
    userId: '',
    bankName: '',
    accountName: '',
    accountNumber: ''
  })
  const [settings, setSettings] = useState({
    siteName: 'KB RENAN',
    minDeposit: 1000,
    minWithdraw: 1000,
    tax: 15
  })
  const [savingSettings, setSavingSettings] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      window.location.href = '/'
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'ADMIN') {
      window.location.href = '/player'
      return
    }

    setUser(parsedUser)
    fetchUsers()
    fetchBanks()
    fetchTransactions()
    fetchStats()
    fetchSettings()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  const fetchBanks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/banks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setBanks(data.banks)
      }
    } catch (err) {
      console.error('Failed to fetch banks:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }

  const saveSettings = async () => {
    setSavingSettings(true)
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Pengaturan berhasil disimpan!')
        fetchSettings() // Refresh settings
      } else {
        setError(data.error || 'Gagal menyimpan pengaturan')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setSavingSettings(false)
    }
  }

  const updateUserBalance = async (userId: string, newBalance: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/users/${userId}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ balance: newBalance })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Saldo pengguna berhasil diperbarui')
        setEditingUser(null)
        setEditBalance('')
        fetchUsers()
        fetchStats()
      } else {
        setError(data.error || 'Gagal memperbarui saldo')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const createBank = async () => {
    if (!newBank.bankName || !newBank.accountName || !newBank.accountNumber) {
      setError('Nama bank, nama pemilik, dan nomor rekening wajib diisi')
      return
    }

    if (!newBank.userId) {
      setError('Pilih tipe bank terlebih dahulu')
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      // Jika memilih "admin", gunakan user ID admin yang sedang login
      let userId = newBank.userId
      if (newBank.userId === 'admin') {
        userId = user.id
      }

      const response = await fetch('/api/admin/banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          bankName: newBank.bankName,
          accountName: newBank.accountName,
          accountNumber: newBank.accountNumber
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        const bankType = newBank.userId === 'admin' ? 'admin' : 'player'
        const successMessage = bankType === 'admin' 
          ? 'Akun bank admin berhasil dibuat' 
          : 'Akun bank player berhasil dibuat'
        
        setSuccess(successMessage)
        setNewBank({ userId: '', bankName: '', accountName: '', accountNumber: '' })
        setShowBankModal(false)
        fetchBanks()
      } else {
        setError(data.error || 'Gagal membuat bank')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const createAdminBank = async () => {
    if (!editingBank || !editingBank.bankName || !editingBank.accountName || !editingBank.accountNumber) {
      setError('Semua field bank wajib diisi')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: editingBank.userId,
          bankName: editingBank.bankName,
          accountName: editingBank.accountName,
          accountNumber: editingBank.accountNumber
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Akun bank admin berhasil dibuat')
        setShowEditBankModal(false)
        setSelectedBank(null)
        setEditingBank(null)
        fetchBanks()
      } else {
        setError(data.error || 'Gagal membuat bank admin')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const updateBank = async (bankId: string, updateData: any) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/banks/${bankId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Akun bank berhasil diperbarui')
        setEditingBank(null)
        setShowEditBankModal(false)
        setSelectedBank(null)
        fetchBanks()
      } else {
        setError(data.error || 'Gagal memperbarui bank')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const deleteBank = async (bankId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun bank ini?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/banks/${bankId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Akun bank berhasil dihapus')
        fetchBanks()
      } else {
        setError(data.error || 'Gagal menghapus bank')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const openEditBankModal = (bank: Bank) => {
    setSelectedBank(bank)
    setEditingBank({
      ...bank,
      userId: bank.userId
    })
    setShowEditBankModal(true)
  }

  const openQrisModal = (bank: Bank) => {
    setSelectedBank(bank)
    setShowQrisModal(true)
  }

  const updateQris = async (bankId: string, file: File) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/admin/banks/${bankId}/qris`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('QRIS berhasil diperbarui')
        fetchBanks()
      } else {
        setError(data.error || 'Gagal memperbarui QRIS')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const uploadQris = async (bankId: string, file: File) => {
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`/api/admin/banks/${bankId}/qris`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('QRIS berhasil diunggah')
        setShowQrisModal(false)
        setSelectedBank(null)
        fetchBanks()
      } else {
        setError(data.error || 'Gagal mengunggah QRIS')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const updateTransactionStatus = async (transactionId: string, status: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ transactionId, status })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        const transaction = data.transaction
        let message = 'Transaksi berhasil diperbarui'
        
        if (status === 'COMPLETED' && transaction.type === 'WITHDRAW') {
          message = 'Withdraw berhasil disetujui - saldo sudah dibekukan'
        } else if (status === 'REJECTED' && transaction.type === 'WITHDRAW') {
          message = 'Withdraw ditolak - saldo dikembalikan ke player'
        } else if (status === 'COMPLETED' && transaction.type === 'DEPOSIT') {
          message = 'Deposit berhasil disetujui - saldo ditambahkan ke player'
        }
        
        setSuccess(message)
        fetchTransactions()
        fetchUsers()
      } else {
        setError(data.error || 'Gagal memperbarui transaksi')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.65_0.25_280/0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <header className="glass border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                  <Crown className="w-8 h-8 text-purple-400 relative z-10" />
                </div>
                <h1 className="text-xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Dashboard Admin
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-purple-500/20">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-purple-200">{user.username}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={logout}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Keluar
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="glass border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-400">Total Pemain</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.totalPlayers}</div>
              </CardContent>
            </Card>

            <Card className="glass border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-400">Total Permainan</CardTitle>
                <Gamepad2 className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.totalGames}</div>
              </CardContent>
            </Card>

            <Card className="glass border-yellow-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-400">Total Taruhan</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">
                  Rp {stats.totalBets.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-400">Pajak Dikumpulkan</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  Rp {stats.totalTax.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-red-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-400">Ruangan Aktif</CardTitle>
                <Eye className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">{stats.activeRooms}</div>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Alert className="mb-6 border-red-500/20 bg-red-500/10">
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-500/20 bg-green-500/10">
              <AlertDescription className="text-green-400">
                {success}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/20">
              <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Manajemen Pengguna</TabsTrigger>
              <TabsTrigger value="bank-settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Pengaturan Bank</TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Transaksi</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Pengaturan</TabsTrigger>
            </TabsList>

          <TabsContent value="users">
            <Card className="glass border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Manajemen Pengguna</CardTitle>
                <CardDescription className="text-gray-400">
                  Kelola saldo dan akun pemain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-500/20">
                        <TableHead className="text-gray-300">Username</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                        <TableHead className="text-gray-300">Balance</TableHead>
                        <TableHead className="text-gray-300">Registered</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="border-purple-500/10">
                          <TableCell className="text-white">{user.username}</TableCell>
                          <TableCell className="text-gray-300">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                   className={user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-green-400 font-semibold">
                            Rp {user.balance.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {editingUser === user.id ? (
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={editBalance}
                                  onChange={(e) => setEditBalance(e.target.value)}
                                  className="w-24 bg-slate-800/50 border-purple-500/20 text-white"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => updateUserBalance(user.id, parseInt(editBalance))}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingUser(null)
                                    setEditBalance('')
                                  }}
                                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingUser(user.id)
                                  setEditBalance(user.balance.toString())
                                }}
                                className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank-settings">
            <Card className="glass border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Pengaturan Bank</CardTitle>
                <CardDescription className="text-gray-400">
                  Kelola akun bank untuk transaksi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Daftar Bank</h3>
                    <Button 
                      onClick={() => setShowBankModal(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Bank
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-purple-500/20">
                          <TableHead className="text-gray-300">Bank</TableHead>
                          <TableHead className="text-gray-300">Pemilik</TableHead>
                          <TableHead className="text-gray-300">No. Rekening</TableHead>
                          <TableHead className="text-gray-300">QRIS</TableHead>
                          <TableHead className="text-gray-300">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {banks.map((bank) => (
                          <TableRow key={bank.id} className="border-purple-500/10">
                            <TableCell className="text-white">
                              <div className="flex items-center gap-2">
                                {bank.user.role === 'ADMIN' ? (
                                  <>
                                    <Crown className="w-4 h-4 text-yellow-400" />
                                    <span>{bank.bankName}</span>
                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                      ADMIN
                                    </Badge>
                                  </>
                                ) : (
                                  <>
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span>{bank.bankName}</span>
                                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                                      PLAYER
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">
                              <div>
                                <div>{bank.accountName}</div>
                                <div className="text-xs text-gray-500">@{bank.user.username}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">{bank.accountNumber}</TableCell>
                            <TableCell>
                              {bank.qrisImage ? (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                  Ada
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                                  Tidak Ada
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openEditBankModal(bank)}
                                  className="border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openQrisModal(bank)}
                                  className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                                >
                                  <Upload className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteBank(bank.id)}
                                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="glass border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Transaksi</CardTitle>
                <CardDescription className="text-gray-400">
                  Kelola transaksi deposit dan withdraw
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 text-sm text-gray-400">
                  Total Transaksi: {transactions.length}
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-500/20">
                        <TableHead className="text-gray-300">Waktu</TableHead>
                        <TableHead className="text-gray-300">User</TableHead>
                        <TableHead className="text-gray-300">Jenis</TableHead>
                        <TableHead className="text-gray-300">Jumlah</TableHead>
                        <TableHead className="text-gray-300">Bank Info (WD)</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            Tidak ada transaksi yang ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-purple-500/10">
                          <TableCell className="text-white">
                            <div className="text-sm">
                              {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(transaction.createdAt).toLocaleTimeString('id-ID')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">{transaction.user.username}</div>
                              <div className="text-xs text-gray-400">{transaction.user.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.type === 'DEPOSIT' ? 'default' : 'secondary'}
                                   className={transaction.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            <span className={transaction.type === 'DEPOSIT' ? 'text-green-400' : 'text-red-400'}>
                              {transaction.type === 'DEPOSIT' ? '+' : '-'}Rp {transaction.amount.toLocaleString('id-ID')}
                            </span>
                          </TableCell>
                          <TableCell>
                            {transaction.type === 'WITHDRAW' ? (
                              <div className="space-y-1">
                                {transaction.user.bankName ? (
                                  <div className="text-sm text-white">
                                    <span className="text-gray-400">Bank:</span> {transaction.user.bankName}
                                  </div>
                                ) : (
                                  <div className="text-red-400 text-sm">Bank info tidak ada</div>
                                )}
                                {transaction.user.bankAccountNumber && (
                                  <div className="text-xs text-gray-400">
                                    <span className="text-gray-500">No:</span> {transaction.user.bankAccountNumber}
                                  </div>
                                )}
                                {transaction.user.bankAccountName && (
                                  <div className="text-xs text-gray-400">
                                    <span className="text-gray-500">A/n:</span> {transaction.user.bankAccountName}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                                   className={transaction.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 
                                            transaction.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                            'bg-red-500/20 text-red-400 border-red-500/30'}>
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {transaction.status === 'PENDING' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => updateTransactionStatus(transaction.id, 'COMPLETED')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTransactionStatus(transaction.id, 'REJECTED')}
                                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="glass border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Pengaturan</CardTitle>
                <CardDescription className="text-gray-400">
                  Konfigurasi sistem dan pengaturan umum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Pengaturan Umum</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-300">Nama Situs</Label>
                        <Input 
                          value={settings.siteName}
                          onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                          className="bg-slate-800/50 border-purple-500/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Minimal Deposit</Label>
                        <Input 
                          value={settings.minDeposit}
                          onChange={(e) => setSettings({...settings, minDeposit: parseInt(e.target.value) || 0})}
                          type="number"
                          className="bg-slate-800/50 border-purple-500/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Minimal Withdraw</Label>
                        <Input 
                          value={settings.minWithdraw}
                          onChange={(e) => setSettings({...settings, minWithdraw: parseInt(e.target.value) || 0})}
                          type="number"
                          className="bg-slate-800/50 border-purple-500/20 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-300">Tax (%)</Label>
                        <Input 
                          value={settings.tax}
                          onChange={(e) => setSettings({...settings, tax: parseInt(e.target.value) || 0})}
                          type="number"
                          className="bg-slate-800/50 border-purple-500/20 text-white"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={saveSettings}
                      disabled={savingSettings}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {savingSettings ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Simpan Pengaturan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bank Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md glass border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Tambah Bank Baru</CardTitle>
              <CardDescription className="text-gray-400">
                Tambah bank admin atau bank untuk player
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Tipe Bank</Label>
                <select 
                  value={newBank.userId}
                  onChange={(e) => setNewBank({...newBank, userId: e.target.value})}
                  className="w-full bg-slate-800/50 border-purple-500/20 text-white rounded-md p-2"
                >
                  <option value="">Pilih Tipe Bank</option>
                  <option value="admin">🏦 Bank Admin (Untuk Deposit)</option>
                  <option value="">─────────────────</option>
                  {users.filter(u => u.role === 'PLAYER').map(user => (
                    <option key={user.id} value={user.id}>👤 {user.username} (Bank Player)</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Nama Bank</Label>
                <Input
                  value={newBank.bankName}
                  onChange={(e) => setNewBank({...newBank, bankName: e.target.value})}
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                  placeholder="BCA, Mandiri, dll"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Nama Pemilik</Label>
                <Input
                  value={newBank.accountName}
                  onChange={(e) => setNewBank({...newBank, accountName: e.target.value})}
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                  placeholder="Nama pemilik rekening"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">No. Rekening</Label>
                <Input
                  value={newBank.accountNumber}
                  onChange={(e) => setNewBank({...newBank, accountNumber: e.target.value})}
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                  placeholder="Nomor rekening"
                />
              </div>
              <Alert className="bg-blue-500/10 border-blue-500/20">
                <AlertDescription className="text-blue-400 text-sm">
                  💡 <strong>Info:</strong> Bank Admin akan muncul di halaman player sebagai rekening tujuan deposit.
                  Bank Player akan digunakan untuk withdraw player tersebut.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button onClick={createBank} className="bg-purple-600 hover:bg-purple-700">
                  Tambah
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowBankModal(false)
                    setNewBank({ userId: '', bankName: '', accountName: '', accountNumber: '' })
                  }}
                  className="border-gray-500/20 text-gray-400"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Bank Modal */}
      {showEditBankModal && editingBank && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md glass border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Edit Bank</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Nama Bank</Label>
                <Input
                  value={editingBank.bankName}
                  onChange={(e) => setEditingBank({...editingBank, bankName: e.target.value})}
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Nama Pemilik</Label>
                <Input
                  value={editingBank.accountName}
                  onChange={(e) => setEditingBank({...editingBank, accountName: e.target.value})}
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">No. Rekening</Label>
                <Input
                  value={editingBank.accountNumber}
                  onChange={(e) => setEditingBank({...editingBank, accountNumber: e.target.value})}
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    const updateData = {
                      bankName: editingBank.bankName,
                      accountName: editingBank.accountName,
                      accountNumber: editingBank.accountNumber
                    }
                    updateBank(editingBank.id, updateData)
                  }} 
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Update
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowEditBankModal(false)
                    setEditingBank(null)
                    setSelectedBank(null)
                  }}
                  className="border-gray-500/20 text-gray-400"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* QRIS Modal */}
      {showQrisModal && selectedBank && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md glass border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Upload QRIS</CardTitle>
              <CardDescription className="text-gray-400">
                Upload gambar QRIS untuk {selectedBank.bankName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Pilih File QRIS</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Validasi file
                      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
                      const maxSize = 5 * 1024 * 1024 // 5MB
                      
                      if (!allowedTypes.includes(file.type)) {
                        setError('Hanya file gambar yang diperbolehkan (JPG, PNG, GIF, WebP)')
                        return
                      }
                      
                      if (file.size > maxSize) {
                        setError('Ukuran file maksimal 5MB')
                        return
                      }
                      
                      uploadQris(selectedBank.id, file)
                    }
                  }}
                  className="bg-slate-800/50 border-purple-500/20 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowQrisModal(false)
                    setSelectedBank(null)
                  }}
                  className="border-gray-500/20 text-gray-400"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </div>
  )
}
