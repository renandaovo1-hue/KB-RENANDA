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

    let banks

    if (userId) {
      banks = await db.bank.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              username: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      banks = await db.bank.findMany({
        include: {
          user: {
            select: {
              username: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json({ banks })

  } catch (error) {
    console.error('Get banks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = verifyToken(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId, bankName, accountName, accountNumber, qrisImage } = await request.json()

    if (!userId || !bankName || !accountName || !accountNumber) {
      return NextResponse.json(
        { error: 'User ID, bank name, account name, and account number are required' },
        { status: 400 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const bank = await db.bank.create({
      data: {
        userId,
        bankName,
        accountName,
        accountNumber,
        qrisImage
      },
      include: {
        user: {
          select: {
            username: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Bank account created successfully',
      bank
    })

  } catch (error) {
    console.error('Create bank error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}