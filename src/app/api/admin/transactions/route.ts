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

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const whereClause: any = {}
    if (userId) whereClause.userId = userId
    if (status) whereClause.status = status
    if (type) whereClause.type = type

    const transactions = await db.transaction.findMany({
      where: whereClause,
      include: {
        user: {
          include: {
            banks: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    // Transform the data to include bank info directly in user object
    const transformedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      user: {
        username: transaction.user.username,
        email: transaction.user.email,
        bankName: transaction.user.banks[0]?.bankName,
        bankAccountNumber: transaction.user.banks[0]?.accountNumber,
        bankAccountName: transaction.user.banks[0]?.accountName
      }
    }))

    return NextResponse.json({ transactions: transformedTransactions })

  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId, status } = await request.json()

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: 'Transaction ID and status are required' },
        { status: 400 }
      )
    }

    if (!['PENDING', 'COMPLETED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true }
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    const updatedTransaction = await db.transaction.update({
      where: { id: transactionId },
      data: { status },
      include: {
        user: {
          include: {
            banks: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    })

    // Transform the data to include bank info directly in user object
    const transformedTransaction = {
      id: updatedTransaction.id,
      userId: updatedTransaction.userId,
      type: updatedTransaction.type,
      amount: updatedTransaction.amount,
      description: updatedTransaction.description,
      status: updatedTransaction.status,
      createdAt: updatedTransaction.createdAt,
      updatedAt: updatedTransaction.updatedAt,
      user: {
        username: updatedTransaction.user.username,
        email: updatedTransaction.user.email,
        bankName: updatedTransaction.user.banks[0]?.bankName,
        bankAccountNumber: updatedTransaction.user.banks[0]?.accountNumber,
        bankAccountName: updatedTransaction.user.banks[0]?.accountName
      }
    }

    // Untuk deposit, tambahkan saldo saat approve
    // Untuk withdraw, saldo sudah berkurang saat request (freeze balance)
    if (status === 'COMPLETED') {
      if (transaction.type === 'DEPOSIT') {
        await db.user.update({
          where: { id: transaction.userId },
          data: {
            balance: {
              increment: transaction.amount
            }
          }
        })
      }
      // Untuk WITHDRAW, saldo sudah berkurang saat request, tidak perlu diubah lagi
    } else if (status === 'REJECTED' && transaction.type === 'WITHDRAW') {
      // Jika withdraw direject, kembalikan saldo
      await db.user.update({
        where: { id: transaction.userId },
        data: {
          balance: {
            increment: transaction.amount
          }
        }
      })
    }

    return NextResponse.json({
      message: 'Transaction updated successfully',
      transaction: transformedTransaction
    })

  } catch (error) {
    console.error('Update transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}