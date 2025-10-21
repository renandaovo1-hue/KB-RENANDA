'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Loader2, Dice1, User, Shield, X, CircleDollarSign, TrendingUp, Clock, Users } from 'lucide-react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Cek apakah user sudah melihat popup welcome
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (!hasSeenWelcome) {
      setShowWelcome(true)
    }
  }, [])

  const handleCloseWelcome = () => {
    setShowWelcome(false)
    localStorage.setItem('hasSeenWelcome', 'true')
  }

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true)
    setError('')
    
    try {
      const username = formData.get('username') as string
      const password = formData.get('password') as string
      
      console.log('Login attempt:', { username, password: '***' })
      
      if (!username || !password) {
        setError('Username dan password harus diisi')
        setIsLoading(false)
        return
      }
      
      // Try admin first if username contains 'admin', otherwise try player first
      const roles: ('admin' | 'player')[] = username.toLowerCase().includes('admin') 
        ? ['admin', 'player'] 
        : ['player', 'admin']
      
      console.log('Trying roles:', roles)
      
      let loginSuccess = false
      let lastError = ''
      
      for (const role of roles) {
        try {
          console.log(`Attempting login as ${role}...`)
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role }),
          })
          
          const data = await response.json()
          console.log(`Login response for ${role}:`, { status: response.status, data })
          
          if (response.ok) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            
            // Redirect based on actual user role from server
            if (data.user.role === 'ADMIN') {
              console.log('Redirecting to admin...')
              window.location.href = '/admin'
            } else {
              console.log('Redirecting to player...')
              window.location.href = '/player'
            }
            loginSuccess = true
            break
          } else {
            lastError = data.error || 'Login failed'
            console.log(`Login failed for ${role}:`, lastError)
          }
        } catch (err) {
          lastError = 'Terjadi kesalahan jaringan'
          console.log(`Network error for ${role}:`, err)
          continue
        }
      }
      
      if (!loginSuccess) {
        console.log('All login attempts failed:', lastError)
        setError(lastError)
      }
    } catch (err) {
      console.log('Login error:', err)
      setError('Terjadi kesalahan jaringan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.65_0.25_280/0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
              <Dice1 className="w-20 h-20 text-purple-400 relative z-10 drop-shadow-2xl" />
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full p-1.5 shadow-lg">
                <span className="text-sm font-bold">9</span>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            KB RENAN
          </h1>
          <p className="text-gray-400 text-lg">Game Dadu 9 Sisi Online</p>
        </div>

        <Card className="glass border-purple-500/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-white">Login</CardTitle>
            <CardDescription className="text-gray-400">
              Masuk ke akun Anda untuk bermain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleLogin(formData)
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Masukkan username"
                  className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Masuk...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            {error && (
              <Alert className="mt-6 border-red-500/20 bg-red-500/10">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-6 text-center">
              <Button 
                variant="link" 
                className="text-sm text-purple-400 hover:text-purple-300"
                onClick={() => window.location.href = '/register'}
              >
                Belum punya akun? Register
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="outline" 
            className="text-sm border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-500/30"
            onClick={() => setShowWelcome(true)}
          >
            📖 Panduan Bermain
          </Button>
          <Button 
            variant="outline" 
            className="text-sm border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 hover:border-purple-500/30"
            onClick={() => window.location.href = '/tutorial'}
          >
            🎮 Tutorial Lengkap
          </Button>
        </div>
      </div>

      {/* Popup Welcome Cara Bermain */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-2xl bg-slate-900 border-purple-500/20 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
              <Dice1 className="w-8 h-8 text-purple-400" />
              Selamat Datang di KB RENAN!
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-base">
              Game Dadu 9 Sisi Online - Panduan Singkat Cara Bermain
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Apa itu Game Dadu 9 Sisi */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <Dice1 className="w-5 h-5" />
                Apa itu Game Dadu 9 Sisi?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Game dadu inovatif dengan 9 sisi (1-9) yang memberikan pengalaman bermain yang unik dan seru. 
                Setiap sisi memiliki peluang yang sama untuk keluar, membuat permainan adil dan menegangkan!
              </p>
            </div>

            {/* Cara Bermain */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Cara Bermain
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <p><strong>Login</strong> - Masuk menggunakan username dan password Anda</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <p><strong>Isi Saldo</strong> - Lakukan deposit melalui menu Bank</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <p><strong>Pilih Angka</strong> - Tebak angka 1-9 yang akan keluar</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">4</div>
                  <p><strong>Tentukan Taruhan</strong> - Masukkan jumlah taruhan minimal 10K</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">5</div>
                  <p><strong>Kocok Dadu</strong> - Klik tombol kocok dan tunggu hasilnya</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 text-purple-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mt-0.5">6</div>
                  <p><strong>Menang</strong> - Jika tebakan benar, dapatkan 8x lipat taruhan!</p>
                </div>
              </div>
            </div>

            {/* Aturan Main */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Aturan Main
              </h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-green-400" />
                  <p><strong>Minimal Bet:</strong> Rp 10.000</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                  <p><strong>Hadiah Kemenangan:</strong> 8x lipat taruhan</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <p><strong>Fair Play:</strong> 9 sisi dadu (1-9) dengan peluang sama</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <p><strong>Waktu Proses:</strong> Deposit & withdraw 1-3 menit</p>
                </div>
              </div>
            </div>

            {/* Tips & Trik */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20">
              <h3 className="text-lg font-semibold text-purple-400 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                💡 Tips & Trik
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Mulai dengan taruhan kecil untuk mengenal pola permainan</li>
                <li>• Kelola saldo dengan bijak, jangan terbawa emosi</li>
                <li>• Tetapkan batas harian untuk kemenangan dan kekalahan</li>
                <li>• Istirahat sejenak jika sedang tidak beruntung</li>
                <li>• Nikmati permainan dan jangan jadikan sebagai beban</li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/10 text-center">
              <p className="text-gray-400 mb-2">Butuh bantuan?</p>
              <p className="text-purple-400 font-semibold">Hubungi admin kami untuk informasi lebih lanjut</p>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button 
              onClick={handleCloseWelcome}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8"
            >
              Mengerti, Mari Bermain!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}