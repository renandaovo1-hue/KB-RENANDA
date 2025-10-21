'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Dice1, 
  Dice2, 
  Dice3, 
  Dice4, 
  Dice5, 
  Dice6,
  Play,
  RotateCcw,
  Trophy,
  DollarSign,
  ArrowLeft,
  Loader2
} from 'lucide-react'

interface GamePlayer {
  id: string
  userId: string
  betType: string
  betAmount: number
  finalScore?: number
  isWinner?: boolean
  status: string
  user: {
    username: string
  }
}

interface Game {
  id: string
  status: string
  currentRound: number
  totalRounds: number
  room: {
    roomCode: string
    betType: string
    betAmount: number
  }
  gamePlayers: GamePlayer[]
  rounds?: any[]
}

interface DiceProps {
  value: number
  rolling?: boolean
}

const DiceComponent: React.FC<DiceProps> = ({ value, rolling = false }) => {
  const getDiceIcon = (val: number) => {
    switch (val) {
      case 1: return <Dice1 className="w-12 h-12" />
      case 2: return <Dice2 className="w-12 h-12" />
      case 3: return <Dice3 className="w-12 h-12" />
      case 4: return <Dice4 className="w-12 h-12" />
      case 5: return <Dice5 className="w-12 h-12" />
      case 6: return <Dice6 className="w-12 h-12" />
      default: return <Dice1 className="w-12 h-12" />
    }
  }

  return (
    <div className={`relative ${rolling ? 'animate-bounce' : ''}`}>
      <div className={`w-20 h-20 bg-gradient-to-br from-white to-gray-100 border-4 border-gray-300 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 ${rolling ? 'animate-spin' : 'hover:scale-105'}`}>
        <div className="text-purple-600">
          {getDiceIcon(value)}
        </div>
      </div>
      {rolling && (
        <div className="absolute inset-0 bg-purple-400/20 rounded-2xl animate-pulse"></div>
      )}
    </div>
  )
}

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string

  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [rolling, setRolling] = useState(false)
  const [diceValues, setDiceValues] = useState<number[]>([1, 1, 1, 1, 1, 1, 1, 1, 1])
  const [gameResult, setGameResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/')
      return
    }

    setCurrentUser(JSON.parse(userData))
    fetchGame()
  }, [gameId, router])

  const fetchGame = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/games/${gameId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setGame(data.game)
      } else {
        setError('Game not found')
      }
    } catch (err) {
      setError('Failed to load game')
    } finally {
      setLoading(false)
    }
  }

  const rollDice = async () => {
    setRolling(true)
    setError('')
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/games/${gameId}/roll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setDiceValues(data.diceValues)
        setGameResult(data.result)
        setGame(prev => prev ? { ...prev, ...data.game } : null)
      } else {
        setError(data.error || 'Failed to roll dice')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setRolling(false)
    }
  }

  const getTotalScore = () => {
    return diceValues.reduce((sum, value) => sum + value, 0)
  }

  const getBetTypeResult = (total: number) => {
    return total <= 31 ? 'SMALL' : 'BIG'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Not Found</h2>
          <Button onClick={() => router.push('/player')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const totalScore = getTotalScore()
  const resultType = getBetTypeResult(totalScore)
  const isSmall = totalScore >= 9 && totalScore <= 31
  const isBig = totalScore >= 32

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.65_0.25_280/0.1),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <header className="glass border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => router.push('/player')} className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full"></div>
                  <Dice1 className="w-8 h-8 text-purple-400 relative z-10" />
                </div>
                <h1 className="text-xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">KB RENAN Game</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Room:</span>
                <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10">{game.room.roomCode}</Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {game.gamePlayers.map((player) => (
            <Card key={player.id} className={`glass border-purple-500/20 ${player.isWinner ? 'border-green-500/50 bg-green-500/10' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  <span>{player.user.username}</span>
                  {player.isWinner && <Trophy className="w-5 h-5 text-yellow-400" />}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Taruhan: {player.betType === 'SMALL' ? 'Kecil' : 'Besar'} - Rp {player.betAmount.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Status:</span>
                    <Badge variant={player.status === 'WON' ? 'default' : 'secondary'} 
                           className={player.status === 'WON' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                      {player.status === 'WON' ? 'MENANG' : player.status === 'LOST' ? 'KALAH' : player.status}
                    </Badge>
                  </div>
                  {player.finalScore && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Skor Akhir:</span>
                      <span className="font-bold text-white">{player.finalScore}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8 glass border-purple-500/20 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-purple-500/20">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full"></div>
                <Dice1 className="w-8 h-8 text-purple-400 relative z-10" />
              </div>
              Dice Board
              <div className="relative">
                <div className="absolute inset-0 bg-pink-500/20 blur-lg rounded-full"></div>
                <Dice1 className="w-8 h-8 text-pink-400 relative z-10" />
              </div>
            </CardTitle>
            <CardDescription className="text-purple-300 text-lg font-medium">
              9 Dadu - Kecil (9-31) vs Besar (32+)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
              {diceValues.map((value, index) => (
                <div key={index} className="flex justify-center">
                  <DiceComponent value={value} rolling={rolling} />
                </div>
              ))}
            </div>
            
            <div className="text-center space-y-6">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Total Skor: {totalScore}
              </div>
              
              <div className="flex justify-center gap-6">
                <Badge variant={isSmall ? 'default' : 'outline'} className="text-xl px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                  Kecil (9-31)
                </Badge>
                <Badge variant={isBig ? 'default' : 'outline'} className="text-xl px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                  Besar (32+)
                </Badge>
              </div>

              {!gameResult && game.status === 'PLAYING' && (
                <Button 
                  onClick={rollDice} 
                  disabled={rolling}
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {rolling ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Melempar Dadu...
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 mr-3" />
                      Lempar Dadu
                    </>
                  )}
                </Button>
              )}

              {gameResult && (
                <div className="space-y-6">
                  <Alert className={gameResult.winner ? 'border-green-500/30 bg-green-500/10 shadow-lg' : 'border-red-500/30 bg-red-500/10 shadow-lg'}>
                    <AlertDescription className={`text-lg font-semibold ${gameResult.winner ? 'text-green-400' : 'text-red-400'}`}>
                      {gameResult.message}
                    </AlertDescription>
                  </Alert>
                  
                  {gameResult.winner && gameResult.grossWinning && (
                    <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-green-500/30">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-300">Total Kemenangan:</span>
                          <span className="font-bold text-green-400">Rp {gameResult.grossWinning.toLocaleString()}</span>
                        </div>
                        
                        {gameResult.taxAmount && (
                          <div className="flex justify-between items-center text-lg">
                            <span className="text-red-400">Pajak (15%):</span>
                            <span className="font-bold text-red-400">-Rp {gameResult.taxAmount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {gameResult.netWinning && (
                          <div className="flex justify-between items-center text-xl pt-3 border-t border-green-500/30">
                            <span className="text-gray-200 font-semibold">Kemenangan Bersih:</span>
                            <span className="font-bold text-green-400">Rp {gameResult.netWinning.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={() => router.push('/player')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Main Lagi
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  </div>
  )
}