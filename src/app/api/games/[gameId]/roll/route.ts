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

function rollDice(): number[] {
  const dice = []
  for (let i = 0; i < 9; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1)
  }
  return dice
}

function calculateTax(amount: number): number {
  return Math.floor(amount * 0.15) // 15% tax
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { gameId } = await params

    const game = await db.game.findUnique({
      where: { id: gameId },
      include: {
        gamePlayers: {
          include: {
            user: true
          }
        },
        room: true
      }
    })

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    if (game.status !== 'PLAYING') {
      return NextResponse.json({ error: 'Game is not in playing state' }, { status: 400 })
    }

    if (game.gamePlayers.length !== 2) {
      return NextResponse.json({ error: 'Game requires exactly 2 players' }, { status: 400 })
    }

    const diceValues = rollDice()
    const totalScore = diceValues.reduce((sum, value) => sum + value, 0)
    const resultType = totalScore <= 31 ? 'SMALL' : 'BIG'

    const round = await db.round.create({
      data: {
        gameId: game.id,
        playerId: game.gamePlayers[0].id,
        roundNumber: 1,
        dice1: diceValues[0],
        dice2: diceValues[1],
        dice3: diceValues[2],
        dice4: diceValues[3],
        dice5: diceValues[4],
        dice6: diceValues[5],
        dice7: diceValues[6],
        dice8: diceValues[7],
        dice9: diceValues[8],
        totalScore
      }
    })

    const winner = game.gamePlayers.find(player => player.betType === resultType)
    const loser = game.gamePlayers.find(player => player.betType !== resultType)

    if (!winner || !loser) {
      return NextResponse.json({ error: 'Could not determine winner' }, { status: 500 })
    }

    const taxAmount = calculateTax(game.room.betAmount)
    const netWinning = game.room.betAmount - taxAmount

    await db.gamePlayer.update({
      where: { id: winner.id },
      data: {
        finalScore: totalScore,
        isWinner: true,
        status: 'WON',
        taxAmount,
        netWinning
      }
    })

    await db.gamePlayer.update({
      where: { id: loser.id },
      data: {
        finalScore: totalScore,
        isWinner: false,
        status: 'LOST',
        taxAmount: 0,
        netWinning: -game.room.betAmount
      }
    })

    await db.user.update({
      where: { id: winner.userId },
      data: {
        balance: {
          increment: netWinning
        }
      }
    })

    await db.user.update({
      where: { id: loser.userId },
      data: {
        balance: {
          decrement: game.room.betAmount
        }
      }
    })

    await db.transaction.createMany({
      data: [
        {
          userId: winner.userId,
          type: 'WIN',
          amount: game.room.betAmount,
          description: `Won game ${gameId}`,
          status: 'COMPLETED'
        },
        {
          userId: winner.userId,
          type: 'TAX',
          amount: -taxAmount,
          description: `Tax on game ${gameId}`,
          status: 'COMPLETED'
        },
        {
          userId: loser.userId,
          type: 'LOSE',
          amount: -game.room.betAmount,
          description: `Lost game ${gameId}`,
          status: 'COMPLETED'
        }
      ]
    })

    await db.game.update({
      where: { id: game.id },
      data: {
        status: 'COMPLETED'
      }
    })

    await db.room.update({
      where: { id: game.roomId },
      data: {
        status: 'COMPLETED'
      }
    })

    const updatedGame = await db.game.findUnique({
      where: { id: gameId },
      include: {
        gamePlayers: {
          include: {
            user: {
              select: {
                username: true
              }
            }
          }
        }
      }
    })

    const isCurrentUserWinner = winner.userId === user.userId

    return NextResponse.json({
      message: 'Dice rolled successfully',
      diceValues,
      result: {
        totalScore,
        resultType,
        winner: isCurrentUserWinner,
        taxAmount: isCurrentUserWinner ? taxAmount : 0,
        netWinning: isCurrentUserWinner ? netWinning : 0,
        grossWinning: isCurrentUserWinner ? game.room.betAmount : 0,
        message: isCurrentUserWinner 
          ? `You won! Total: ${totalScore} (${resultType}). Won: Rp ${game.room.betAmount.toLocaleString()}, Tax: Rp ${taxAmount.toLocaleString()}, Net: Rp ${netWinning.toLocaleString()}`
          : `You lost! Total: ${totalScore} (${resultType}). Lost: Rp ${game.room.betAmount.toLocaleString()}`
      },
      game: updatedGame
    })

  } catch (error) {
    console.error('Roll dice error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}