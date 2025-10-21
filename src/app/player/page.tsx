'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dice1, 
  DollarSign, 
  Users, 
  Play, 
  Plus, 
  Copy, 
  LogOut,
  TrendingUp,
  Wallet,
  Clock,
  User,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Trophy,
  Eye,
  X
} from 'lucide-react'

interface User {
  id: string
  username: string
  name: string
  balance: number
  role: string
  email: string
}

interface Room {
  id: string
  roomCode: string
  status: string
  betType: string
  betAmount: number
  creator: {
    username: string
  }
  expiresAt: string
  playerCount?: number
  isCreator?: boolean
}

interface Bank {
  id: string
  bankName: string
  accountName: string
  accountNumber: string
  qrisImage?: string
}

interface Transaction {
  id: string
  type: string
  amount: number
  description?: string
  status: string
  createdAt: string
}

interface Settings {
  siteName: string
  minDeposit: number
  minWithdraw: number
  tax: number
}

export default function PlayerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [userActiveRoomsCount, setUserActiveRoomsCount] = useState(0)
  const [maxActiveRooms] = useState(3)
  const [banks, setBanks] = useState<Bank[]>([])
  const [adminBanks, setAdminBanks] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pendingWithdrawCount, setPendingWithdrawCount] = useState(0)
  const [settings, setSettings] = useState<Settings>({
    siteName: 'KB RENAN',
    minDeposit: 1000,
    minWithdraw: 1000,
    tax: 15
  })
  const [loading, setLoading] = useState(true)
  const [creatingRoom, setCreatingRoom] = useState(false)
  const [joiningRoom, setJoiningRoom] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newRoom, setNewRoom] = useState({
    betType: 'SMALL',
    betAmount: 500
  })
  const [newBank, setNewBank] = useState({
    bankName: '',
    accountName: '',
    accountNumber: ''
  })
  const [transactionAmount, setTransactionAmount] = useState('')
  const [showAddBank, setShowAddBank] = useState(false)
  const [transactionLoading, setTransactionLoading] = useState<string | null>(null)
  const [lastTransactionTime, setLastTransactionTime] = useState<number>(0)
  const [pendingTransaction, setPendingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      window.location.href = '/'
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchRooms()
    fetchBanks()
    fetchAdminBanks()
    fetchPaymentMethods()
    fetchTransactions()
    fetchSettings()
    fetchUserData()

    // Refresh user data every 30 seconds
    const interval = setInterval(fetchUserData, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setRooms(data.rooms)
        setUserActiveRoomsCount(data.userActiveRoomsCount || 0)
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err)
    }
  }

  const fetchBanks = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/banks', {
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

  const fetchAdminBanks = async () => {
    try {
      const response = await fetch('/api/admin-banks')
      
      if (response.ok) {
        const data = await response.json()
        setAdminBanks(data.banks)
      }
    } catch (err) {
      console.error('Failed to fetch admin banks:', err)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch('/api/payment-methods')
      
      if (response.ok) {
        const data = await response.json()
        setPaymentMethods(data.paymentMethods)
      }
    } catch (err) {
      console.error('Failed to fetch payment methods:', err)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    }
  }

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err)
    }
  }

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const transactionList = data.transactions || []
        setTransactions(transactionList)
        
        // Cek apakah ada pending transaction
        const pending = transactionList.find(t => t.status === 'PENDING')
        setPendingTransaction(pending || null)
        
        const pendingCount = transactionList.filter(t => t.type === 'WITHDRAW' && t.status === 'PENDING').length
        setPendingWithdrawCount(pendingCount)
      } else {
        setTransactions([])
        setPendingTransaction(null)
        setPendingWithdrawCount(0)
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const createRoom = async () => {
    setCreatingRoom(true)
    setError('')
    setSuccess('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRoom)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess(`Room created! Code: ${data.room.roomCode}`)
        setNewRoom({ betType: 'SMALL', betAmount: 500 })
        fetchRooms()
      } else {
        setError(data.error || 'Failed to create room')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setCreatingRoom(false)
    }
  }

  const addBank = async () => {
    // Cek apakah user sudah memiliki bank
    if (banks.length > 0) {
      setError('Anda sudah memiliki akun bank yang terdaftar. Hubungi admin untuk mengganti bank.')
      return
    }

    if (!newBank.bankName || !newBank.accountName || !newBank.accountNumber) {
      setError('Semua field bank wajib diisi')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newBank)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Akun bank berhasil ditambahkan. Ini adalah satu-satunya akun bank yang dapat Anda daftarkan.')
        setNewBank({ bankName: '', accountName: '', accountNumber: '' })
        setShowAddBank(false)
        fetchBanks()
      } else {
        setError(data.error || 'Gagal menambah bank')
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    }
  }

  const createTransaction = async (type: 'DEPOSIT' | 'WITHDRAW') => {
    // Prevent multiple simultaneous requests
    if (transactionLoading) {
      setError('Transaksi sedang diproses. Silakan tunggu.')
      return
    }

    // Cek apakah user memiliki pending transaction
    if (pendingTransaction) {
      setError(`🚫 Anda memiliki request ${pendingTransaction.type} yang masih pending (ID: ${pendingTransaction.id}). Tunggu hingga request tersebut disetujui atau ditolak.`)
      return
    }

    // Rate limiting: prevent rapid successive requests
    const now = Date.now()
    const timeSinceLastTransaction = now - lastTransactionTime
    if (timeSinceLastTransaction < 2000) { // 2 seconds cooldown
      setError('Mohon tunggu 2 detik sebelum mencoba lagi.')
      return
    }

    const amount = parseInt(transactionAmount)
    const minAmount = type === 'DEPOSIT' ? settings.minDeposit : settings.minWithdraw
    
    if (!amount || amount < minAmount) {
      setError(`Minimal jumlah adalah Rp ${minAmount.toLocaleString()}`)
      return
    }

    setTransactionLoading(type)
    setLastTransactionTime(now)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          amount,
          description: `Permintaan ${type} sebesar ${amount}`
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess(`✅ Permintaan ${type} berhasil dibuat! ${type === 'WITHDRAW' ? 'Saldo telah dibekukan sambil menunggu persetujuan admin.' : 'Menunggu persetujuan admin.'}`)
        setTransactionAmount('')
        fetchTransactions()
        // Refresh user data to get updated balance
        setTimeout(fetchUserData, 1000)
      } else {
        // Handle specific anti-spam errors
        if (response.status === 429) {
          if (data.hasPendingTransaction) {
            setError(`🚫 ${data.error}`)
          } else if (data.existingTransaction) {
            setError(`⚠️ ${data.error}`)
          } else {
            setError('⏰ Terlalu banyak request. Silakan tunggu beberapa saat.')
          }
        } else {
          setError(data.error || `Gagal membuat permintaan ${type}`)
        }
      }
    } catch (err) {
      setError('Kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setTransactionLoading(null)
    }
  }

  const joinRoom = async (roomCode: string) => {
    setJoiningRoom(roomCode)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/rooms/${roomCode}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        window.location.href = `/game/${data.gameId}`
      } else {
        setError(data.error || 'Failed to join room')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setJoiningRoom('')
    }
  }

  const [showQrisModal, setShowQrisModal] = useState<string | null>(null)

  const copyRoomCode = (roomCode: string) => {
    navigator.clipboard.writeText(roomCode)
    setSuccess('Room code copied!')
    setTimeout(() => setSuccess(''), 2000)
  }

  const quickDeposit = (bankId?: string) => {
    setTransactionAmount('10000')
    // Switch to transactions tab
    const tabsElement = document.querySelector('[data-value="transactions"]') as HTMLElement
    if (tabsElement) {
      tabsElement.click()
    }
    setSuccess('Select deposit amount and request deposit')
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
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
                  <Dice1 className="w-8 h-8 text-purple-400 relative z-10" />
                </div>
                <h1 className="text-xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  KB RENAN
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                  <Wallet className="w-4 h-4 text-green-400" />
                  <span className="font-semibold text-green-400">
                    Rp {user.balance.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-purple-500/20">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-200">{user.username}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-400">Total Saldo</CardTitle>
                <DollarSign className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">
                  Rp {user.balance.toLocaleString()}
                </div>
                {pendingWithdrawCount > 0 && (
                  <div className="text-xs text-yellow-400 mt-1">
                    ⚠️ Ada withdraw pending - saldo dibekukan
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-400">Room Aktif Anda</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {userActiveRoomsCount}/{maxActiveRooms}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Room yang Anda buat
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-400">Permainan Dimainkan</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">0</div>
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

          <Tabs defaultValue="rooms" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 border border-purple-500/20">
              <TabsTrigger value="rooms" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Ruangan</TabsTrigger>
              <TabsTrigger value="create" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Buat</TabsTrigger>
              <TabsTrigger value="banks" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Bank Saya</TabsTrigger>
              <TabsTrigger value="deposit" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Deposit</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Profil</TabsTrigger>
            </TabsList>

            <TabsContent value="rooms">
              <Card className="glass border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Available Rooms</CardTitle>
                  <CardDescription className="text-gray-400">
                    Join a room to start playing KB RENAN
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                    </div>
                  ) : rooms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No active rooms available. Create a new room to start playing!
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {rooms.map((room) => (
                        <div key={room.id} className="p-6 bg-gradient-to-r from-slate-800/70 to-slate-900/70 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full"></div>
                                  <Dice1 className="w-6 h-6 text-purple-400 relative z-10" />
                                </div>
                                <h3 className="text-lg font-bold text-white">Room {room.roomCode}</h3>
                                <Badge variant={room.status === 'WAITING' ? 'default' : 'secondary'} 
                                       className={room.status === 'WAITING' ? 'bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1' : 'bg-gray-500/20 text-gray-400 border-gray-500/30 px-3 py-1'}>
                                  {room.status}
                                </Badge>
                                <Badge variant={room.betType === 'SMALL' ? 'outline' : 'default'}
                                       className={room.betType === 'SMALL' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10 px-3 py-1' : 'border-purple-500/30 text-purple-400 bg-purple-500/10 px-3 py-1'}>
                                  {room.betType === 'SMALL' ? 'KECIL' : 'BESAR'}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                  <User className="w-4 h-4 text-purple-400" />
                                  <span>Created by: <span className="font-semibold text-white">{room.creator.username}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <DollarSign className="w-4 h-4 text-green-400" />
                                  <span>Bet: <span className="font-bold text-green-400">Rp {room.betAmount.toLocaleString()}</span></span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Clock className="w-4 h-4 text-yellow-400" />
                                  <span>Expires: <span className="text-white">{new Date(room.expiresAt).toLocaleTimeString()}</span></span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-purple-500/20">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyRoomCode(room.roomCode)}
                              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50 px-4"
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Code
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => joinRoom(room.roomCode)}
                              disabled={joiningRoom === room.roomCode || room.status !== 'WAITING'}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              {joiningRoom === room.roomCode ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Join Room
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create">
              <Card className="glass border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Create New Room</CardTitle>
                  <CardDescription className="text-gray-400">
                    Create a new room and invite other players to join
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Bet Type</Label>
                      <select
                        className="w-full p-2 bg-slate-800/50 border border-purple-500/20 text-white rounded-md focus:border-purple-500 focus:ring-purple-500/20"
                        value={newRoom.betType}
                        onChange={(e) => setNewRoom({ ...newRoom, betType: e.target.value })}
                      >
                        <option value="SMALL">Kecil (9-31)</option>
                        <option value="BIG">Besar (32+)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Bet Amount</Label>
                      <Input
                        type="number"
                        min="500"
                        step="500"
                        value={newRoom.betAmount}
                        onChange={(e) => setNewRoom({ ...newRoom, betAmount: parseInt(e.target.value) || 0 })}
                        className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-800/30 p-4 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-white">Aturan Game:</h4>
                      <div className="text-sm text-gray-400">
                        Room Aktif: <span className={`${userActiveRoomsCount >= maxActiveRooms ? 'text-red-400' : 'text-green-400'} font-semibold`}>{userActiveRoomsCount}/{maxActiveRooms}</span>
                      </div>
                    </div>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• 9 dadu akan dilempar</li>
                      <li>• Kecil: Total 9-31 poin</li>
                      <li>• Besar: Total 32+ poin</li>
                      <li>• Pajak 15% untuk kemenangan</li>
                      <li>• Ruangan kadaluarsa dalam 5 menit</li>
                      <li>• Maksimal 3 room aktif per player</li>
                      <li>• Saldo dipotong saat membuat room</li>
                      <li>• Saldo dikembalikan jika room kadaluarsa</li>
                    </ul>
                    {userActiveRoomsCount >= maxActiveRooms && (
                      <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                        ⚠️ Anda sudah mencapai batas maksimal room aktif
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={createRoom} 
                    disabled={creatingRoom || user.balance < newRoom.betAmount || userActiveRoomsCount >= maxActiveRooms}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {creatingRoom ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Room (Saldo: Rp {user.balance.toLocaleString()})
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="banks">
              <Card className="glass border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">My Bank Accounts</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your bank accounts for withdrawals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {banks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>No bank accounts added yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Add your first bank account to enable withdrawals</p>
                        <Button 
                          onClick={() => setShowAddBank(true)}
                          className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Bank Account
                        </Button>
                      </div>
                    ) : (
                      <>
                        {banks.map((bank) => (
                          <div key={bank.id} className="p-4 bg-slate-800/50 border border-purple-500/20 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-white">{bank.bankName}</h4>
                                <p className="text-sm text-gray-400">{bank.accountName}</p>
                                <p className="text-sm text-gray-400">{bank.accountNumber}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                  <span className="text-xs text-green-400 font-medium">Active</span>
                                </div>
                                <CreditCard className="w-8 h-8 text-purple-400" />
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        <Alert className="bg-blue-500/10 border-blue-500/20">
                          <AlertDescription className="text-blue-400 text-sm">
                            💡 <strong>Info:</strong> Anda sudah memiliki akun bank yang terdaftar. 
                            Untuk mengganti bank, silakan hubungi admin untuk menghapus data bank Anda terlebih dahulu.
                          </AlertDescription>
                        </Alert>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deposit">
              <Card className="glass border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Deposit & Withdraw</CardTitle>
                  <CardDescription className="text-gray-400">
                    Request deposit or withdraw funds (Min Deposit: Rp {settings.minDeposit.toLocaleString()}, Min Withdraw: Rp {settings.minWithdraw.toLocaleString()})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pending Transaction Alert */}
                  {pendingTransaction && (
                    <Alert className="bg-yellow-500/10 border-yellow-500/20">
                      <AlertDescription className="text-yellow-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Request Pending:</span>
                          <span>{pendingTransaction.type} - Rp {pendingTransaction.amount.toLocaleString()}</span>
                          <span className="text-xs">(ID: {pendingTransaction.id})</span>
                        </div>
                        <div className="text-xs mt-1">
                          Tunggu hingga request ini disetujui atau ditolak sebelum membuat request baru.
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-800/50 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-400">
                          <ArrowUpRight className="w-5 h-5" />
                          Deposit Request
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          After transferring to admin bank, request deposit confirmation
                        </CardDescription>
                        <div className="text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                          💡 <strong>Aturan:</strong> Hanya 1 request aktif sampai disetujui/ditolak
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-gray-300">Amount</Label>
                          <Input
                            type="number"
                            min={settings.minDeposit}
                            step={settings.minDeposit}
                            placeholder={`Enter amount (min: ${settings.minDeposit.toLocaleString()})`}
                            value={transactionAmount}
                            onChange={(e) => setTransactionAmount(e.target.value)}
                            className="bg-slate-700/50 border-green-500/20 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20"
                          />
                        </div>
                        <Button 
                          onClick={() => createTransaction('DEPOSIT')}
                          disabled={!transactionAmount || parseInt(transactionAmount) < settings.minDeposit || transactionLoading === 'DEPOSIT' || pendingTransaction !== null}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                        >
                          {transactionLoading === 'DEPOSIT' ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                              Processing...
                            </>
                          ) : pendingTransaction ? (
                            <>
                              <Clock className="w-4 h-4 mr-2" />
                              Pending Request
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="w-4 h-4 mr-2" />
                              Request Deposit
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-red-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-400">
                          <ArrowDownRight className="w-5 h-5" />
                          Withdraw Request
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Request withdrawal to your registered bank account
                        </CardDescription>
                        <div className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded border border-yellow-500/20">
                          ⚠️ Perhatian: Saldo akan langsung dibekukan saat request withdraw
                        </div>
                        <div className="text-xs text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                          💡 <strong>Aturan:</strong> Hanya 1 request aktif sampai disetujui/ditolak
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-gray-300">Amount</Label>
                          <Input
                            type="number"
                            min={settings.minWithdraw}
                            step={settings.minWithdraw}
                            placeholder={`Enter amount (min: ${settings.minWithdraw.toLocaleString()})`}
                            value={transactionAmount}
                            onChange={(e) => setTransactionAmount(e.target.value)}
                            className="bg-slate-700/50 border-red-500/20 text-white placeholder:text-gray-500 focus:border-red-500 focus:ring-red-500/20"
                          />
                        </div>
                        <Button 
                          onClick={() => createTransaction('WITHDRAW')}
                          disabled={!transactionAmount || parseInt(transactionAmount) < settings.minWithdraw || transactionLoading === 'WITHDRAW' || pendingTransaction !== null}
                          variant="outline"
                          className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          {transactionLoading === 'WITHDRAW' ? (
                            <>
                              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-red-400/20 border-t-red-400"></div>
                              Processing...
                            </>
                          ) : pendingTransaction ? (
                            <>
                              <Clock className="w-4 h-4 mr-2" />
                              Pending Request
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="w-4 h-4 mr-2" />
                              Request Withdraw
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Admin Banks Section */}
                  <Card className="bg-slate-800/50 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-400">
                        <Building className="w-5 h-5" />
                        Admin Bank Accounts
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Transfer to one of these admin bank accounts for deposit
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {adminBanks.length > 0 ? (
                        <div className="space-y-3">
                          {adminBanks.map((bank) => (
                            <div key={bank.id} className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/10">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-blue-400" />
                                    <span className="font-semibold text-blue-400">{bank.bankName}</span>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-300">
                                      <span className="text-gray-500">Account Name:</span> {bank.accountName}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                      <span className="text-gray-500">Account Number:</span> 
                                      <span className="font-mono bg-slate-800/50 px-2 py-1 rounded ml-1">
                                        {bank.accountNumber}
                                      </span>
                                    </p>
                                  </div>
                                  {bank.qrisImage && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500 mb-1">QRIS Available:</p>
                                      <img 
                                        src={bank.qrisImage} 
                                        alt="QRIS" 
                                        className="w-24 h-24 bg-white rounded-lg p-1 cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => setShowQrisModal(bank.qrisImage)}
                                      />
                                    </div>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    navigator.clipboard.writeText(bank.accountNumber)
                                    setSuccess('Account number copied!')
                                    setTimeout(() => setSuccess(''), 2000)
                                  }}
                                  className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Building className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                          <p className="text-gray-400">No admin bank accounts available</p>
                          <p className="text-sm text-gray-500 mt-1">Please contact admin to add bank accounts</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-400">
                        <Clock className="w-5 h-5" />
                        Transaction History
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Your recent deposit and withdrawal requests
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {transactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Clock className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>No transactions yet</p>
                          <p className="text-sm text-gray-400 mt-1">Your transaction history will appear here</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {transactions.map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                              <div>
                                <p className="font-medium text-white">{transaction.type}</p>
                                <p className="text-sm text-gray-400">{transaction.description}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(transaction.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-white">
                                  Rp {transaction.amount.toLocaleString()}
                                </p>
                                <Badge variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                                       className={transaction.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                                  {transaction.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="glass border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Profile</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your account information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                        <p className="text-gray-400">@{user.username}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                        <p className="text-sm text-gray-400">Total Balance</p>
                        <p className="text-xl font-bold text-green-400">
                          Rp {user.balance.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/20">
                        <p className="text-sm text-gray-400">Account Type</p>
                        <p className="text-xl font-bold text-purple-400">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Add Bank Modal */}
      {showAddBank && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md glass border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Add Bank Account</CardTitle>
              <CardDescription className="text-gray-400">
                Add your bank account for withdrawals. <span className="text-yellow-400 font-medium">Note: You can only add one bank account.</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-500/10 border-yellow-500/20">
                <AlertDescription className="text-yellow-400 text-sm">
                  ⚠️ <strong>Penting:</strong> Anda hanya dapat menambahkan satu akun bank. 
                  Pastikan data bank yang Anda masukkan sudah benar.
                </AlertDescription>
              </Alert>
              <div>
                <Label className="text-gray-300">Bank Name</Label>
                <Input
                  value={newBank.bankName}
                  onChange={(e) => setNewBank({ ...newBank, bankName: e.target.value })}
                  placeholder="e.g., BCA, Mandiri"
                  className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <Label className="text-gray-300">Account Name</Label>
                <Input
                  value={newBank.accountName}
                  onChange={(e) => setNewBank({ ...newBank, accountName: e.target.value })}
                  placeholder="Your account name"
                  className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <Label className="text-gray-300">Account Number</Label>
                <Input
                  value={newBank.accountNumber}
                  onChange={(e) => setNewBank({ ...newBank, accountNumber: e.target.value })}
                  placeholder="Your account number"
                  className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={addBank}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Add Bank
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddBank(false)}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* QRIS Modal */}
      {showQrisModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowQrisModal(null)}>
          <div className="bg-slate-900 rounded-lg p-6 max-w-sm w-full mx-4 border border-purple-500/20" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">QRIS Payment</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowQrisModal(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-center">
              <img 
                src={showQrisModal} 
                alt="QRIS" 
                className="w-64 h-64 bg-white rounded-lg p-2 mx-auto mb-4"
              />
              <p className="text-sm text-gray-400">Scan this QR code with your e-wallet app</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}