import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Cari semua room yang sudah kadaluwarsa dan masih status WAITING
    const expiredRooms = await db.room.findMany({
      where: {
        status: 'WAITING',
        expiresAt: {
          lt: new Date()
        }
      },
      include: {
        creator: true
      }
    })

    const refundResults = []

    for (const room of expiredRooms) {
      try {
        // Update status room menjadi EXPIRED
        await db.room.update({
          where: { id: room.id },
          data: { status: 'EXPIRED' }
        })

        // Kembalikan saldo ke creator
        await db.user.update({
          where: { id: room.creatorId },
          data: {
            balance: {
              increment: room.betAmount
            }
          }
        })

        // Buat transaction record untuk refund
        const refundTransaction = await db.transaction.create({
          data: {
            userId: room.creatorId,
            type: 'DEPOSIT',
            amount: room.betAmount,
            description: `Refund saldo dari room ${room.roomCode} yang kadaluwarsa`,
            status: 'COMPLETED'
          }
        })

        refundResults.push({
          roomId: room.id,
          roomCode: room.roomCode,
          creatorId: room.creatorId,
          creatorUsername: room.creator.username,
          refundAmount: room.betAmount,
          transactionId: refundTransaction.id,
          status: 'refunded'
        })

        console.log(`Refunded ${room.betAmount} to user ${room.creator.username} for expired room ${room.roomCode}`)
      } catch (error) {
        console.error(`Failed to refund room ${room.roomCode}:`, error)
        refundResults.push({
          roomId: room.id,
          roomCode: room.roomCode,
          creatorId: room.creatorId,
          status: 'failed',
          error: error.message
        })
      }
    }

    return NextResponse.json({
      message: `Processed ${expiredRooms.length} expired rooms`,
      processedRooms: expiredRooms.length,
      refundResults
    })

  } catch (error) {
    console.error('Refund expired rooms error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET endpoint untuk melihat room yang perlu di-refund
export async function GET(request: NextRequest) {
  try {
    const expiredRooms = await db.room.findMany({
      where: {
        status: 'WAITING',
        expiresAt: {
          lt: new Date()
        }
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            balance: true
          }
        }
      },
      orderBy: {
        expiresAt: 'asc'
      }
    })

    return NextResponse.json({
      expiredRooms,
      totalRooms: expiredRooms.length,
      totalRefundAmount: expiredRooms.reduce((sum, room) => sum + room.betAmount, 0)
    })

  } catch (error) {
    console.error('Get expired rooms error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}