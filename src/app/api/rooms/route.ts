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
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rooms = await db.room.findMany({
      where: {
        status: 'WAITING',
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        creator: {
          select: {
            username: true
          }
        },
        _count: {
          select: {
            games: {
              where: {
                gamePlayers: {
                  some: {
                    userId: user.userId
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const roomsWithPlayerCount = rooms.map(room => ({
      ...room,
      playerCount: room._count.games,
      isCreator: room.creatorId === user.userId
    }))

    // Get user's active rooms count
    const userActiveRoomsCount = await db.room.count({
      where: {
        creatorId: user.userId,
        status: 'WAITING',
        expiresAt: {
          gt: new Date()
        }
      }
    })

    return NextResponse.json({ 
      rooms: roomsWithPlayerCount,
      userActiveRoomsCount,
      maxActiveRooms: 3
    })

  } catch (error) {
    console.error('Get rooms error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { betType, betAmount } = await request.json()

    if (!betType || !betAmount) {
      return NextResponse.json(
        { error: 'Bet type and amount are required' },
        { status: 400 }
      )
    }

    if (betAmount < 500) {
      return NextResponse.json(
        { error: 'Minimum bet is 500' },
        { status: 400 }
      )
    }

    // Cek jumlah room aktif yang dimiliki user
    const activeRoomsCount = await db.room.count({
      where: {
        creatorId: user.userId,
        status: 'WAITING',
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (activeRoomsCount >= 3) {
      return NextResponse.json(
        { error: 'Maksimal 3 room aktif yang bisa dibuat' },
        { status: 400 }
      )
    }

    const userData = await db.user.findUnique({
      where: { id: user.userId }
    })

    if (!userData || userData.balance < betAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Potong saldo user saat membuat room
    await db.user.update({
      where: { id: user.userId },
      data: {
        balance: {
          decrement: betAmount
        }
      }
    })

    // Buat transaction record untuk potongan saldo
    await db.transaction.create({
      data: {
        userId: user.userId,
        type: 'WITHDRAW',
        amount: betAmount,
        description: `Potongan saldo untuk membuat room (bet: ${betAmount})`,
        status: 'COMPLETED'
      }
    })

    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    const room = await db.room.create({
      data: {
        roomCode,
        creatorId: user.userId,
        betType,
        betAmount,
        expiresAt
      },
      include: {
        creator: {
          select: {
            username: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Room created successfully',
      room
    })

  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}