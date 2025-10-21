'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6,
  Users,
  DollarSign,
  Clock,
  Trophy,
  TrendingUp,
  Wallet,
  Shield,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function TutorialPage() {
  const steps = [
    {
      title: "1. Login atau Register",
      description: "Masuk ke akun Anda atau buat akun baru untuk mulai bermain.",
      icon: <Users className="w-6 h-6" />,
      details: [
        "Pilih role 'Player' untuk bermain",
        "Gunakan username dan password yang valid",
        "Admin login tersedia untuk pengelolaan sistem"
      ]
    },
    {
      title: "2. Top Up Saldo",
      description: "Isi saldo akun Anda minimal Rp 1.000 untuk bisa bermain.",
      icon: <Wallet className="w-6 h-6" />,
      details: [
        "Minimal deposit: Rp 1.000",
        "Minimal withdraw: Rp 1.000",
        "Hubungi admin untuk proses top up"
      ]
    },
    {
      title: "3. Buat atau Join Room",
      description: "Buat room baru atau bergabung dengan room yang sudah ada.",
      icon: <Users className="w-6 h-6" />,
      details: [
        "Room memiliki kode unik 6 karakter",
        "Room kadaluarsa dalam 5 menit",
        "Share kode room ke teman untuk bermain bersama"
      ]
    },
    {
      title: "4. Pilih Taruhan",
      description: "Pilih antara taruhan SMALL (9-31) atau BIG (32+).",
      icon: <DollarSign className="w-6 h-6" />,
      details: [
        "Small: Total nilai 9 dadu antara 9-31",
        "Big: Total nilai 9 dadu 32 atau lebih",
        "Jika Anda pilih Small, lawan otomatis dapat Big"
      ]
    },
    {
      title: "5. Roll Dadu",
      description: "Klik 'Roll Dice' untuk memulai permainan.",
      icon: <Dice1 className="w-6 h-6" />,
      details: [
        "9 dadu akan dilempar secara acak",
        "Setiap dadu memiliki nilai 1-6",
        "Total nilai semua dadu akan dihitung"
      ]
    },
    {
      title: "6. Hasil dan Kemenangan",
      description: "Lihat hasil permainan dan klaim kemenangan Anda.",
      icon: <Trophy className="w-6 h-6" />,
      details: [
        "Pemenang mendapatkan taruhan lawan",
        "Tax 15% dipotong dari kemenangan",
        "Saldo otomatis update setelah permainan"
      ]
    }
  ]

  const rules = [
    {
      title: "Aturan Permainan",
      items: [
        "9 dadu dengan 6 sisi (1-6)",
        "Small: Total 9-31 poin",
        "Big: Total 32+ poin",
        "Minimal taruhan: Rp 1.000",
        "Maksimal 2 pemain per room"
      ]
    },
    {
      title: "Sistem Keamanan",
      items: [
        "Random number generation terjamin fair",
        "Admin tidak bisa memanipulasi hasil",
        "Semua transaksi tercatat",
        "Sistem terenkripsi dan aman"
      ]
    },
    {
      title: "Tax dan Fee",
      items: [
        "Tax 15% dari setiap kemenangan",
        "Tidak ada fee untuk kekalahan",
        "Tax digunakan untuk pengembangan sistem",
        "Transparansi penuh dalam perhitungan"
      ]
    }
  ]

  const tips = [
    "Pelajari pola distribusi total 9 dadu",
    "Kelola saldo dengan bijak",
    "Jangan terbawa emosi saat kalah",
    "Batasi waktu bermain Anda",
    "Gunakan room code untuk bermain dengan teman"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Dice1 className="w-8 h-8 text-purple-600" />
              <h1 className="text-xl font-bold text-gray-900">Tutorial Bermain</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cara Bermain KB RENAN
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pelajari cara bermain game dadu 9 sisi yang adil dan transparan. 
            Menangkan hadiah dengan strategi dan keberuntungan Anda!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Langkah demi Langkah</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        {step.icon}
                      </div>
                      {step.title}
                    </CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Aturan & Regulasi</h3>
              <div className="space-y-4">
                {rules.map((rule, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        {rule.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {rule.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tips & Strategi</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Siap untuk Bermain?</h3>
          <p className="text-lg mb-6 opacity-90">
            Bergabunglah dengan ribuan pemain lain dan rasakan sensasi kemenangan!
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.location.href = '/'}
            >
              Mulai Bermain
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-600"
              onClick={() => window.location.href = '/player'}
            >
              Dashboard Player
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 KB RENAN - Game Dadu Online Fair Play</p>
          <p className="mt-2">Dibangun dengan Next.js, TypeScript, dan Prisma</p>
        </div>
      </main>
    </div>
  )
}