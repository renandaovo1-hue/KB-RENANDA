import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    if (decoded.role !== 'ADMIN') {
      return null
    }
    return decoded
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const totalPlayers = await db.user.count({
      where: { role: 'PLAYER' }
    })

    const totalGames = await db.game.count()

    const activeRooms = await db.room.count({
      where: {
        status: 'WAITING',
        expiresAt: {
          gt: new Date()
        }
      }
    })

    const gamePlayers = await db.gamePlayer.findMany({
      where: {
        status: {
          in: ['WON', 'LOST']
        }
      }
    })

    const totalBets = gamePlayers.reduce((sum, player) => sum + player.betAmount, 0)

    const totalTax = gamePlayers.reduce((sum, player) => {
      return sum + (player.taxAmount || 0)
    }, 0)

    return NextResponse.json({
      stats: {
        totalPlayers,
        totalGames,
        totalBets,
        totalTax,
        activeRooms
      }
    })

  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}