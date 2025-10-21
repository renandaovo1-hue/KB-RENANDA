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

    const transactions = await db.transaction.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ transactions })

  } catch (error) {
    console.error('Get transactions error:', error)
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

    const { type, amount, description } = await request.json()

    if (!type || !amount) {
      return NextResponse.json(
        { error: 'Type and amount are required' },
        { status: 400 }
      )
    }

    if (amount < 1000) {
      return NextResponse.json(
        { error: 'Minimum amount is 1000' },
        { status: 400 }
      )
    }

    if (!['DEPOSIT', 'WITHDRAW'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      )
    }

    // ANTI-SPAM: Cek apakah user memiliki PENDING request yang sama (untuk DEPOSIT atau WITHDRAW)
    const existingPendingTransaction = await db.transaction.findFirst({
      where: {
        userId: user.userId,
        type: type,
        status: 'PENDING'
      }
    })

    if (existingPendingTransaction) {
      return NextResponse.json(
        { 
          error: `Anda memiliki request ${type} yang masih pending (ID: ${existingPendingTransaction.id}). Tunggu hingga request tersebut disetujui atau ditolak.`,
          existingTransaction: true,
          transactionId: existingPendingTransaction.id
        },
        { status: 429 } // Too Many Requests
      )
    }

    // ANTI-SPAM: Cek apakah user memiliki PENDING request apapun (untuk mencegah mixed requests)
    const anyPendingTransaction = await db.transaction.findFirst({
      where: {
        userId: user.userId,
        status: 'PENDING'
      }
    })

    if (anyPendingTransaction) {
      return NextResponse.json(
        { 
          error: `Anda memiliki request yang masih pending (${anyPendingTransaction.type} - ID: ${anyPendingTransaction.id}). Selesaikan request tersebut terlebih dahulu sebelum membuat request baru.`,
          hasPendingTransaction: true,
          transactionId: anyPendingTransaction.id,
          transactionType: anyPendingTransaction.type
        },
        { status: 429 }
      )
    }

    const userData = await db.user.findUnique({
      where: { id: user.userId }
    })

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (type === 'WITHDRAW' && userData.balance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      )
    }

    // Untuk withdraw, kurangi saldo langsung (freeze balance)
    // Untuk deposit, tunggu approval
    let updatedBalance = userData.balance
    if (type === 'WITHDRAW') {
      updatedBalance = userData.balance - amount
      await db.user.update({
        where: { id: user.userId },
        data: {
          balance: updatedBalance
        }
      })
    }

    const transaction = await db.transaction.create({
      data: {
        userId: user.userId,
        type,
        amount,
        description: description || `${type} request of ${amount}`,
        status: 'PENDING'
      }
    })

    return NextResponse.json({
      message: 'Transaction created successfully',
      transaction,
      newBalance: updatedBalance
    })

  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}