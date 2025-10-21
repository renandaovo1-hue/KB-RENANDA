'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft, User } from 'lucide-react'

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (formData: FormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const username = formData.get('username') as string
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const name = formData.get('name') as string
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, name, role: 'PLAYER' }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Registrasi berhasil! Silakan login.')
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      } else {
        setError(data.error || 'Registrasi gagal')
      }
    } catch (err) {
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
              <User className="w-20 h-20 text-purple-400 relative z-10 drop-shadow-2xl" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Register Player
          </h1>
          <p className="text-gray-400 text-lg">Buat akun baru untuk bermain</p>
        </div>

        <Card className="glass border-purple-500/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-white">Daftar Akun Baru</CardTitle>
            <CardDescription className="text-gray-400">
              Isi data diri Anda untuk membuat akun
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleRegister(formData)
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="bg-slate-800/50 border-purple-500/20 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                  required
                />
              </div>
              
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
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Masukkan email"
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
                  minLength={6}
                />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  'Daftar Sekarang'
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

            {success && (
              <Alert className="mt-6 border-green-500/20 bg-green-500/10">
                <AlertDescription className="text-green-400">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                className="text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                onClick={() => window.location.href = '/'}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}