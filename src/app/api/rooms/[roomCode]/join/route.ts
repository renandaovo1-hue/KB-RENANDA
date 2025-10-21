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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { roomCode } = await params

    const room = await db.room.findUnique({
      where: { roomCode },
      include: {
        creator: true
      }
    })

    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    if (room.status !== 'WAITING') {
      return NextResponse.json(
        { error: 'Room is not available' },
        { status: 400 }
      )
    }

    if (room.expiresAt < new Date()) {
      await db.room.update({
        where: { id: room.id },
        data: { status: 'EXPIRED' }
      })
      return NextResponse.json(
        { error: 'Room has expired' },
        { status: 400 }
      )
    }

    if (room.creatorId === user.userId) {
      return NextResponse.json(
        { error: 'Cannot join your own room' },
        { status: 400 }
      )
    }

    const userData = await db.user.findUnique({
      where: { id: user.userId }
    })

    if (!userData || userData.balance < room.betAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    const existingGame = await db.game.findFirst({
      where: {
        roomId: room.id,
        status: 'PLAYING'
      },
      include: {
        gamePlayers: true
      }
    })

    if (existingGame) {
      const alreadyJoined = existingGame.gamePlayers.some(
        player => player.userId === user.userId
      )
      if (alreadyJoined) {
        return NextResponse.json(
          { error: 'Already joined this game' },
          { status: 400 }
        )
      }

      if (existingGame.gamePlayers.length >= 2) {
        return NextResponse.json(
          { error: 'Game is full' },
          { status: 400 }
        )
      }
    }

    const game = await db.game.create({
      data: {
        roomId: room.id,
        status: 'PLAYING'
      }
    })

    const oppositeBetType = room.betType === 'SMALL' ? 'BIG' : 'SMALL'

    await db.gamePlayer.create({
      data: {
        gameId: game.id,
        userId: user.userId,
        betType: oppositeBetType,
        betAmount: room.betAmount
      }
    })

    await db.gamePlayer.create({
      data: {
        gameId: game.id,
        userId: room.creatorId,
        betType: room.betType,
        betAmount: room.betAmount
      }
    })

    await db.room.update({
      where: { id: room.id },
      data: { status: 'PLAYING' }
    })

    return NextResponse.json({
      message: 'Joined room successfully',
      gameId: game.id
    })

  } catch (error) {
    console.error('Join room error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}